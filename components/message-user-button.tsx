"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

interface MessageUserButtonProps {
  userId: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

export default function MessageUserButton({ userId, variant = "default", size = "default" }: MessageUserButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleClick = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/messages/user/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/messages/${data.conversation.id}`)
      }
    } catch (error) {
      console.error("Error starting conversation:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading} variant={variant} size={size}>
      <MessageSquare className="h-4 w-4 mr-2" />
      Message
    </Button>
  )
}

