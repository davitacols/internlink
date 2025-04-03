import { Suspense } from "react"
import { getSession } from "@/lib/auth"
import { neon } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

async function getSchoolDashboardData(schoolId: string) {
  const sql = neon(process.env.DATABASE_URL!)

  // Get total students count
  const studentsCount = await sql`
    SELECT COUNT(*) as count 
    FROM students 
    WHERE school_id = ${schoolId}
  `

  // Get active internships count (internships with at least one student from this school)
  const activeInternshipsCount = await sql`
    SELECT COUNT(DISTINCT i.id) as count 
    FROM internships i
    JOIN applications a ON i.id = a.internship_id
    JOIN students s ON a.student_id = s.id
    WHERE s.school_id = ${schoolId} AND i.status = 'ACTIVE'
  `

  // Get placed students count (students with accepted applications)
  const placedStudentsCount = await sql`
    SELECT COUNT(DISTINCT s.id) as count 
    FROM students s
    JOIN applications a ON s.id = a.student_id
    WHERE s.school_id = ${schoolId} AND a.status = 'ACCEPTED'
  `

  // Get recent applications
  const recentApplications = await sql`
    SELECT a.id, a.created_at, a.status, s.name as student_name, i.title as internship_title, c.name as company_name
    FROM applications a
    JOIN students s ON a.student_id = s.id
    JOIN internships i ON a.internship_id = i.id
    JOIN companies c ON i.company_id = c.id
    WHERE s.school_id = ${schoolId}
    ORDER BY a.created_at DESC
    LIMIT 5
  `

  return {
    studentsCount: studentsCount[0]?.count || 0,
    activeInternshipsCount: activeInternshipsCount[0]?.count || 0,
    placedStudentsCount: placedStudentsCount[0]?.count || 0,
    recentApplications,
  }
}

async function SchoolDashboardContent() {
  const session = await getSession()
  const schoolId = session?.user?.schoolId

  if (!schoolId) {
    return <div>School profile not found</div>
  }

  const dashboardData = await getSchoolDashboardData(schoolId)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.studentsCount}</div>
            <p className="text-xs text-muted-foreground">Students registered from your school</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Internships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.activeInternshipsCount}</div>
            <p className="text-xs text-muted-foreground">Internships with your students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Placed Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.placedStudentsCount}</div>
            <p className="text-xs text-muted-foreground">Students with accepted applications</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Latest internship applications from your students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.recentApplications.length > 0 ? (
              <div className="rounded-md border">
                <div className="grid grid-cols-5 gap-4 p-4 font-medium">
                  <div>Student</div>
                  <div>Internship</div>
                  <div>Company</div>
                  <div>Date</div>
                  <div>Status</div>
                </div>
                <div className="divide-y">
                  {dashboardData.recentApplications.map((app: any) => (
                    <div key={app.id} className="grid grid-cols-5 gap-4 p-4">
                      <div className="truncate">{app.student_name}</div>
                      <div className="truncate">{app.internship_title}</div>
                      <div className="truncate">{app.company_name}</div>
                      <div>{new Date(app.created_at).toLocaleDateString()}</div>
                      <div>
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">No recent applications found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SchoolDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">School Dashboard</h1>
      </div>
      <Suspense fallback={<DashboardSkeleton />}>
        <SchoolDashboardContent />
      </Suspense>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

