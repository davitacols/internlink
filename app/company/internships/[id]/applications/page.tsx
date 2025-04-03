import { notFound } from "next/navigation"
import { query, queryOne } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Download, Eye, FileText, User } from "lucide-react"
import Link from "next/link"

interface Internship {
  id: string
  title: string
  companyId: string
}

interface Application {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  studentSchool: string
  studentMajor: string
  coverLetter: string
  resumeUrl: string
  status: string
  createdAt: string
}

// This is a placeholder function - in a real app, you would get the current user from the session
async function getCurrentCompanyId() {
  // For demo purposes, we'll return a hardcoded company ID
  // In a real app, you would get this from the authenticated user session
  return "f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1"
}

async function getInternship(id: string): Promise<Internship | null> {
  return await queryOne<Internship>(
    `
    SELECT i.id, i.title, i."companyId"
    FROM "Internship" i
    WHERE i.id = $1
  `,
    [id],
  )
}

async function getApplications(internshipId: string): Promise<Application[]> {
  return await query<Application>(
    `
    SELECT 
      a.id, 
      a."studentId", 
      u.name as "studentName", 
      u.email as "studentEmail",
      s.school as "studentSchool",
      s.major as "studentMajor",
      a."coverLetter", 
      a."resumeUrl", 
      a.status, 
      a."createdAt"
    FROM "Application" a
    JOIN "Student" s ON a."studentId" = s.id
    JOIN "User" u ON s."userId" = u.id
    WHERE a."internshipId" = $1
    ORDER BY 
      CASE 
        WHEN a.status = 'APPLIED' THEN 1
        WHEN a.status = 'REVIEWING' THEN 2
        WHEN a.status = 'ACCEPTED' THEN 3
        WHEN a.status = 'REJECTED' THEN 4
        ELSE 5
      END,
      a."createdAt" DESC
  `,
    [internshipId],
  )
}

export default async function InternshipApplicationsPage({ params }: { params: { id: string } }) {
  const companyId = await getCurrentCompanyId()
  const internship = await getInternship(params.id)

  if (!internship) {
    notFound()
  }

  // Check if the internship belongs to the current company
  if (internship.companyId !== companyId) {
    notFound()
  }

  const applications = await getApplications(internship.id)

  // Group applications by status
  const applied = applications.filter((app) => app.status === "APPLIED")
  const reviewing = applications.filter((app) => app.status === "REVIEWING")
  const accepted = applications.filter((app) => app.status === "ACCEPTED")
  const rejected = applications.filter((app) => app.status === "REJECTED")

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Applications for {internship.title}</h1>
        <Button asChild variant="outline">
          <Link href={`/company/internships`}>Back to Internships</Link>
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
          <TabsTrigger value="applied">Applied ({applied.length})</TabsTrigger>
          <TabsTrigger value="reviewing">Reviewing ({reviewing.length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({accepted.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {applications.map((application) => (
            <ApplicationCard key={application.id} application={application} internshipId={internship.id} />
          ))}

          {applications.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Applications Yet</h3>
                <p className="text-muted-foreground">There are no applications for this internship yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="applied" className="space-y-4 mt-4">
          {applied.map((application) => (
            <ApplicationCard key={application.id} application={application} internshipId={internship.id} />
          ))}

          {applied.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No New Applications</h3>
                <p className="text-muted-foreground">There are no new applications to review.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reviewing" className="space-y-4 mt-4">
          {reviewing.map((application) => (
            <ApplicationCard key={application.id} application={application} internshipId={internship.id} />
          ))}

          {reviewing.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Applications Under Review</h3>
                <p className="text-muted-foreground">There are no applications currently under review.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4 mt-4">
          {accepted.map((application) => (
            <ApplicationCard key={application.id} application={application} internshipId={internship.id} />
          ))}

          {accepted.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Accepted Applications</h3>
                <p className="text-muted-foreground">You haven't accepted any applications yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 mt-4">
          {rejected.map((application) => (
            <ApplicationCard key={application.id} application={application} internshipId={internship.id} />
          ))}

          {rejected.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Rejected Applications</h3>
                <p className="text-muted-foreground">You haven't rejected any applications yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ApplicationCard({
  application,
  internshipId,
}: {
  application: Application
  internshipId: string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${application.studentName}`}
                alt={application.studentName}
              />
              <AvatarFallback>{application.studentName.charAt(0)}</AvatarFallback>
            </Avatar>

            <div>
              <h3 className="text-lg font-semibold">{application.studentName}</h3>
              <p className="text-sm text-muted-foreground">{application.studentEmail}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {application.studentSchool}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {application.studentMajor}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex-grow space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Applied on {new Date(application.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex items-start">
              <FileText className="h-4 w-4 mr-1 mt-1" />
              <div className="flex-grow">
                <p className="text-sm font-medium">Cover Letter</p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {application.coverLetter || "No cover letter provided"}
                </p>
              </div>
            </div>

            {application.resumeUrl && (
              <div className="flex items-center">
                <Download className="h-4 w-4 mr-1" />
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  View Resume
                </a>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 min-w-[180px]">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Status:</span>
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

            <UpdateApplicationStatus applicationId={application.id} currentStatus={application.status} />

            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={`/students/${application.studentId}`}>
                  <User className="h-4 w-4 mr-1" />
                  Profile
                </Link>
              </Button>

              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={`/company/applications/${application.id}`}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function UpdateApplicationStatus({
  applicationId,
  currentStatus,
}: {
  applicationId: string
  currentStatus: string
}) {
  return (
    <div className="w-full">
      <form action={`/api/applications/${applicationId}/status`}>
        <input type="hidden" name="applicationId" value={applicationId} />
        <Select name="status" defaultValue={currentStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Update status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="APPLIED">Applied</SelectItem>
            <SelectItem value="REVIEWING">Reviewing</SelectItem>
            <SelectItem value="ACCEPTED">Accept</SelectItem>
            <SelectItem value="REJECTED">Reject</SelectItem>
          </SelectContent>
        </Select>
      </form>
    </div>
  )
}

