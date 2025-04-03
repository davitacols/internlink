import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { query, queryOne } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { GraduationCap, BookOpen, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import MessageUserButton from "@/components/message-user-button"

interface Student {
  id: string
  userId: string
  school: string
  major: string
  graduationYear: number
  bio: string
  profileCompletion: number
  userName: string
  userEmail: string
}

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
}

async function getStudent(id: string): Promise<Student | null> {
  return await queryOne<Student>(
    `
    SELECT s.*, u.name as "userName", u.email as "userEmail"
    FROM "Student" s
    JOIN "User" u ON s."userId" = u.id
    WHERE s.id = $1
  `,
    [id],
  )
}

async function getStudentSkills(studentId: string): Promise<Skill[]> {
  return await query<Skill>(
    `
    SELECT s.id, s.name, s.category, ss.proficiency
    FROM "StudentSkill" ss
    JOIN "Skill" s ON ss."skillId" = s.id
    WHERE ss."studentId" = $1
    ORDER BY ss.proficiency DESC
  `,
    [studentId],
  )
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const student = await getStudent(params.id)

  if (!student) {
    return {
      title: "Student Not Found",
    }
  }

  return {
    title: `${student.userName}'s Profile | InternLink`,
    description: student.bio?.substring(0, 160) || `${student.userName}'s profile on InternLink`,
  }
}

export default async function StudentProfilePage({ params }: { params: { id: string } }) {
  const student = await getStudent(params.id)

  if (!student) {
    notFound()
  }

  const skills = await getStudentSkills(student.id)

  // Group skills by category
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>,
  )

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.userName}`}
                  alt={student.userName}
                />
                <AvatarFallback>{student.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{student.userName}</CardTitle>
              <CardDescription>{student.userEmail}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <GraduationCap className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">School</p>
                    <p className="text-muted-foreground">{student.school}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <BookOpen className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Major</p>
                    <p className="text-muted-foreground">{student.major}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Graduation Year</p>
                    <p className="text-muted-foreground">{student.graduationYear}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex gap-2 mt-4">
                <MessageUserButton userId={student.userId} />
                <Button className="w-full">Contact Student</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{student.bio || "No bio provided."}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h3 className="text-lg font-semibold mb-3">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <Badge key={skill.id} variant={skill.proficiency >= 4 ? "default" : "outline"}>
                        {skill.name}
                        {skill.proficiency === 5 && " (Expert)"}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}

              {skills.length === 0 && <p className="text-muted-foreground">No skills listed.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

