"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import type { Conversation, DirectMessage } from "@/lib/db/messaging"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Send } from "lucide-react"

interface MessageThreadProps {
  conversationId: string
  currentUserId: string
}

export default function MessageThread({ conversationId, currentUserId }: MessageThreadProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<DirectMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const response = await fetch(`/api/messages/conversation/${conversationId}`)
        if (response.ok) {
          const data = await response.json()
          setConversation(data.conversation)
          setMessages(data.messages)
        } else {
          router.push("/messages")
        }
      } catch (error) {
        console.error("Error fetching conversation:", error)
        router.push("/messages")
      } finally {
        setLoading(false)
      }
    }

    fetchConversation()

    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchConversation, 5000)
    return () => clearInterval(interval)
  }, [conversationId, router])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setSending(true)
    try {
      const response = await fetch(`/api/messages/conversation/${conversationId}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newMessage }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessages((prevMessages) => [data.message, ...prevMessages])
        setNewMessage("")
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="border-b p-4">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex-grow p-4 space-y-4 overflow-y-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg ${i % 2 === 0 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48 mt-2" />
                <div className="text-xs mt-1">
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t p-4">
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Conversation not found</p>
      </div>
    )
  }

  // Find other participants (not current user)
  const otherParticipants = conversation.participants?.filter((p) => p.user_id !== currentUserId) || []

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => router.push("/messages")} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="font-semibold">{otherParticipants.map((p) => p.user?.name || "User").join(", ")}</h2>
      </div>

      <div className="flex-grow p-4 space-y-4 overflow-y-auto flex flex-col-reverse">
        <div ref={messagesEndRef} />
        {messages.map((message) => {
          const isCurrentUser = message.sender_id === currentUserId

          return (
            <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                <div className="text-xs mt-1 opacity-70">
                  {formatDistanceToNow(new Date(message.sent_at), { addSuffix: true })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[80px]"
            disabled={sending}
          />
          <Button onClick={handleSendMessage} disabled={!newMessage.trim() || sending} className="self-end">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

