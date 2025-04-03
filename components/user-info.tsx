"use client"

import { useState, useEffect } from "react"

interface UserInfoProps {
  initialUser: {
    id: string
    email: string
    name: string | null
    role: string
    createdAt: Date
    updatedAt: Date
  } | null
}

export default function UserInfo({ initialUser }: UserInfoProps) {
  const [user, setUser] = useState(initialUser)

  useEffect(() => {
    // You can perform client-side logic here if needed
    // For example, you might want to fetch additional user data
    // or update the user state based on client-side events
  }, [])

  if (!user) {
    return <p>Not logged in</p>
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  )
}

