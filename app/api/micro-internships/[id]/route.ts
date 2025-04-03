import { type NextRequest, NextResponse } from "next/server"
import { getMicroInternshipById } from "@/lib/db/micro-internships"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const microInternship = await getMicroInternshipById(params.id)

    if (!microInternship) {
      return NextResponse.json({ error: "Micro-internship not found" }, { status: 404 })
    }

    return NextResponse.json(microInternship)
  } catch (error) {
    console.error("Error fetching micro-internship:", error)
    return NextResponse.json({ error: "Failed to fetch micro-internship" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()

    // Ensure this is a micro-internship
    data.isMicroInternship = true

    // Forward to the internships API
    const result = await fetch(`${request.nextUrl.origin}/api/internships/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!result.ok) {
      const errorData = await result.json()
      throw new Error(errorData.error || "Failed to update micro-internship")
    }

    return NextResponse.json({
      success: true,
      message: "Micro-internship updated successfully",
    })
  } catch (error) {
    console.error("Error updating micro-internship:", error)
    return NextResponse.json({ error: "Failed to update micro-internship" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Forward to the internships API
    const result = await fetch(`${request.nextUrl.origin}/api/internships/${params.id}`, {
      method: "DELETE",
    })

    if (!result.ok) {
      const errorData = await result.json()
      throw new Error(errorData.error || "Failed to delete micro-internship")
    }

    return NextResponse.json({
      success: true,
      message: "Micro-internship deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting micro-internship:", error)
    return NextResponse.json({ error: "Failed to delete micro-internship" }, { status: 500 })
  }
}

