import { type NextRequest, NextResponse } from "next/server"
import { queryOne } from "@/lib/db"

// This is a placeholder function - in a real app, you would get the current user from the session
async function getCurrentUser() {
  // For demo purposes, we'll return a hardcoded user ID
  // In a real app, you would get this from the authenticated user session
  return {
    id: "6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u",
    role: "COMPANY",
  }
}

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (currentUser.role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const company = await queryOne(
      `
      SELECT c.*, u.name, u.email, u."profileImage"
      FROM "Company" c
      JOIN "User" u ON c."userId" = u.id
      WHERE c."userId" = $1
    `,
      [currentUser.id],
    )

    if (!company) {
      return NextResponse.json({ error: "Company profile not found" }, { status: 404 })
    }

    return NextResponse.json(company)
  } catch (error) {
    console.error("Error fetching company profile:", error)
    return NextResponse.json({ error: "An error occurred while fetching the company profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()

    if (currentUser.role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data = await request.json()
    const { name, industry, size, location, website, description } = data

    // Update user name
    if (name) {
      await queryOne(
        `
        UPDATE "User"
        SET name = $1, "updatedAt" = NOW()
        WHERE id = $2
      `,
        [name, currentUser.id],
      )
    }

    // Update company profile
    await queryOne(
      `
      UPDATE "Company"
      SET 
        industry = $1, 
        size = $2, 
        location = $3, 
        website = $4, 
        description = $5, 
        "updatedAt" = NOW()
      WHERE "userId" = $6
    `,
      [industry || null, size || null, location || null, website || null, description || null, currentUser.id],
    )

    return NextResponse.json({
      success: true,
      message: "Company profile updated successfully",
    })
  } catch (error) {
    console.error("Error updating company profile:", error)
    return NextResponse.json({ error: "An error occurred while updating the company profile" }, { status: 500 })
  }
}

