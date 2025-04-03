import { query, queryOne } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, ClipboardList, Users, Clock } from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  activeInternships: number
  totalApplications: number
  pendingApplications: number
  totalStudents: number
}

interface RecentApplication {
  id: string
  studentName: string
  internshipTitle: string
  status: string
  createdAt: string
}

// This is a placeholder function - in a real app, you would get the current user from the session
async function getCurrentCompanyId() {
  // For demo purposes, we'll return a hardcoded company ID
  // In a real app, you would get this from the authenticated user session
  return "f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1"
}

async function getDashboardStats(companyId: string): Promise<DashboardStats> {
  const activeInternships = await queryOne<{ count: string }>(
    `
    SELECT COUNT(*) as count 
    FROM "Internship" 
    WHERE "companyId" = $1 AND status = 'ACTIVE'
  `,
    [companyId],
  )

  const totalApplications = await queryOne<{ count: string }>(
    `
    SELECT COUNT(*) as count 
    FROM "Application" a
    JOIN "Internship" i ON a."internshipId" = i.id
    WHERE i."companyId" = $1
  `,
    [companyId],
  )

  const pendingApplications = await queryOne<{ count: string }>(
    `
    SELECT COUNT(*) as count 
    FROM "Application" a
    JOIN "Internship" i ON a."internshipId" = i.id
    WHERE i."companyId" = $1 AND a.status = 'APPLIED'
  `,
    [companyId],
  )

  const totalStudents = await queryOne<{ count: string }>(
    `
    SELECT COUNT(DISTINCT a."studentId") as count 
    FROM "Application" a
    JOIN "Internship" i ON a."internshipId" = i.id
    WHERE i."companyId" = $1
  `,
    [companyId],
  )

  return {
    activeInternships: Number.parseInt(activeInternships?.count || "0"),
    totalApplications: Number.parseInt(totalApplications?.count || "0"),
    pendingApplications: Number.parseInt(pendingApplications?.count || "0"),
    totalStudents: Number.parseInt(totalStudents?.count || "0"),
  }
}

async function getRecentApplications(companyId: string): Promise<RecentApplication[]> {
  return await query<RecentApplication>(
    `
    SELECT a.id, u.name as "studentName", i.title as "internshipTitle", a.status, a."createdAt"
    FROM "Application" a
    JOIN "Internship" i ON a."internshipId" = i.id
    JOIN "Student" s ON a."studentId" = s.id
    JOIN "User" u ON s."userId" = u.id
    WHERE i."companyId" = $1
    ORDER BY a."createdAt" DESC
    LIMIT 5
  `,
    [companyId],
  )
}

export default async function CompanyDashboardPage() {
  const companyId = await getCurrentCompanyId()
  const stats = await getDashboardStats(companyId)
  const recentApplications = await getRecentApplications(companyId)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Internships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.activeInternships}</div>
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.totalApplications}</div>
              <ClipboardList className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.pendingApplications}</div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Latest applications to your internship positions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentApplications.length > 0 ? (
              <div className="space-y-4">
                {recentApplications.map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <div className="font-medium">{application.studentName}</div>
                      <div className="text-sm text-muted-foreground">Applied for {application.internshipTitle}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div
                      className={`text-sm px-2 py-1 rounded-full ${
                        application.status === "APPLIED"
                          ? "bg-blue-100 text-blue-800"
                          : application.status === "REVIEWING"
                            ? "bg-yellow-100 text-yellow-800"
                            : application.status === "ACCEPTED"
                              ? "bg-green-100 text-green-800"
                              : application.status === "REJECTED"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {application.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">No applications yet</div>
            )}

            <div className="mt-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/company/applications">View All Applications</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your internships and applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/company/internships/new">
                <Briefcase className="mr-2 h-4 w-4" />
                Post New Internship
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/company/internships">
                <ClipboardList className="mr-2 h-4 w-4" />
                Manage Internships
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/company/students">
                <Users className="mr-2 h-4 w-4" />
                Browse Student Profiles
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

