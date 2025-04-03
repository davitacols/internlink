import { NextResponse } from "next/server"
import { sql } from "@/lib/db-utils"
import { hash } from "bcryptjs"

export async function GET() {
  try {
    // Fetch all users (excluding password)
    const users = await sql`
      SELECT id, name, email, role, "profileImage", "createdAt", "updatedAt" 
      FROM "User"
    `

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json()

    // Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Name, email, password, and role are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await sql`SELECT * FROM "User" WHERE email = ${email}`
    if (existingUser.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await hash(password, 10)

    // Generate a unique ID
    const id = crypto.randomUUID()
    const now = new Date()

    // Insert the new user
    const result = await sql`
      INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
      VALUES (${id}, ${name}, ${email}, ${hashedPassword}, ${role}, ${now.toISOString()}, ${now.toISOString()})
      RETURNING id, name, email, role, "profileImage", "createdAt", "updatedAt"
    `

    // Create role-specific profile
    if (role === "STUDENT") {
      const studentId = crypto.randomUUID()
      await sql`
        INSERT INTO "Student" (id, "userId", "createdAt", "updatedAt")
        VALUES (${studentId}, ${id}, ${now.toISOString()}, ${now.toISOString()})
      `
    } else if (role === "COMPANY") {
      const companyId = crypto.randomUUID()
      await sql`
        INSERT INTO "Company" (id, "userId", "createdAt", "updatedAt")
        VALUES (${companyId}, ${id}, ${now.toISOString()}, ${now.toISOString()})
      `
    } else if (role === "SCHOOL") {
      const schoolId = crypto.randomUUID()
      await sql`
        INSERT INTO "School" (id, "userId", "createdAt", "updatedAt")
        VALUES (${schoolId}, ${id}, ${now.toISOString()}, ${now.toISOString()})
      `
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

