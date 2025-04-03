import { type NextRequest, NextResponse } from "next/server"
import { query, queryOne } from "@/lib/db"

// GET all internships
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const companyId = searchParams.get("companyId")
    const status = searchParams.get("status")

    let sql = `
      SELECT 
        i.id, 
        i.title, 
        i.description, 
        i.location, 
        i."isRemote", 
        i."isHybrid", 
        i."startDate", 
        i."endDate", 
        i.deadline, 
        i."isPaid", 
        i.compensation, 
        i.status, 
        i."companyId",
        i."createdAt",
        i."updatedAt",
        c.id as "companyId",
        u.name as "companyName",
        COUNT(a.id) as "applicationCount"
      FROM "Internship" i
      JOIN "Company" c ON i."companyId" = c.id
      JOIN "User" u ON c."userId" = u.id
      LEFT JOIN "Application" a ON i.id = a."internshipId"
    `

    const whereConditions = []
    const params = []
    let paramIndex = 1

    if (companyId) {
      whereConditions.push(`i."companyId" = $${paramIndex}`)
      params.push(companyId)
      paramIndex++
    }

    if (status) {
      whereConditions.push(`i.status = $${paramIndex}`)
      params.push(status)
      paramIndex++
    }

    if (whereConditions.length > 0) {
      sql += ` WHERE ${whereConditions.join(" AND ")}`
    }

    sql += ` GROUP BY i.id, c.id, u.name ORDER BY i."createdAt" DESC`

    const internships = await query(sql, params)

    return NextResponse.json(internships)
  } catch (error) {
    console.error("Error fetching internships:", error)
    return NextResponse.json({ error: "An error occurred while fetching internships" }, { status: 500 })
  }
}

// POST a new internship
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      title,
      description,
      location,
      isRemote,
      isHybrid,
      startDate,
      endDate,
      deadline,
      isPaid,
      compensation,
      status,
      companyId,
      skills = [],
    } = data

    // Validate required fields
    if (!title || !description || !location || !startDate || !endDate || !deadline || !companyId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create internship
    const internship = await queryOne(
      `
      INSERT INTO "Internship" (
        title, 
        description, 
        location, 
        "isRemote", 
        "isHybrid", 
        "startDate", 
        "endDate", 
        deadline, 
        "isPaid", 
        compensation, 
        status, 
        "companyId"
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id
    `,
      [
        title,
        description,
        location,
        isRemote || false,
        isHybrid || false,
        startDate,
        endDate,
        deadline,
        isPaid || false,
        compensation || null,
        status || "DRAFT",
        companyId,
      ],
    )

    if (!internship) {
      throw new Error("Failed to create internship")
    }

    // Add skills if provided
    if (skills.length > 0) {
      for (const skill of skills) {
        await queryOne(
          `
          INSERT INTO "InternshipSkill" ("internshipId", "skillId", importance)
          VALUES ($1, $2, $3)
        `,
          [internship.id, skill.skillId, skill.importance || 3],
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: "Internship created successfully",
      internshipId: internship.id,
    })
  } catch (error) {
    console.error("Error creating internship:", error)
    return NextResponse.json({ error: "An error occurred while creating the internship" }, { status: 500 })
  }
}

