import type React from "react"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      {children}
    </div>
  )
}

