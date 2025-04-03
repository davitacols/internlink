"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MicroInternshipCard } from "@/components/micro-internships/micro-internship-card"
import type { MicroInternship } from "@/lib/db/micro-internships"
import Link from "next/link"

export function MicroInternshipRecommendations() {
  const [microInternships, setMicroInternships] = useState<MicroInternship[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMicroInternships() {
      try {
        const response = await fetch("/api/micro-internships?limit=3")

        if (!response.ok) {
          throw new Error("Failed to fetch micro-internships")
        }

        const data = await response.json()
        setMicroInternships(data)
      } catch (err) {
        setError("Error loading micro-internships")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMicroInternships()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Micro-Internship Opportunities</CardTitle>
          <CardDescription>Short-term projects that fit your schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="space-y-2 py-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Micro-Internship Opportunities</CardTitle>
          <CardDescription>Short-term projects that fit your schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4">
            <p className="text-red-500 mb-2">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (microInternships.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Micro-Internship Opportunities</CardTitle>
          <CardDescription>Short-term projects that fit your schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4">
            <p className="text-muted-foreground mb-4">No micro-internships available at the moment.</p>
            <Button asChild>
              <Link href="/micro-internships">Browse All Opportunities</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Micro-Internship Opportunities</CardTitle>
          <CardDescription>Short-term projects that fit your schedule</CardDescription>
        </div>
        <Button variant="outline" asChild>
          <Link href="/micro-internships">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {microInternships.map((microInternship) => (
            <div key={microInternship.id} className="border rounded-lg overflow-hidden">
              <MicroInternshipCard microInternship={microInternship} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

