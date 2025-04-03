import { type NextRequest, NextResponse } from "next/server"
import { query, queryOne } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { studentId, internshipId, coverLetter, resumeUrl } = await request.json()

    // Validate required fields
    if (!studentId || !internshipId) {
      return NextResponse.json({ error: "Student ID and Internship ID are required" }, { status: 400 })
    }

    // Check if student exists
    const student = await queryOne(
      `
      SELECT id FROM "Student" WHERE id = $1
    `,
      [studentId],
    )

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Check if internship exists
    const internship = await queryOne(
      `
      SELECT id, deadline FROM "Internship" WHERE id = $1 AND status = 'ACTIVE'
    `,
      [internshipId],
    )

    if (!internship) {
      return NextResponse.json({ error: "Internship not found or not active" }, { status: 404 })
    }

    // Check if deadline has passed
    const deadline = new Date(internship.deadline)
    const now = new Date()

    if (deadline < now) {
      return NextResponse.json({ error: "Application deadline has passed" }, { status: 400 })
    }

    // Check if student has already applied
    const existingApplication = await queryOne(
      `
      SELECT id FROM "Application" 
      WHERE "studentId" = $1 AND "internshipId" = $2
    `,
      [studentId, internshipId],
    )

    if (existingApplication) {
      return NextResponse.json({ error: "You have already applied for this internship" }, { status: 400 })
    }

    // Create application
    const result = await query(
      `
      INSERT INTO "Application" ("studentId", "internshipId", "coverLetter", "resumeUrl", "status")
      VALUES ($1, $2, $3, $4, 'APPLIED')
      RETURNING id
    `,
      [studentId, internshipId, coverLetter || null, resumeUrl || null],
    )

    return NextResponse.json({
      success: true,
      applicationId: result[0].id,
      message: "Application submitted successfully",
    })
  } catch (error) {
    console.error("Error submitting application:", error)
    return NextResponse.json({ error: "An error occurred while processing your application" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")
    const internshipId = searchParams.get("internshipId")

    let queryText = `
      SELECT a.*, i.title as "internshipTitle", u.name as "companyName"
      FROM "Application" a
      JOIN "Internship" i ON a."internshipId" = i.id
      JOIN "Company" c ON i."companyId" = c.id
      JOIN "User" u ON c."userId" = u.id
      WHERE 1=1
    `

    const params: any[] = []

    if (studentId) {
      params.push(studentId)
      queryText += ` AND a."studentId" = $${params.length}`
    }

    if (internshipId) {
      params.push(internshipId)
      queryText += ` AND a."internshipId" = $${params.length}`
    }

    queryText += ` ORDER BY a."createdAt" DESC`

    const applications = await query(queryText, params)

    return NextResponse.json(applications)
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json({ error: "An error occurred while fetching applications" }, { status: 500 })
  }
}

