import type { Metadata } from "next"
import { query } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Calendar, DollarSign, Search } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Internships | InternLink",
  description: "Browse internship opportunities on InternLink",
}

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
  companyName: string
}

async function getInternships(): Promise<Internship[]> {
  const internships = await query<Internship>(`
   SELECT i.*, u.name as "companyName"
   FROM "Internship" i
   JOIN "Company" c ON i."companyId" = c.id
   JOIN "User" u ON c."userId" = u.id
   WHERE i.status = 'ACTIVE'
   ORDER BY i.deadline ASC
 `)

  return internships
}

export default async function InternshipsPage() {
  const internships = await getInternships()

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Browse Internships</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search internships..." className="pl-8" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Filter</Button>
          <Button variant="outline">Sort</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {internships.map((internship) => (
          <Card key={internship.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{internship.title}</CardTitle>
                {internship.isPaid && (
                  <Badge variant="secondary" className="ml-2">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Paid
                  </Badge>
                )}
              </div>
              <CardDescription className="text-base">{internship.companyName}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {internship.location}
                  {internship.isRemote && " (Remote)"}
                  {internship.isHybrid && " (Hybrid)"}
                </span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  {new Date(internship.startDate).toLocaleDateString()} -{" "}
                  {new Date(internship.endDate).toLocaleDateString()}
                </span>
              </div>
              <p className="line-clamp-3 mb-4">{internship.description}</p>
              <div className="mt-auto">
                <Button asChild className="w-full">
                  <Link href={`/internships/${internship.id}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {internships.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No internships found</h2>
          <p className="text-muted-foreground mb-6">There are currently no active internships available.</p>
        </div>
      )}
    </div>
  )
}

