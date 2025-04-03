import { type NextRequest, NextResponse } from "next/server"
import { queryOne } from "@/lib/db"
import { compare, hash } from "bcryptjs"

// This is a placeholder function - in a real app, you would get the current user from the session
async function getCurrentUser() {
  // For demo purposes, we'll return a hardcoded user ID
  // In a real app, you would get this from the authenticated user session
  return {
    id: "6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u",
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    const data = await request.json()
    const { email, currentPassword, newPassword } = data

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await queryOne(
        `
        SELECT id
        FROM "User"
        WHERE email = $1 AND id != $2
      `,
        [email, currentUser.id],
      )

      if (existingUser) {
        return NextResponse.json({ error: "Email is already taken by another user" }, { status: 400 })
      }

      // Update email
      await queryOne(
        `
        UPDATE "User"
        SET email = $1, "updatedAt" = NOW()
        WHERE id = $2
      `,
        [email, currentUser.id],
      )
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      // Get current password hash
      const user = await queryOne(
        `
        SELECT password
        FROM "User"
        WHERE id = $1
      `,
        [currentUser.id],
      )

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Verify current password
      const isPasswordValid = await compare(currentPassword, user.password)

      if (!isPasswordValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
      }

      // Hash new password
      const hashedPassword = await hash(newPassword, 10)

      // Update password
      await queryOne(
        `
        UPDATE "User"
        SET password = $1, "updatedAt" = NOW()
        WHERE id = $2
      `,
        [hashedPassword, currentUser.id],
      )
    }

    return NextResponse.json({
      success: true,
      message: "Account settings updated successfully",
    })
  } catch (error) {
    console.error("Error updating account settings:", error)
    return NextResponse.json({ error: "An error occurred while updating account settings" }, { status: 500 })
  }
}

