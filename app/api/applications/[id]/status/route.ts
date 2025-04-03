import { type NextRequest, NextResponse } from "next/server"
import { queryOne } from "@/lib/db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData()
    const status = formData.get("status") as string

    // Validate status
    const validStatuses = ["APPLIED", "REVIEWING", "ACCEPTED", "REJECTED"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Update application status
    await queryOne(
      `
      UPDATE "Application"
      SET status = $1, "updatedAt" = NOW()
      WHERE id = $2
    `,
      [status, params.id],
    )

    // Redirect back to the referring page
    const referer = request.headers.get("referer") || "/company/applications"
    return NextResponse.redirect(referer)
  } catch (error) {
    console.error("Error updating application status:", error)
    return NextResponse.json({ error: "An error occurred while updating the application status" }, { status: 500 })
  }
}

