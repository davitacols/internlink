import { type NextRequest, NextResponse } from "next/server"
import { getMicroInternships, searchMicroInternships } from "@/lib/db/micro-internships"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)
    const offset = Number.parseInt(searchParams.get("offset") || "0", 10)
    const search = searchParams.get("search") || ""

    // Parse filters
    const isRemote =
      searchParams.get("isRemote") === "true" ? true : searchParams.get("isRemote") === "false" ? false : undefined
    const isPaid =
      searchParams.get("isPaid") === "true" ? true : searchParams.get("isPaid") === "false" ? false : undefined
    const maxDurationWeeks = searchParams.get("maxDurationWeeks")
      ? Number.parseInt(searchParams.get("maxDurationWeeks") || "0", 10)
      : undefined
    const maxWeeklyCommitment = searchParams.get("maxWeeklyCommitment")
      ? Number.parseInt(searchParams.get("maxWeeklyCommitment") || "0", 10)
      : undefined
    const projectType = searchParams.get("projectType") || undefined

    let microInternships

    if (
      search ||
      isRemote !== undefined ||
      isPaid !== undefined ||
      maxDurationWeeks !== undefined ||
      maxWeeklyCommitment !== undefined ||
      projectType !== undefined
    ) {
      // Use search with filters
      microInternships = await searchMicroInternships(search, {
        isRemote,
        isPaid,
        maxDurationWeeks,
        maxWeeklyCommitment,
        projectType,
      })
    } else {
      // Use regular pagination
      microInternships = await getMicroInternships(limit, offset)
    }

    return NextResponse.json(microInternships)
  } catch (error) {
    console.error("Error fetching micro-internships:", error)
    return NextResponse.json({ error: "Failed to fetch micro-internships" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Ensure this is a micro-internship
    data.isMicroInternship = true

    // Validate required fields
    if (!data.title || !data.description || !data.companyId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert the micro-internship using the existing internship table
    const result = await fetch(`${request.nextUrl.origin}/api/internships`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!result.ok) {
      const errorData = await result.json()
      throw new Error(errorData.error || "Failed to create micro-internship")
    }

    const responseData = await result.json()

    return NextResponse.json({
      success: true,
      message: "Micro-internship created successfully",
      id: responseData.internshipId,
    })
  } catch (error) {
    console.error("Error creating micro-internship:", error)
    return NextResponse.json({ error: "Failed to create micro-internship" }, { status: 500 })
  }
}

