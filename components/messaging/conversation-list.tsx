"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Conversation } from "@/lib/db/messaging"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Plus } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch("/api/messages")
        if (response.ok) {
          const data = await response.json()
          setConversations(data.conversations)
          setUnreadCount(data.unreadCount)
        }
      } catch (error) {
        console.error("Error fetching conversations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()

    // Poll for new messages every 10 seconds
    const interval = setInterval(fetchConversations, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleNewConversation = () => {
    router.push("/messages/new")
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Messages</h2>
          <Button size="sm" onClick={handleNewConversation}>
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded-lg">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-full mt-2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Messages
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} new
            </Badge>
          )}
        </h2>
        <Button size="sm" onClick={handleNewConversation}>
          <Plus className="h-4 w-4 mr-2" />
          New
        </Button>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-8 border rounded-lg">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">No conversations yet</p>
          <Button className="mt-4" onClick={handleNewConversation}>
            Start a conversation
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {conversations.map((conversation) => {
            // Find other participants (not current user)
            const otherParticipants =
              conversation.participants?.filter((p) => p.user_id !== conversation.participants?.[0].user_id) || []

            // Count unread messages
            const hasUnread =
              conversation.last_message &&
              !conversation.last_message.is_read &&
              conversation.last_message.sender_id !== conversation.participants?.[0].user_id

            return (
              <Link
                key={conversation.id}
                href={`/messages/${conversation.id}`}
                className={`block p-4 border rounded-lg hover:bg-accent transition-colors ${
                  hasUnread ? "bg-accent/50 border-primary/20" : ""
                }`}
              >
                <div className="flex justify-between">
                  <h3 className="font-medium">
                    {otherParticipants.map((p) => p.user?.name || "User").join(", ")}
                    {hasUnread && <span className="ml-2 h-2 w-2 rounded-full bg-primary inline-block"></span>}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {conversation.last_message
                      ? formatDistanceToNow(new Date(conversation.last_message.sent_at), { addSuffix: true })
                      : formatDistanceToNow(new Date(conversation.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate mt-1">
                  {conversation.last_message
                    ? `${conversation.last_message.sender_id === conversation.participants?.[0].user_id ? "You: " : ""}${conversation.last_message.content}`
                    : "No messages yet"}
                </p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

