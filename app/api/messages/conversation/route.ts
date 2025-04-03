import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { createConversation } from "@/lib/db/messaging"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, participantIds } = await request.json()

    if (!title || !participantIds || !Array.isArray(participantIds) || participantIds.length < 2) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
    }

    // Ensure current user is included in participants
    if (!participantIds.includes(user.id)) {
      participantIds.push(user.id)
    }

    const conversation = await createConversation(title, participantIds)

    if (!conversation) {
      return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
    }

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error("Error creating conversation:", error)
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
  }
}

