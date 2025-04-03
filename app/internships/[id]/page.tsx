import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { query, queryOne } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, DollarSign, Building, Globe, Clock } from "lucide-react"
import InternshipSkills from "@/components/internship-skills"

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
  companyId: string
  companyName: string
  industry: string
  website: string
}

interface Skill {
  id: string
  name: string
  category: string
  importance: number
}

async function getInternship(id: string): Promise<Internship | null> {
  return await queryOne<Internship>(
    `
    SELECT i.*, u.name as "companyName", c.industry, c.website
    FROM "Internship" i
    JOIN "Company" c ON i."companyId" = c.id
    JOIN "User" u ON c."userId" = u.id
    WHERE i.id = $1
  `,
    [id],
  )
}

async function getInternshipSkills(internshipId: string): Promise<Skill[]> {
  return await query<Skill>(
    `
    SELECT s.id, s.name, s.category, isk.importance
    FROM "InternshipSkill" isk
    JOIN "Skill" s ON isk."skillId" = s.id
    WHERE isk."internshipId" = $1
    ORDER BY isk.importance DESC
  `,
    [internshipId],
  )
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const internship = await getInternship(params.id)

  if (!internship) {
    return {
      title: "Internship Not Found",
    }
  }

  return {
    title: `${internship.title} at ${internship.companyName} | InternLink`,
    description: internship.description.substring(0, 160),
  }
}

export default async function InternshipPage({ params }: { params: { id: string } }) {
  const internship = await getInternship(params.id)

  if (!internship) {
    notFound()
  }

  const skills = await getInternshipSkills(internship.id)

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{internship.title}</h1>
          <p className="text-xl text-muted-foreground">{internship.companyName}</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          {internship.isPaid && (
            <Badge variant="secondary" className="text-sm">
              <DollarSign className="h-3 w-3 mr-1" />
              Paid
            </Badge>
          )}
          {internship.isRemote && (
            <Badge variant="outline" className="text-sm">
              Remote
            </Badge>
          )}
          {internship.isHybrid && (
            <Badge variant="outline" className="text-sm">
              Hybrid
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>About This Internship</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{internship.description}</p>

              <Separator className="my-6" />

              <h3 className="text-lg font-semibold mb-4">Required Skills</h3>
              <InternshipSkills skills={skills} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Internship Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">{internship.location}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-muted-foreground">
                    {new Date(internship.startDate).toLocaleDateString()} -{" "}
                    {new Date(internship.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Application Deadline</p>
                  <p className="text-muted-foreground">{new Date(internship.deadline).toLocaleDateString()}</p>
                </div>
              </div>

              {internship.isPaid && (
                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Compensation</p>
                    <p className="text-muted-foreground">{internship.compensation}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <Building className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Industry</p>
                  <p className="text-muted-foreground">{internship.industry}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Globe className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Company Website</p>
                  <a
                    href={internship.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {internship.website}
                  </a>
                </div>
              </div>

              <Separator className="my-4" />

              <Button className="w-full">Apply Now</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

