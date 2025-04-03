import { Suspense } from "react"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { neon } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

async function getSchoolStudents(schoolId: string, search = "") {
  const sql = neon(process.env.DATABASE_URL!)

  let query = `
    SELECT s.id, s.name, s.email, s.major, s.graduation_year, 
           COUNT(DISTINCT a.id) as applications_count,
           SUM(CASE WHEN a.status = 'ACCEPTED' THEN 1 ELSE 0 END) as accepted_count
    FROM students s
    LEFT JOIN applications a ON s.id = a.student_id
    WHERE s.school_id = $1
  `

  const params = [schoolId]

  if (search) {
    query += ` AND (s.name ILIKE $2 OR s.email ILIKE $2 OR s.major ILIKE $2)`
    params.push(`%${search}%`)
  }

  query += `
    GROUP BY s.id, s.name, s.email, s.major, s.graduation_year
    ORDER BY s.name
  `

  const students = await sql.query(query, params)
  return students.rows
}

async function SchoolStudentsContent({ searchParams }: { searchParams: { search?: string } }) {
  const session = await getSession()
  const schoolId = session?.user?.schoolId

  if (!schoolId) {
    return <div>School profile not found</div>
  }

  const search = searchParams.search || ""
  const students = await getSchoolStudents(schoolId, search)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Students</CardTitle>
        <div className="flex items-center gap-2">
          <form className="flex items-center gap-2">
            <Input name="search" placeholder="Search students..." className="w-[250px]" defaultValue={search} />
            <Button type="submit" size="sm">
              Search
            </Button>
          </form>
        </div>
      </CardHeader>
      <CardContent>
        {students.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Major</TableHead>
                <TableHead>Graduation Year</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Placements</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student: any) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.major}</TableCell>
                  <TableCell>{student.graduation_year}</TableCell>
                  <TableCell>{student.applications_count}</TableCell>
                  <TableCell>{student.accepted_count}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/school/students/${student.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-muted-foreground">No students found</div>
        )}
      </CardContent>
    </Card>
  )
}

export default function SchoolStudents({ searchParams }: { searchParams: { search?: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Students</h1>
      </div>
      <Suspense fallback={<StudentsTableSkeleton />}>
        <SchoolStudentsContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

function StudentsTableSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-[320px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
        </div>
      </CardContent>
    </Card>
  )
}

