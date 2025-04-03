"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, DollarSign } from "lucide-react"

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

export default function InternshipList() {
  const [internships, setInternships] = useState<Internship[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInternships() {
      try {
        const response = await fetch("/api/internships")

        if (!response.ok) {
          throw new Error("Failed to fetch internships")
        }

        const data = await response.json()
        setInternships(data)
      } catch (err) {
        setError("Error loading internships. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInternships()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  if (internships.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No internships found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {internships.map((internship) => (
        <Card key={internship.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{internship.title}</CardTitle>
                <CardDescription>{internship.companyName}</CardDescription>
              </div>
              <div className="flex gap-2">
                {internship.isRemote && <Badge variant="outline">Remote</Badge>}
                {internship.isHybrid && <Badge variant="outline">Hybrid</Badge>}
                {internship.isPaid && <Badge variant="secondary">Paid</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
            <Button variant="outline" size="sm">
              Save
            </Button>
            <Button size="sm">Apply</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

