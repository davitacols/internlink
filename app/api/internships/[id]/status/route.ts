import { type NextRequest, NextResponse } from "next/server"
import { queryOne } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const { status } = data

    // Validate status
    const validStatuses = ["DRAFT", "ACTIVE", "CLOSED"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Update internship status
    await queryOne(
      `
      UPDATE "Internship"
      SET status = $1, "updatedAt" = NOW()
      WHERE id = $2
    `,
      [status, params.id],
    )

    return NextResponse.json({
      success: true,
      message: "Internship status updated successfully",
    })
  } catch (error) {
    console.error("Error updating internship status:", error)
    return NextResponse.json({ error: "An error occurred while updating the internship status" }, { status: 500 })
  }
}

