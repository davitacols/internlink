import { type NextRequest, NextResponse } from "next/server"
import { query, queryOne } from "@/lib/db"

// GET a specific internship
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const internship = await queryOne(
      `
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
        u.name as "companyName"
      FROM "Internship" i
      JOIN "Company" c ON i."companyId" = c.id
      JOIN "User" u ON c."userId" = u.id
      WHERE i.id = $1
    `,
      [params.id],
    )

    if (!internship) {
      return NextResponse.json({ error: "Internship not found" }, { status: 404 })
    }

    // Get skills for this internship
    const skills = await query(
      `
      SELECT 
        is."skillId",
        is.importance,
        s.name,
        s.category
      FROM "InternshipSkill" is
      JOIN "Skill" s ON is."skillId" = s.id
      WHERE is."internshipId" = $1
      ORDER BY is.importance DESC, s.name
    `,
      [params.id],
    )

    // Get application count
    const applicationCount = await queryOne(
      `
      SELECT COUNT(*) as count
      FROM "Application"
      WHERE "internshipId" = $1
    `,
      [params.id],
    )

    return NextResponse.json({
      ...internship,
      skills,
      applicationCount: Number.parseInt(applicationCount?.count || "0"),
    })
  } catch (error) {
    console.error("Error fetching internship:", error)
    return NextResponse.json({ error: "An error occurred while fetching the internship" }, { status: 500 })
  }
}

// PUT (update) a specific internship
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
      skills = [],
    } = data

    // Validate required fields
    if (!title || !description || !location || !startDate || !endDate || !deadline) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update internship
    await queryOne(
      `
      UPDATE "Internship"
      SET 
        title = $1, 
        description = $2, 
        location = $3, 
        "isRemote" = $4, 
        "isHybrid" = $5, 
        "startDate" = $6, 
        "endDate" = $7, 
        deadline = $8, 
        "isPaid" = $9, 
        compensation = $10, 
        status = $11,
        "updatedAt" = NOW()
      WHERE id = $12
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
        params.id,
      ],
    )

    // Update skills
    // First, remove all existing skills
    await queryOne(
      `
      DELETE FROM "InternshipSkill"
      WHERE "internshipId" = $1
    `,
      [params.id],
    )

    // Then add the new skills
    if (skills.length > 0) {
      for (const skill of skills) {
        await queryOne(
          `
          INSERT INTO "InternshipSkill" ("internshipId", "skillId", importance)
          VALUES ($1, $2, $3)
        `,
          [params.id, skill.skillId, skill.importance || 3],
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: "Internship updated successfully",
    })
  } catch (error) {
    console.error("Error updating internship:", error)
    return NextResponse.json({ error: "An error occurred while updating the internship" }, { status: 500 })
  }
}

// DELETE a specific internship
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if there are any applications for this internship
    const applicationCount = await queryOne(
      `
      SELECT COUNT(*) as count
      FROM "Application"
      WHERE "internshipId" = $1
    `,
      [params.id],
    )

    if (Number.parseInt(applicationCount?.count || "0") > 0) {
      return NextResponse.json({ error: "Cannot delete internship with existing applications" }, { status: 400 })
    }

    // Delete internship skills first (due to foreign key constraints)
    await queryOne(
      `
      DELETE FROM "InternshipSkill"
      WHERE "internshipId" = $1
    `,
      [params.id],
    )

    // Delete the internship
    await queryOne(
      `
      DELETE FROM "Internship"
      WHERE id = $1
    `,
      [params.id],
    )

    return NextResponse.json({
      success: true,
      message: "Internship deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting internship:", error)
    return NextResponse.json({ error: "An error occurred while deleting the internship" }, { status: 500 })
  }
}

