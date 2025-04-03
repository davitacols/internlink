import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getUserConversations, getUnreadMessageCount } from "@/lib/db/messaging"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const conversations = await getUserConversations(user.id)
    const unreadCount = await getUnreadMessageCount(user.id)

    return NextResponse.json({ conversations, unreadCount })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

