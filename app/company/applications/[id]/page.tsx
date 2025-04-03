import { notFound } from "next/navigation"
import { queryOne } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Briefcase, Download, GraduationCap, Mail, MapPin, User } from "lucide-react"
import Link from "next/link"
import { UpdateApplicationStatus } from "@/components/update-application-status"

interface Application {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  studentSchool: string
  studentMajor: string
  studentGraduationYear: number
  studentBio: string
  internshipId: string
  internshipTitle: string
  internshipLocation: string
  internshipIsRemote: boolean
  internshipIsHybrid: boolean
  coverLetter: string
  resumeUrl: string
  status: string
  createdAt: string
  companyId: string
}

// This is a placeholder function - in a real app, you would get the current user from the session
async function getCurrentCompanyId() {
  // For demo purposes, we'll return a hardcoded company ID
  // In a real app, you would get this from the authenticated user session
  return "f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1"
}

async function getApplication(id: string): Promise<Application | null> {
  return await queryOne<Application>(
    `
    SELECT 
      a.id, 
      a."studentId", 
      u.name as "studentName", 
      u.email as "studentEmail",
      s.school as "studentSchool",
      s.major as "studentMajor",
      s."graduationYear" as "studentGraduationYear",
      s.bio as "studentBio",
      a."internshipId",
      i.title as "internshipTitle",
      i.location as "internshipLocation",
      i."isRemote" as "internshipIsRemote",
      i."isHybrid" as "internshipIsHybrid",
      a."coverLetter", 
      a."resumeUrl", 
      a.status, 
      a."createdAt",
      i."companyId"
    FROM "Application" a
    JOIN "Student" s ON a."studentId" = s.id
    JOIN "User" u ON s."userId" = u.id
    JOIN "Internship" i ON a."internshipId" = i.id
    WHERE a.id = $1
  `,
    [id],
  )
}

export default async function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const companyId = await getCurrentCompanyId()
  const application = await getApplication(params.id)

  if (!application) {
    notFound()
  }

  // Check if the application is for an internship that belongs to the current company
  if (application.companyId !== companyId) {
    notFound()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Application Details</h1>
        <Button asChild variant="outline">
          <Link href="/company/applications">Back to Applications</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Applicant</CardTitle>
              <CardDescription>Student information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-2">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${application.studentName}`}
                    alt={application.studentName}
                  />
                  <AvatarFallback>{application.studentName.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{application.studentName}</h2>
                <p className="text-sm text-muted-foreground">{application.studentEmail}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-start">
                  <GraduationCap className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Education</p>
                    <p className="text-muted-foreground">{application.studentSchool}</p>
                    <p className="text-muted-foreground">
                      {application.studentMajor}, {application.studentGraduationYear}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">About</h3>
                <p className="text-sm text-muted-foreground">{application.studentBio || "No bio provided."}</p>
              </div>

              <div className="pt-2">
                <Button asChild className="w-full">
                  <Link href={`/students/${application.studentId}`}>
                    <User className="mr-2 h-4 w-4" />
                    View Full Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Application Status</CardTitle>
                  <CardDescription>Applied on {new Date(application.createdAt).toLocaleDateString()}</CardDescription>
                </div>
                <Badge
                  variant={
                    application.status === "APPLIED"
                      ? "default"
                      : application.status === "REVIEWING"
                        ? "secondary"
                        : application.status === "ACCEPTED"
                          ? "success"
                          : "destructive"
                  }
                >
                  {application.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="font-medium mb-2">Update Status</h3>
                <UpdateApplicationStatus applicationId={application.id} currentStatus={application.status} />
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Applied For</h3>
                  <div className="flex items-center text-sm mb-2">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <Link href={`/internships/${application.internshipId}`} className="text-primary hover:underline">
                      {application.internshipTitle}
                    </Link>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>
                      {application.internshipLocation}
                      {application.internshipIsRemote && " (Remote)"}
                      {application.internshipIsHybrid && " (Hybrid)"}
                    </span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Cover Letter</h3>
                  <div className="bg-muted p-4 rounded-md whitespace-pre-line">
                    {application.coverLetter || "No cover letter provided."}
                  </div>
                </div>

                {application.resumeUrl && (
                  <>
                    <Separator />

                    <div>
                      <h3 className="font-medium mb-2">Resume</h3>
                      <Button asChild variant="outline">
                        <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          View Resume
                        </a>
                      </Button>
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex justify-between">
                  <Button asChild variant="outline">
                    <Link href={`/company/internships/${application.internshipId}/applications`}>
                      View All Applications for This Internship
                    </Link>
                  </Button>

                  <Button asChild>
                    <a href={`mailto:${application.studentEmail}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Applicant
                    </a>
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

