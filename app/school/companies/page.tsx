import { Suspense } from "react"
import Link from "next/link"
import { neon } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

async function getCompanies(search = "") {
  const sql = neon(process.env.DATABASE_URL!)

  let query = `
    SELECT c.id, c.name, c.industry, c.location, c.size,
           COUNT(DISTINCT i.id) as internships_count,
           COUNT(DISTINCT a.id) as applications_count
    FROM companies c
    LEFT JOIN internships i ON c.id = i.company_id
    LEFT JOIN applications a ON i.id = a.internship_id
  `

  const params = []

  if (search) {
    query += ` WHERE c.name ILIKE $1 OR c.industry ILIKE $1 OR c.location ILIKE $1`
    params.push(`%${search}%`)
  }

  query += `
    GROUP BY c.id, c.name, c.industry, c.location, c.size
    ORDER BY c.name
  `

  const companies = await sql.query(query, params)
  return companies.rows
}

async function CompaniesContent({ searchParams }: { searchParams: { search?: string } }) {
  const search = searchParams.search || ""
  const companies = await getCompanies(search)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Partner Companies</CardTitle>
        <div className="flex items-center gap-2">
          <form className="flex items-center gap-2">
            <Input name="search" placeholder="Search companies..." className="w-[250px]" defaultValue={search} />
            <Button type="submit" size="sm">
              Search
            </Button>
          </form>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {companies.length > 0 ? (
            companies.map((company: any) => (
              <Card key={company.id} className="overflow-hidden">
                <div className="h-12 bg-primary" />
                <CardContent className="-mt-6">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-background p-2 shadow-sm">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xl font-semibold">{company.name.charAt(0)}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">{company.name}</h3>
                      <p className="text-sm text-muted-foreground">{company.location}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Industry</span>
                      <Badge variant="outline">{company.industry}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Size</span>
                      <span className="text-sm">{company.size}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Internships</span>
                      <span className="text-sm">{company.internships_count}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Applications</span>
                      <span className="text-sm">{company.applications_count}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Link href={`/school/companies/${company.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-6 text-muted-foreground">No companies found</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Companies({ searchParams }: { searchParams: { search?: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Partner Companies</h1>
      </div>
      <Suspense fallback={<CompaniesSkeleton />}>
        <CompaniesContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

function CompaniesSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-[320px]" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-12 w-full" />
                <CardContent className="-mt-6">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {Array(4)
                      .fill(0)
                      .map((_, j) => (
                        <div key={j} className="flex items-center justify-between">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      ))}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Skeleton className="h-9 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}

