import { Suspense } from "react"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { InternshipMatches } from "@/components/student/internship-matches"

export default async function StudentMatchesPage() {
  const session = await getSession()

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login")
  }

  const studentId = session.user.studentId

  if (!studentId) {
    redirect("/profile")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Your Matches</h1>
      </div>

      <Tabs defaultValue="recommended" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="skills">By Skills</TabsTrigger>
          <TabsTrigger value="location">By Location</TabsTrigger>
        </TabsList>

        <TabsContent value="recommended">
          <Suspense fallback={<MatchesSkeleton />}>
            <InternshipMatches studentId={studentId} limit={20} />
          </Suspense>
        </TabsContent>

        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Skill-Based Matches</CardTitle>
              <CardDescription>Internships that match your specific skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-muted-foreground">
                Coming soon! We're working on enhanced skill-based matching.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location">
          <Card>
            <CardHeader>
              <CardTitle>Location-Based Matches</CardTitle>
              <CardDescription>Internships near your preferred location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-muted-foreground">
                Coming soon! We're working on enhanced location-based matching.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MatchesSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
        </div>
      </CardContent>
    </Card>
  )
}

