import { Suspense } from "react"
import { getMicroInternships } from "@/lib/db/micro-internships"
import { MicroInternshipCard } from "@/components/micro-internships/micro-internship-card"
import { MicroInternshipFilters } from "@/components/micro-internships/micro-internship-filters"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Micro-Internships | InternLink",
  description: "Find short-term, flexible internship opportunities that fit your schedule",
}

interface PageProps {
  searchParams: {
    search?: string
    isRemote?: string
    isPaid?: string
    maxDurationWeeks?: string
    maxWeeklyCommitment?: string
    projectType?: string
  }
}

export default async function MicroInternshipsPage({ searchParams }: PageProps) {
  // Parse search params
  const search = searchParams.search || ""
  const isRemote = searchParams.isRemote === "true" ? true : searchParams.isRemote === "false" ? false : undefined
  const isPaid = searchParams.isPaid === "true" ? true : searchParams.isPaid === "false" ? false : undefined
  const maxDurationWeeks = searchParams.maxDurationWeeks
    ? Number.parseInt(searchParams.maxDurationWeeks, 10)
    : undefined
  const maxWeeklyCommitment = searchParams.maxWeeklyCommitment
    ? Number.parseInt(searchParams.maxWeeklyCommitment, 10)
    : undefined
  const projectType = searchParams.projectType || undefined

  // Fetch micro-internships with filters
  const microInternships = await getMicroInternships()

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Micro-Internships</h1>
        <p className="text-muted-foreground">Short-term, flexible opportunities that fit your schedule</p>
      </div>

      <MicroInternshipFilters />

      <div className="mt-8">
        <Suspense fallback={<MicroInternshipsSkeleton />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {microInternships.map((microInternship) => (
              <MicroInternshipCard key={microInternship.id} microInternship={microInternship} />
            ))}
          </div>

          {microInternships.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No micro-internships found</h2>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or check back later for new opportunities.
              </p>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  )
}

function MicroInternshipsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-2 py-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-9 w-full mt-4" />
        </div>
      ))}
    </div>
  )
}

