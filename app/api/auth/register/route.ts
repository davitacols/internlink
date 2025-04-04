import { type NextRequest, NextResponse } from "next/server"
import { createUser, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json()

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate role
    if (!["STUDENT", "COMPANY", "SCHOOL"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const result = await createUser(email, password, name, role as "STUDENT" | "COMPANY" | "SCHOOL")

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Registration failed" }, { status: 400 })
    }

    // Create session for the new user
    if (result.userId) {
      await createSession(result.userId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
  }
}

