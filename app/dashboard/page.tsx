import type { Metadata } from "next"
import { query } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Calendar, DollarSign } from "lucide-react"

export const metadata: Metadata = {
  title: "Dashboard | InternLink",
  description: "InternLink Dashboard",
}

interface Internship {
  id: string
  title: string
  description: string
  location: string
  isRemote: boolean
  isHybrid: boolean
  startDate: string
  endDate: string
  deadline: string
  isPaid: boolean
  compensation: string
  status: string
  companyName: string
}

async function getInternships(): Promise<Internship[]> {
  const internships = await query<Internship>(`
    SELECT i.*, u.name as "companyName"
    FROM "Internship" i
    JOIN "Company" c ON i."companyId" = c.id
    JOIN "User" u ON c."userId" = u.id
    WHERE i.status = 'ACTIVE'
    ORDER BY i.deadline ASC
    LIMIT 5
  `)

  return internships
}

interface ApplicationCount {
  count: string
}

async function getApplicationCount(): Promise<number> {
  const result = await queryOne<ApplicationCount>(`
    SELECT COUNT(*) as count FROM "Application"
  `)

  return result ? Number.parseInt(result.count) : 0
}

interface StudentCount {
  count: string
}

async function getStudentCount(): Promise<number> {
  const result = await queryOne<StudentCount>(`
    SELECT COUNT(*) as count FROM "Student"
  `)

  return result ? Number.parseInt(result.count) : 0
}

interface CompanyCount {
  count: string
}

async function getCompanyCount(): Promise<number> {
  const result = await queryOne<CompanyCount>(`
    SELECT COUNT(*) as count FROM "Company"
  `)

  return result ? Number.parseInt(result.count) : 0
}

async function queryOne<T>(sql: string): Promise<T | null> {
  const result = await query<T>(sql)
  return result.length > 0 ? result[0] : null
}

export default async function DashboardPage() {
  const internships = await getInternships()
  const applicationCount = await getApplicationCount()
  const studentCount = await getStudentCount()
  const companyCount = await getCompanyCount()

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-8">InternLink Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Students</CardTitle>
            <CardDescription>Total registered students</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{studentCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Companies</CardTitle>
            <CardDescription>Total registered companies</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{companyCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Applications</CardTitle>
            <CardDescription>Total internship applications</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{applicationCount}</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mb-4">Latest Internship Opportunities</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {internships.map((internship) => (
          <Card key={internship.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{internship.title}</CardTitle>
                {internship.isPaid && (
                  <Badge variant="secondary" className="ml-2">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Paid
                  </Badge>
                )}
              </div>
              <CardDescription className="text-base">{internship.companyName}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {internship.location}
                  {internship.isRemote && " (Remote)"}
                  {internship.isHybrid && " (Hybrid)"}
                </span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  {new Date(internship.startDate).toLocaleDateString()} -{" "}
                  {new Date(internship.endDate).toLocaleDateString()}
                </span>
              </div>
              <p className="line-clamp-3 mb-4">{internship.description}</p>
              <div className="mt-auto">
                <Button asChild className="w-full">
                  <Link href={`/internships/${internship.id}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button asChild variant="outline">
          <Link href="/internships">View All Internships</Link>
        </Button>
      </div>
    </div>
  )
}

