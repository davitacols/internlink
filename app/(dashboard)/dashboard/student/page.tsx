import { Suspense } from "react"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { neon } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { InternshipMatches } from "@/components/student/internship-matches"

async function getStudentDashboardData(studentId: string) {
  const sql = neon(process.env.DATABASE_URL!)

  // Get application stats
  const applicationStats = await sql`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'ACCEPTED' THEN 1 ELSE 0 END) as accepted,
      SUM(CASE WHEN status = 'REJECTED' THEN 1 ELSE 0 END) as rejected
    FROM applications
    WHERE student_id = ${studentId}
  `

  // Get recent applications
  const recentApplications = await sql`
    SELECT a.id, a.created_at, a.status, i.title as internship_title, c.name as company_name
    FROM applications a
    JOIN internships i ON a.internship_id = i.id
    JOIN companies c ON i.company_id = c.id
    WHERE a.student_id = ${studentId}
    ORDER BY a.created_at DESC
    LIMIT 5
  `

  return {
    applicationStats: applicationStats[0],
    recentApplications,
  }
}

async function StudentDashboardContent() {
  const session = await getSession()
  const studentId = session?.user?.studentId

  if (!studentId) {
    return <div>Student profile not found</div>
  }

  const dashboardData = await getStudentDashboardData(studentId)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Application Status</CardTitle>
            <CardDescription>Overview of your internship applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold">{dashboardData.applicationStats.total || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{dashboardData.applicationStats.pending || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                <p className="text-2xl font-bold">{dashboardData.applicationStats.accepted || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{dashboardData.applicationStats.rejected || 0}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Link href="/student/applications">
                <Button variant="outline" size="sm">
                  View All Applications
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Your most recent internship applications</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData.recentApplications.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentApplications.map((app: any) => (
                  <div key={app.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{app.internship_title}</p>
                      <p className="text-sm text-muted-foreground">{app.company_name}</p>
                    </div>
                    <div className="flex items-center gap-2">
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
                      <span className="text-xs text-muted-foreground">
                        {new Date(app.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">You haven't applied to any internships yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div>
        <InternshipMatches studentId={studentId} limit={3} />
      </div>
    </div>
  )
}

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/internships">
          <Button>Browse Internships</Button>
        </Link>
      </div>
      <Suspense fallback={<DashboardSkeleton />}>
        <StudentDashboardContent />
      </Suspense>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Skeleton className="h-9 w-36" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            <div className="flex justify-center">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

