import { sql } from "@/lib/db-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, Edit } from "lucide-react"
import Link from "next/link"
import StudentSkills from "@/components/student-skills"

// This is a mock function - in a real app, you would get the current user ID from auth
async function getCurrentUserId() {
  // Get the first student for demo purposes
  const students = await sql`
    SELECT s."userId" FROM "Student" s
    JOIN "User" u ON s."userId" = u.id
    WHERE u.email = 'student@example.com'
    LIMIT 1
  `

  return students[0]?.userId
}

export default async function StudentProfilePage() {
  const userId = await getCurrentUserId()

  if (!userId) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Student Profile Not Found</h1>
        <p className="mb-6">Please sign in or create a student account.</p>
        <Button asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  // Fetch student profile
  const students = await sql`
    SELECT 
      s.id,
      s.school,
      s.major,
      s."graduationYear",
      s.bio,
      s."profileCompletion",
      u.name,
      u.email,
      u."profileImage"
    FROM "Student" s
    JOIN "User" u ON s."userId" = u.id
    WHERE u.id = ${userId}
    LIMIT 1
  `

  if (students.length === 0) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Student Profile Not Found</h1>
        <p className="mb-6">Please complete your student profile.</p>
        <Button asChild>
          <Link href="/profile/student/edit">Complete Profile</Link>
        </Button>
      </div>
    )
  }

  const student = students[0]

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Student Profile</h1>
        <Button asChild>
          <Link href="/profile/student/edit" className="flex items-center">
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                  <img
                    src={student.profileImage || "/placeholder.svg?height=96&width=96"}
                    alt={student.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-bold">{student.name}</h2>
                <p className="text-muted-foreground">{student.email}</p>

                <div className="mt-4 w-full">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Profile Completion</span>
                    <span>{student.profileCompletion}%</span>
                  </div>
                  <Progress value={student.profileCompletion} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="mr-2 h-5 w-5" /> Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">{student.school}</h3>
                  <p className="text-sm text-muted-foreground">{student.major}</p>
                  <p className="text-sm">Class of {student.graduationYear}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                  <CardDescription>Your professional summary</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{student.bio || "No bio provided yet."}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                  <CardDescription>Your professional capabilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <StudentSkills studentId={student.id} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Internship Applications</CardTitle>
                  <CardDescription>Track your application status</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-muted-foreground">You haven't applied to any internships yet.</p>
                  <div className="flex justify-center">
                    <Button asChild>
                      <Link href="/internships">Browse Internships</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

