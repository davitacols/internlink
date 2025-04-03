import { notFound } from "next/navigation"
import { getMicroInternshipById } from "@/lib/db/micro-internships"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, DollarSign, Building, Clock, Briefcase } from "lucide-react"
import InternshipSkills from "@/components/internship-skills"
import Link from "next/link"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const microInternship = await getMicroInternshipById(params.id)

  if (!microInternship) {
    return {
      title: "Micro-Internship Not Found",
    }
  }

  return {
    title: `${microInternship.title} | Micro-Internships | InternLink`,
    description: microInternship.description.substring(0, 160),
  }
}

async function getInternshipSkills(internshipId: string) {
  // Reuse the existing function to get skills
  // This is a placeholder - you would implement this based on your database structure
  return []
}

export default async function MicroInternshipPage({ params }: { params: { id: string } }) {
  const microInternship = await getMicroInternshipById(params.id)

  if (!microInternship) {
    notFound()
  }

  const skills = await getInternshipSkills(microInternship.id)

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{microInternship.title}</h1>
          <p className="text-xl text-muted-foreground">{microInternship.companyName}</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          {microInternship.isPaid && (
            <Badge variant="secondary" className="text-sm">
              <DollarSign className="h-3 w-3 mr-1" />
              Paid
            </Badge>
          )}
          {microInternship.isRemote && (
            <Badge variant="outline" className="text-sm">
              Remote
            </Badge>
          )}
          {microInternship.isFlexibleSchedule && (
            <Badge variant="outline" className="text-sm">
              Flexible Schedule
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>About This Micro-Internship</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{microInternship.description}</p>

              {microInternship.deliverables && (
                <>
                  <Separator className="my-6" />
                  <h3 className="text-lg font-semibold mb-4">Expected Deliverables</h3>
                  <p className="whitespace-pre-line">{microInternship.deliverables}</p>
                </>
              )}

              <Separator className="my-6" />

              <h3 className="text-lg font-semibold mb-4">Required Skills</h3>
              {skills.length > 0 ? (
                <InternshipSkills skills={skills} />
              ) : (
                <p className="text-muted-foreground">No specific skills listed for this opportunity.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {microInternship.projectType && (
                <div className="flex items-start">
                  <Briefcase className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Project Type</p>
                    <p className="text-muted-foreground">{microInternship.projectType}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">{microInternship.location}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Time Commitment</p>
                  <p className="text-muted-foreground">
                    {microInternship.weeklyCommitment
                      ? `${microInternship.weeklyCommitment} hours per week`
                      : "Flexible hours"}
                    {microInternship.durationWeeks ? ` for ${microInternship.durationWeeks} weeks` : ""}
                    {microInternship.isFlexibleSchedule ? " (flexible schedule)" : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Application Deadline</p>
                  <p className="text-muted-foreground">{new Date(microInternship.deadline).toLocaleDateString()}</p>
                </div>
              </div>

              {microInternship.isPaid && (
                <div className="flex items-start">
                  <DollarSign className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Compensation</p>
                    <p className="text-muted-foreground">{microInternship.compensation}</p>
                  </div>
                </div>
              )}

              <Separator className="my-4" />

              <Button className="w-full" asChild>
                <Link href={`/micro-internships/${microInternship.id}/apply`}>Apply Now</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>About the Company</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <Building className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{microInternship.companyName}</p>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <Link href={`/companies/${microInternship.companyId}`}>View Company Profile</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

