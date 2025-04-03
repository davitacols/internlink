import { query } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart } from "@/components/charts"

interface AnalyticsData {
  applicationsByMonth: {
    month: string
    count: number
  }[]
  applicationsByStatus: {
    status: string
    count: number
  }[]
  applicationsByInternship: {
    internshipTitle: string
    count: number
  }[]
  applicationsBySchool: {
    school: string
    count: number
  }[]
  applicationsByMajor: {
    major: string
    count: number
  }[]
}

// This is a placeholder function - in a real app, you would get the current user from the session
async function getCurrentCompanyId() {
  // For demo purposes, we'll return a hardcoded company ID
  // In a real app, you would get this from the authenticated user session
  return "f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1"
}

async function getAnalyticsData(companyId: string): Promise<AnalyticsData> {
  // Get applications by month
  const applicationsByMonth = await query(
    `
    SELECT 
      TO_CHAR(a."createdAt", 'YYYY-MM') as month,
      COUNT(*) as count
    FROM "Application" a
    JOIN "Internship" i ON a."internshipId" = i.id
    WHERE i."companyId" = $1
    GROUP BY month
    ORDER BY month
  `,
    [companyId],
  )

  // Get applications by status
  const applicationsByStatus = await query(
    `
    SELECT 
      a.status,
      COUNT(*) as count
    FROM "Application" a
    JOIN "Internship" i ON a."internshipId" = i.id
    WHERE i."companyId" = $1
    GROUP BY a.status
    ORDER BY count DESC
  `,
    [companyId],
  )

  // Get applications by internship
  const applicationsByInternship = await query(
    `
    SELECT 
      i.title as "internshipTitle",
      COUNT(*) as count
    FROM "Application" a
    JOIN "Internship" i ON a."internshipId" = i.id
    WHERE i."companyId" = $1
    GROUP BY i.title
    ORDER BY count DESC
    LIMIT 10
  `,
    [companyId],
  )

  // Get applications by school
  const applicationsBySchool = await query(
    `
    SELECT 
      s.school,
      COUNT(*) as count
    FROM "Application" a
    JOIN "Internship" i ON a."internshipId" = i.id
    JOIN "Student" s ON a."studentId" = s.id
    WHERE i."companyId" = $1
    GROUP BY s.school
    ORDER BY count DESC
    LIMIT 10
  `,
    [companyId],
  )

  // Get applications by major
  const applicationsByMajor = await query(
    `
    SELECT 
      s.major,
      COUNT(*) as count
    FROM "Application" a
    JOIN "Internship" i ON a."internshipId" = i.id
    JOIN "Student" s ON a."studentId" = s.id
    WHERE i."companyId" = $1
    GROUP BY s.major
    ORDER BY count DESC
    LIMIT 10
  `,
    [companyId],
  )

  return {
    applicationsByMonth,
    applicationsByStatus,
    applicationsByInternship,
    applicationsBySchool,
    applicationsByMajor,
  }
}

export default async function CompanyAnalyticsPage() {
  const companyId = await getCurrentCompanyId()
  const analytics = await getAnalyticsData(companyId)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      <Tabs defaultValue="applications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Applications Over Time</CardTitle>
                <CardDescription>Monthly application trends</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart
                  data={analytics.applicationsByMonth.map((item) => ({
                    name: item.month,
                    value: Number.parseInt(item.count as unknown as string),
                  }))}
                  xAxisKey="name"
                  yAxisKey="value"
                  height={300}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>Distribution of application statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={analytics.applicationsByStatus.map((item) => ({
                    name: item.status,
                    value: Number.parseInt(item.count as unknown as string),
                  }))}
                  xAxisKey="name"
                  yAxisKey="value"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Applications by Internship</CardTitle>
              <CardDescription>Number of applications per internship position</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart
                data={analytics.applicationsByInternship.map((item) => ({
                  name: item.internshipTitle,
                  value: Number.parseInt(item.count as unknown as string),
                }))}
                xAxisKey="name"
                yAxisKey="value"
                height={300}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Applications by School</CardTitle>
                <CardDescription>Top schools by application count</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={analytics.applicationsBySchool.map((item) => ({
                    name: item.school,
                    value: Number.parseInt(item.count as unknown as string),
                  }))}
                  xAxisKey="name"
                  yAxisKey="value"
                  height={300}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Applications by Major</CardTitle>
                <CardDescription>Top majors by application count</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={analytics.applicationsByMajor.map((item) => ({
                    name: item.major,
                    value: Number.parseInt(item.count as unknown as string),
                  }))}
                  xAxisKey="name"
                  yAxisKey="value"
                  height={300}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

