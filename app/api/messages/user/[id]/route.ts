import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { startConversationWithUser } from "@/lib/db/messaging"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const otherUserId = params.id
    const { initialMessage } = await request.json()

    const conversation = await startConversationWithUser(user.id, otherUserId, initialMessage)

    if (!conversation) {
      return NextResponse.json({ error: "Failed to start conversation" }, { status: 500 })
    }

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error("Error starting conversation:", error)
    return NextResponse.json({ error: "Failed to start conversation" }, { status: 500 })
  }
}

