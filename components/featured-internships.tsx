import { sql } from "@/lib/db-utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, DollarSign } from "lucide-react"
import Link from "next/link"

interface Internship {
  id: string
  title: string
  companyName: string
  location: string
  isRemote: boolean
  isHybrid: boolean
  deadline: string
  isPaid: boolean
  compensation: string | null
}

export default async function FeaturedInternships() {
  // Fetch featured internships from the database
  const internships = await sql`
    SELECT 
      i.id, 
      i.title, 
      u.name as "companyName", 
      i.location, 
      i."isRemote", 
      i."isHybrid", 
      i.deadline, 
      i."isPaid", 
      i.compensation
    FROM "Internship" i
    JOIN "Company" c ON i."companyId" = c.id
    JOIN "User" u ON c."userId" = u.id
    WHERE i.status = 'ACTIVE'
    ORDER BY i."createdAt" DESC
    LIMIT 3
  `

  if (internships.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg">
        <p className="text-muted-foreground">No internships found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {internships.map((internship: Internship) => (
        <Card key={internship.id} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="line-clamp-1">{internship.title}</CardTitle>
                <CardDescription>{internship.companyName}</CardDescription>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                {internship.isRemote && <Badge variant="outline">Remote</Badge>}
                {internship.isHybrid && <Badge variant="outline">Hybrid</Badge>}
                {internship.isPaid && <Badge variant="secondary">Paid</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{internship.location}</span>
              </div>
              {internship.deadline && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Deadline: {new Date(internship.deadline).toLocaleDateString()}</span>
                </div>
              )}
              {internship.compensation && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>{internship.compensation}</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/internships/${internship.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

