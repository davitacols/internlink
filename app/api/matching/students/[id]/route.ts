import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { findMatchingInternshipsForStudent } from "@/lib/matching-algorithm"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const studentId = params.id
    const limit = Number.parseInt(request.nextUrl.searchParams.get("limit") || "10")

    // Check authorization - only the student themselves, their school, or admin can see matches
    if (
      session.user.role !== "ADMIN" &&
      session.user.role !== "SCHOOL" &&
      (session.user.role !== "STUDENT" || session.user.studentId !== studentId)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const matches = await findMatchingInternshipsForStudent(studentId, limit)

    return NextResponse.json({ matches })
  } catch (error) {
    console.error("Error in matching API:", error)
    return NextResponse.json({ error: "Failed to get matches" }, { status: 500 })
  }
}

