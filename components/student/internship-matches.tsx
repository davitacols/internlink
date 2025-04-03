"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { InternshipMatch } from "@/lib/matching-algorithm"
import { Building2, MapPin } from "lucide-react"

interface InternshipMatchesProps {
  studentId: string
  limit?: number
}

export function InternshipMatches({ studentId, limit = 5 }: InternshipMatchesProps) {
  const [matches, setMatches] = useState<InternshipMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/matching/students/${studentId}?limit=${limit}`)

        if (!response.ok) {
          throw new Error("Failed to fetch matches")
        }

        const data = await response.json()
        setMatches(data.matches)
      } catch (err) {
        setError("Failed to load matches. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [studentId, limit])

  if (loading) {
    return <InternshipMatchesSkeleton count={limit} />
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Internships</CardTitle>
          <CardDescription>Personalized matches based on your skills and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Internships</CardTitle>
        <CardDescription>Personalized matches based on your skills and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        {matches.length > 0 ? (
          <div className="space-y-6">
            {matches.map((match) => (
              <div key={match.internshipId} className="border rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{match.internshipTitle}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Building2 className="h-4 w-4 mr-1" />
                      <span>{match.companyName}</span>
                      <span className="mx-2">•</span>
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{match.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <div className="text-sm font-medium mb-1">Match Score</div>
                      <div className="flex items-center">
                        <Progress value={match.matchScore * 100} className="h-2 w-24 mr-2" />
                        <span className="text-sm font-medium">{Math.round(match.matchScore * 100)}%</span>
                      </div>
                    </div>
                    <Link href={`/internships/${match.internshipId}`}>
                      <Button size="sm">View</Button>
                    </Link>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium mb-2">Skill Matches</div>
                  <div className="flex flex-wrap gap-2">
                    {match.skillMatches.map((skill) => (
                      <Badge
                        key={skill.skillId}
                        variant={skill.match > 0.7 ? "default" : "outline"}
                        className="px-2 py-1"
                      >
                        {skill.skillName}
                        <span className="ml-1 text-xs opacity-70">{Math.round(skill.match * 100)}%</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center">
              <Link href="/student/matches">
                <Button variant="outline">View All Matches</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No matches found. Try updating your skills and preferences.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function InternshipMatchesSkeleton({ count = 5 }: { count?: number }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Array(count)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-2 w-24" />
                    </div>
                    <Skeleton className="h-9 w-16" />
                  </div>
                </div>
                <div className="mt-4">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <div className="flex flex-wrap gap-2">
                    {Array(3)
                      .fill(0)
                      .map((_, j) => (
                        <Skeleton key={j} className="h-6 w-20" />
                      ))}
                  </div>
                </div>
              </div>
            ))}
          <div className="flex justify-center">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

