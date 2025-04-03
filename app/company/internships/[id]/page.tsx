import { Suspense } from "react"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { neon } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { StudentMatches } from "@/components/company/student-matches"
import { ArrowLeft, Edit, Users, Calendar, MapPin, DollarSign } from "lucide-react"

async function getInternshipDetails(internshipId: string, companyId: string) {
  const sql = neon(process.env.DATABASE_URL!)

  // Get internship details
  const internship = await sql`
    SELECT i.*
    FROM internships i
    WHERE i.id = ${internshipId} AND i.company_id = ${companyId}
  `

  if (internship.length === 0) {
    return null
  }

  // Get internship skills
  const skills = await sql`
    SELECT is.skill_id, is.proficiency, s.name
    FROM internship_skills is
    JOIN skills s ON is.skill_id = s.id
    WHERE is.internship_id = ${internshipId}
    ORDER BY is.proficiency DESC
  `

  // Get application stats
  const applicationStats = await sql`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'ACCEPTED' THEN 1 ELSE 0 END) as accepted,
      SUM(CASE WHEN status = 'REJECTED' THEN 1 ELSE 0 END) as rejected
    FROM applications
    WHERE internship_id = ${internshipId}
  `

  return {
    internship: internship[0],
    skills,
    applicationStats: applicationStats[0],
  }
}

async function InternshipDetailsContent({ params }: { params: { id: string } }) {
  const session = await getSession()
  const companyId = session?.user?.companyId

  if (!companyId) {
    return <div>Company profile not found</div>
  }

  const internshipDetails = await getInternshipDetails(params.id, companyId)

  if (!internshipDetails) {
    redirect("/company/internships")
  }

  const { internship, skills, applicationStats } = internshipDetails

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{internship.title}</CardTitle>
            <Link href={`/company/internships/${params.id}/edit`}>
              <Button variant="outline" size="sm" className="gap-1">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </Link>
          </div>
          <CardDescription>
            <div className="flex flex-wrap gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Posted: {new Date(internship.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {internship.location}
                  {internship.is_remote ? " (Remote Available)" : ""}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>
                  {internship.compensation > 0 ? `$${internship.compensation.toLocaleString()}/year` : "Unpaid"}
                </span>
              </div>
              <div>
                <Badge variant={internship.status === "ACTIVE" ? "default" : "secondary"}>
                  {internship.status.charAt(0) + internship.status.slice(1).toLowerCase()}
                </Badge>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-sm whitespace-pre-line">{internship.description}</p>

              <h3 className="text-lg font-medium mt-6 mb-2">Required Skills</h3>
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill: any) => (
                    <Badge key={skill.skill_id} variant="outline" className="px-2.5 py-1">
                      {skill.name}
                      <span className="ml-1 text-xs text-muted-foreground">(Level {skill.proficiency})</span>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No specific skills required</p>
              )}

              <h3 className="text-lg font-medium mt-6 mb-2">Requirements</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Education:</span>
                  <span>{internship.required_education || "Not specified"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Experience:</span>
                  <span>
                    {internship.required_experience
                      ? `${internship.required_experience} years`
                      : "No experience required"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Duration:</span>
                  <span>{internship.duration || "Not specified"}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Application Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                  <p className="text-2xl font-bold">{applicationStats.total || 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{applicationStats.pending || 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                  <p className="text-2xl font-bold">{applicationStats.accepted || 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold">{applicationStats.rejected || 0}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <Link href={`/company/internships/${params.id}/applications`}>
                  <Button className="w-full gap-2">
                    <Users className="h-4 w-4" />
                    View Applications
                  </Button>
                </Link>
                <Link href={`/company/internships/${params.id}/matches`}>
                  <Button variant="outline" className="w-full">
                    View All Matching Students
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <StudentMatches internshipId={params.id} limit={3} />
    </div>
  )
}

export default function InternshipDetails({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/company/internships">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Internship Details</h1>
      </div>
      <Suspense fallback={<InternshipDetailsSkeleton />}>
        <InternshipDetailsContent params={params} />
      </Suspense>
    </div>
  )
}

function InternshipDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-9 w-20" />
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-5 w-32" />
              ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              <div>
                <Skeleton className="h-6 w-40 mb-2" />
                <div className="flex flex-wrap gap-2">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-8 w-24" />
                    ))}
                </div>
              </div>
              <div>
                <Skeleton className="h-6 w-36 mb-2" />
                <div className="space-y-2">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <div className="grid grid-cols-2 gap-4">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="space-y-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-8 w-12" />
                      </div>
                    ))}
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-36 mb-2" />
          <Skeleton className="h-4 w-64" />
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

