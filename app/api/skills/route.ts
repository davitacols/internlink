import { NextResponse } from "next/server"
import { sql } from "@/lib/db-utils"

export async function GET() {
  try {
    // Fetch all skills from the database
    const skills = await sql`SELECT * FROM "Skill" ORDER BY name ASC`

    return NextResponse.json(skills)
  } catch (error) {
    console.error("Error fetching skills:", error)
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, category } = await request.json()

    // Validate input
    if (!name) {
      return NextResponse.json({ error: "Skill name is required" }, { status: 400 })
    }

    // Generate a unique ID
    const id = crypto.randomUUID()
    const now = new Date()

    // Insert the new skill
    const result = await sql`
      INSERT INTO "Skill" (id, name, category, "createdAt", "updatedAt")
      VALUES (${id}, ${name}, ${category || null}, ${now.toISOString()}, ${now.toISOString()})
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating skill:", error)
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 })
  }
}

