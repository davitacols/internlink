import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, GraduationCap, Building2, ArrowRight } from "lucide-react"
import { sql } from "@/lib/db-utils"
import FeaturedInternships from "@/components/featured-internships"

export default async function HomePage() {
  // Get counts from database
  const counts = await sql`
    SELECT 
      (SELECT COUNT(*) FROM "Internship" WHERE status = 'ACTIVE') as internship_count,
      (SELECT COUNT(*) FROM "Student") as student_count,
      (SELECT COUNT(*) FROM "Company") as company_count
  `

  const internshipCount = Number.parseInt(counts[0]?.internship_count || "0")
  const studentCount = Number.parseInt(counts[0]?.student_count || "0")
  const companyCount = Number.parseInt(counts[0]?.company_count || "0")

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">InternLink</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Connecting students with career-building internship opportunities and helping companies discover top talent.
        </p>
        <div className="flex gap-4 mt-8">
          <Button asChild size="lg">
            <Link href="/internships">Browse Internships</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/register">Sign Up</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Internships</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{internshipCount}</div>
            <p className="text-xs text-muted-foreground">Opportunities available now</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentCount}</div>
            <p className="text-xs text-muted-foreground">Talented students seeking opportunities</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partner Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyCount}</div>
            <p className="text-xs text-muted-foreground">Organizations offering internships</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Internships</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/internships" className="flex items-center">
              View all <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <FeaturedInternships />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>For Students</CardTitle>
            <CardDescription>Launch your career with meaningful internship experiences</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc pl-5">
              <li>Create a profile showcasing your skills and interests</li>
              <li>Browse opportunities filtered by industry and location</li>
              <li>Get matched with internships that fit your career goals</li>
              <li>Receive feedback and build your professional network</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/register?role=student">Join as a Student</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>For Companies</CardTitle>
            <CardDescription>Discover pre-vetted talent aligned with your specific needs</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc pl-5">
              <li>Post opportunities with detailed qualification requirements</li>
              <li>Browse student profiles and portfolios</li>
              <li>Use AI matching to find candidates with the right skills</li>
              <li>Build relationships with educational institutions</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/register?role=company">Join as a Company</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>For Schools</CardTitle>
            <CardDescription>Help your students succeed with real-world experience</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc pl-5">
              <li>Track student placement statistics and outcomes</li>
              <li>Integrate internship programs with curriculum</li>
              <li>Access data on in-demand skills and industry trends</li>
              <li>Build partnerships with companies in your region</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/register?role=school">Join as a School</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

