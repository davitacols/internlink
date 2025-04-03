import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db-utils"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Update user name
    if (data.name) {
      await query('UPDATE "User" SET name = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2', [data.name, user.id])
    }

    // Update role-specific profile
    if (user.role === "STUDENT") {
      const { school, major, graduationYear, bio, skills } = data

      await query(
        `UPDATE "Student" SET 
          school = COALESCE($1, school),
          major = COALESCE($2, major),
          "graduationYear" = COALESCE($3, "graduationYear"),
          bio = COALESCE($4, bio),
          skills = COALESCE($5, skills),
          "profileCompletion" = 
            CASE 
              WHEN $1 IS NOT NULL AND $2 IS NOT NULL AND $3 IS NOT NULL AND $4 IS NOT NULL AND $5 IS NOT NULL THEN 100
              ELSE 
                10 + 
                CASE WHEN $1 IS NOT NULL AND $1 != '' THEN 18 ELSE 0 END +
                CASE WHEN $2 IS NOT NULL AND $2 != '' THEN 18 ELSE 0 END +
                CASE WHEN $3 IS NOT NULL THEN 18 ELSE 0 END +
                CASE WHEN $4 IS NOT NULL AND $4 != '' THEN 18 ELSE 0 END +
                CASE WHEN $5 IS NOT NULL AND array_length($5, 1) > 0 THEN 18 ELSE 0 END
            END,
          "updatedAt" = CURRENT_TIMESTAMP
        WHERE "userId" = $6`,
        [school, major, graduationYear, bio, skills, user.id],
      )
    } else if (user.role === "COMPANY") {
      const { companyName, industry, size, location, website, description } = data

      await query(
        `UPDATE "Company" SET 
          "companyName" = COALESCE($1, "companyName"),
          industry = COALESCE($2, industry),
          size = COALESCE($3, size),
          location = COALESCE($4, location),
          website = COALESCE($5, website),
          description = COALESCE($6, description),
          "updatedAt" = CURRENT_TIMESTAMP
        WHERE "userId" = $7`,
        [companyName, industry, size, location, website, description, user.id],
      )
    } else if (user.role === "SCHOOL") {
      const { schoolName, type, location, website, description } = data

      await query(
        `UPDATE "School" SET 
          "schoolName" = COALESCE($1, "schoolName"),
          type = COALESCE($2, type),
          location = COALESCE($3, location),
          website = COALESCE($4, website),
          description = COALESCE($5, description),
          "updatedAt" = CURRENT_TIMESTAMP
        WHERE "userId" = $6`,
        [schoolName, type, location, website, description, user.id],
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ success: false, message: "Failed to update profile" }, { status: 500 })
  }
}

