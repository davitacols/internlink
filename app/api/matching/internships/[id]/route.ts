import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { findMatchingStudentsForInternship } from "@/lib/matching-algorithm"
import { neon } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const internshipId = params.id
    const limit = Number.parseInt(request.nextUrl.searchParams.get("limit") || "10")

    // Check authorization - only the company that posted the internship, the school, or admin can see matches
    if (session.user.role !== "ADMIN" && session.user.role !== "SCHOOL") {
      if (session.user.role !== "COMPANY") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }

      // Check if the internship belongs to the company
      const sql = neon(process.env.DATABASE_URL!)
      const internship = await sql`
        SELECT i.id 
        FROM internships i
        WHERE i.id = ${internshipId} AND i.company_id = ${session.user.companyId}
      `

      if (internship.length === 0) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    const matches = await findMatchingStudentsForInternship(internshipId, limit)

    return NextResponse.json({ matches })
  } catch (error) {
    console.error("Error in matching API:", error)
    return NextResponse.json({ error: "Failed to get matches" }, { status: 500 })
  }
}

