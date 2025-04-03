"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Search, User } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface UserOption {
  id: string
  name: string | null
  email: string
  role: string
}

export default function NewConversation() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<UserOption[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserOption[]>([])
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null)
  const [initialMessage, setInitialMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users")
        if (response.ok) {
          const data = await response.json()
          setUsers(data.users)
          setFilteredUsers(data.users)
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(
        (user) =>
          (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchQuery, users])

  const handleUserSelect = (user: UserOption) => {
    setSelectedUser(user)
  }

  const handleStartConversation = async () => {
    if (!selectedUser || !initialMessage.trim()) return

    setSending(true)
    try {
      const response = await fetch(
        `/api/messages  return;
    
    setSending(true);
    try {
      const response = await fetch(\`/api/messages/user/${selectedUser.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ initialMessage }),
        },
      )

      if (response.ok) {
        const data = await response.json()
        router.push(`/messages/${data.conversation.id}`)
      }
    } catch (error) {
      console.error("Error starting conversation:", error)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/messages")} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="font-semibold">New Conversation</h2>
        </div>
        <Skeleton className="h-10 w-full mb-4" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/messages")} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="font-semibold">New Conversation</h2>
      </div>

      {!selectedUser ? (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for a user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-2">
            {filteredUsers.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No users found</p>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{user.name || "Unnamed User"}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="text-xs px-2 py-1 rounded-full bg-muted">
                        {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          <div className="mb-4 p-3 border rounded-lg">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">{selectedUser.name || "Unnamed User"}</p>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)} className="ml-auto">
                Change
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Message</label>
            <Textarea
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder="Type your message..."
              className="min-h-[120px]"
            />
          </div>

          <Button onClick={handleStartConversation} disabled={!initialMessage.trim() || sending} className="w-full">
            Start Conversation
          </Button>
        </>
      )}
    </div>
  )
}

