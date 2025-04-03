import { Suspense } from "react"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { neon } from "@/lib/db"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { StudentMatches } from "@/components/company/student-matches"
import { ArrowLeft } from "lucide-react"

async function getInternshipDetails(internshipId: string, companyId: string) {
  const sql = neon(process.env.DATABASE_URL!)

  const internship = await sql`
    SELECT i.id, i.title
    FROM internships i
    WHERE i.id = ${internshipId} AND i.company_id = ${companyId}
  `

  return internship[0] || null
}

export default async function InternshipMatchesPage({ params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session || session.user.role !== "COMPANY") {
    redirect("/login")
  }

  const companyId = session.user.companyId

  if (!companyId) {
    redirect("/company/profile")
  }

  const internship = await getInternshipDetails(params.id, companyId)

  if (!internship) {
    redirect("/company/internships")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/company/internships/${params.id}`}>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Matching Students for {internship.title}</h1>
      </div>

      <Suspense fallback={<MatchesSkeleton />}>
        <StudentMatches internshipId={params.id} limit={50} />
      </Suspense>
    </div>
  )
}

function MatchesSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-36 mb-2" />
        <Skeleton className="h-4 w-64" />
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

