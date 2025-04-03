import { Suspense } from "react"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { neon } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { PlusCircle } from "lucide-react"

async function getSchoolPrograms(schoolId: string) {
  const sql = neon(process.env.DATABASE_URL!)

  // In a real app, we would have a programs table
  // For now, we'll use sample data
  const programs = [
    {
      id: "1",
      name: "Computer Science",
      description: "Bachelor's degree program in Computer Science",
      students_count: 120,
      internship_rate: 75,
      top_skills: ["JavaScript", "Python", "Data Structures"],
    },
    {
      id: "2",
      name: "Business Administration",
      description: "Bachelor's degree program in Business Administration",
      students_count: 150,
      internship_rate: 68,
      top_skills: ["Marketing", "Finance", "Management"],
    },
    {
      id: "3",
      name: "Graphic Design",
      description: "Bachelor's degree program in Graphic Design",
      students_count: 80,
      internship_rate: 62,
      top_skills: ["Adobe Creative Suite", "UI/UX", "Typography"],
    },
    {
      id: "4",
      name: "Mechanical Engineering",
      description: "Bachelor's degree program in Mechanical Engineering",
      students_count: 95,
      internship_rate: 70,
      top_skills: ["CAD", "Thermodynamics", "Materials Science"],
    },
  ]

  return programs
}

async function SchoolProgramsContent() {
  const session = await getSession()
  const schoolId = session?.user?.schoolId

  if (!schoolId) {
    return <div>School profile not found</div>
  }

  const programs = await getSchoolPrograms(schoolId)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {programs.map((program) => (
        <Card key={program.id}>
          <CardHeader className="pb-2">
            <CardTitle>{program.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{program.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Students:</span>
                <span>{program.students_count}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Internship Rate:</span>
                <span>{program.internship_rate}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Top Skills:</span>
                <span className="text-right">{program.top_skills.join(", ")}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Link href={`/school/programs/${program.id}`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="flex h-full flex-col items-center justify-center p-6 border-dashed">
        <div className="flex flex-col items-center justify-center text-center">
          <PlusCircle className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Add New Program</h3>
          <p className="mt-2 text-sm text-muted-foreground">Create a new academic program to track student outcomes</p>
          <Button className="mt-4">Add Program</Button>
        </div>
      </Card>
    </div>
  )
}

export default function SchoolPrograms() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Academic Programs</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Program
        </Button>
      </div>
      <Suspense fallback={<ProgramsSkeleton />}>
        <SchoolProgramsContent />
      </Suspense>
    </div>
  )
}

function ProgramsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex justify-end">
                <Skeleton className="h-9 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}

