import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { neon } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Mail } from "lucide-react"

async function getStudentDetails(studentId: string, schoolId: string) {
  const sql = neon(process.env.DATABASE_URL!)

  // Get student details
  const studentQuery = await sql`
    SELECT s.*, u.email
    FROM students s
    JOIN users u ON s.user_id = u.id
    WHERE s.id = ${studentId} AND s.school_id = ${schoolId}
  `

  if (studentQuery.length === 0) {
    return null
  }

  const student = studentQuery[0]

  // Get student skills
  const skills = await sql`
    SELECT ss.skill_id, ss.proficiency, s.name
    FROM student_skills ss
    JOIN skills s ON ss.skill_id = s.id
    WHERE ss.student_id = ${studentId}
    ORDER BY ss.proficiency DESC
  `

  // Get student applications
  const applications = await sql`
    SELECT a.id, a.created_at, a.status, a.cover_letter,
           i.title as internship_title, i.location as internship_location,
           c.name as company_name
    FROM applications a
    JOIN internships i ON a.internship_id = i.id
    JOIN companies c ON i.company_id = c.id
    WHERE a.student_id = ${studentId}
    ORDER BY a.created_at DESC
  `

  return {
    student,
    skills,
    applications,
  }
}

async function StudentDetailsContent({ params }: { params: { id: string } }) {
  const session = await getSession()
  const schoolId = session?.user?.schoolId

  if (!schoolId) {
    return <div>School profile not found</div>
  }

  const studentDetails = await getStudentDetails(params.id, schoolId)

  if (!studentDetails) {
    notFound()
  }

  const { student, skills, applications } = studentDetails

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Student Profile</CardTitle>
          <CardDescription>View detailed information about this student</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium">Personal Information</h3>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Name</span>
                  <span>{student.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Email</span>
                  <span>{student.email}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Major</span>
                  <span>{student.major}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Graduation Year</span>
                  <span>{student.graduation_year}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">GPA</span>
                  <span>{student.gpa || "Not provided"}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="font-medium">Bio</span>
                  <span className="text-right max-w-[250px]">{student.bio || "Not provided"}</span>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Student
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium">Skills</h3>
              <div className="mt-3">
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill: any) => (
                      <Badge key={skill.skill_id} variant="outline" className="px-2.5 py-1">
                        {skill.name}
                        <span className="ml-1 text-xs text-muted-foreground">({skill.proficiency}/5)</span>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No skills listed</p>
                )}
              </div>

              <h3 className="text-lg font-medium mt-6">Application Summary</h3>
              <div className="mt-3 space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Total Applications</span>
                  <span>{applications.length}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Pending</span>
                  <span>{applications.filter((a: any) => a.status === "PENDING").length}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Accepted</span>
                  <span>{applications.filter((a: any) => a.status === "ACCEPTED").length}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="font-medium">Rejected</span>
                  <span>{applications.filter((a: any) => a.status === "REJECTED").length}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application History</CardTitle>
          <CardDescription>All internship applications submitted by this student</CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Internship</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app: any) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.internship_title}</TableCell>
                    <TableCell>{app.company_name}</TableCell>
                    <TableCell>{app.internship_location}</TableCell>
                    <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          app.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : app.status === "ACCEPTED"
                              ? "bg-green-100 text-green-800"
                              : app.status === "REJECTED"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-muted-foreground">No applications found</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function StudentDetails({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/school/students">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Student Details</h1>
      </div>
      <Suspense fallback={<StudentDetailsSkeleton />}>
        <StudentDetailsContent params={params} />
      </Suspense>
    </div>
  )
}

function StudentDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Skeleton className="h-5 w-40" />
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              <Skeleton className="h-9 w-36 mt-2" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-5 w-48 mt-4" />
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

