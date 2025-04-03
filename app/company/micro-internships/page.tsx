import { getMicroInternshipsByCompany } from "@/lib/db/micro-internships"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Calendar, Clock, Edit, Eye, MapPin, MoreHorizontal, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// This is a placeholder function - in a real app, you would get the current user from the session
async function getCurrentCompanyId() {
  // For demo purposes, we'll return a hardcoded company ID
  // In a real app, you would get this from the authenticated user session
  return "f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1"
}

export default async function CompanyMicroInternshipsPage() {
  const companyId = await getCurrentCompanyId()
  const microInternships = await getMicroInternshipsByCompany(companyId)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Micro-Internships</h1>
          <p className="text-muted-foreground">Manage your short-term, flexible opportunities</p>
        </div>
        <Button asChild>
          <Link href="/company/micro-internships/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Micro-Internship
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {microInternships.map((microInternship) => (
          <Card key={microInternship.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-semibold">{microInternship.title}</h2>
                    <Badge
                      variant={
                        microInternship.status === "ACTIVE"
                          ? "default"
                          : microInternship.status === "DRAFT"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {microInternship.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      <span>{microInternship.projectType || "Project"}</span>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>
                        {microInternship.location}
                        {microInternship.isRemote && " (Remote)"}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {microInternship.weeklyCommitment
                          ? `${microInternship.weeklyCommitment} hours/week`
                          : "Flexible hours"}
                        {microInternship.durationWeeks ? ` · ${microInternship.durationWeeks} weeks` : ""}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Deadline: {new Date(microInternship.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/micro-internships/${microInternship.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/company/micro-internships/${microInternship.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      {microInternship.status === "DRAFT" && (
                        <DropdownMenuItem asChild>
                          <Link href={`/company/micro-internships/${microInternship.id}/publish`}>
                            <Briefcase className="mr-2 h-4 w-4" />
                            Publish
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild className="text-red-600">
                        <Link href={`/company/micro-internships/${microInternship.id}/delete`}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {microInternships.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Micro-Internships Yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't posted any micro-internships yet. Create your first micro-internship to start receiving
                applications.
              </p>
              <Button asChild>
                <Link href="/company/micro-internships/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Micro-Internship
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

