import { query } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Calendar, Clock, Edit, Eye, MapPin, MoreHorizontal, Plus, Trash2, Users } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Internship {
  id: string
  title: string
  location: string
  isRemote: boolean
  isHybrid: boolean
  startDate: string
  endDate: string
  deadline: string
  status: string
  applicationCount: number
}

// This is a placeholder function - in a real app, you would get the current user from the session
async function getCurrentCompanyId() {
  // For demo purposes, we'll return a hardcoded company ID
  // In a real app, you would get this from the authenticated user session
  return "f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1"
}

async function getInternships(companyId: string): Promise<Internship[]> {
  return await query<Internship>(
    `
    SELECT 
      i.id, 
      i.title, 
      i.location, 
      i."isRemote", 
      i."isHybrid", 
      i."startDate", 
      i."endDate", 
      i.deadline, 
      i.status,
      COUNT(a.id) as "applicationCount"
    FROM "Internship" i
    LEFT JOIN "Application" a ON i.id = a."internshipId"
    WHERE i."companyId" = $1
    GROUP BY i.id
    ORDER BY 
      CASE 
        WHEN i.status = 'ACTIVE' THEN 1
        WHEN i.status = 'DRAFT' THEN 2
        WHEN i.status = 'CLOSED' THEN 3
        ELSE 4
      END,
      i.deadline ASC
  `,
    [companyId],
  )
}

export default async function CompanyInternshipsPage() {
  const companyId = await getCurrentCompanyId()
  const internships = await getInternships(companyId)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Internships</h1>
        <Button asChild>
          <Link href="/company/internships/new">
            <Plus className="mr-2 h-4 w-4" />
            Post New Internship
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {internships.map((internship) => (
          <Card key={internship.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-semibold">{internship.title}</h2>
                    <Badge
                      variant={
                        internship.status === "ACTIVE"
                          ? "default"
                          : internship.status === "DRAFT"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {internship.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>
                        {internship.location}
                        {internship.isRemote && " (Remote)"}
                        {internship.isHybrid && " (Hybrid)"}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(internship.startDate).toLocaleDateString()} -{" "}
                        {new Date(internship.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Deadline: {new Date(internship.deadline).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{internship.applicationCount} Applications</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/company/internships/${internship.id}/applications`}>
                      <Users className="mr-2 h-4 w-4" />
                      Applications
                    </Link>
                  </Button>

                  <Button asChild variant="outline" size="sm">
                    <Link href={`/internships/${internship.id}`}>
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
                        <Link href={`/company/internships/${internship.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      {internship.status === "ACTIVE" && (
                        <DropdownMenuItem asChild>
                          <Link href={`/company/internships/${internship.id}/close`}>
                            <Clock className="mr-2 h-4 w-4" />
                            Close
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {internship.status === "DRAFT" && (
                        <DropdownMenuItem asChild>
                          <Link href={`/company/internships/${internship.id}/publish`}>
                            <Briefcase className="mr-2 h-4 w-4" />
                            Publish
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild className="text-red-600">
                        <Link href={`/company/internships/${internship.id}/delete`}>
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

        {internships.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Internships Yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't posted any internships yet. Create your first internship to start receiving applications.
              </p>
              <Button asChild>
                <Link href="/company/internships/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Post New Internship
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

