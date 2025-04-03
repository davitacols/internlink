"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button, type ButtonProps } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface LogoutButtonProps extends ButtonProps {
  showIcon?: boolean
}

export default function LogoutButton({ showIcon = true, children, ...props }: LogoutButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogout() {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        // Refresh the current route and fetch new data from the server
        router.refresh()

        // Redirect to home page
        router.push("/")
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="ghost" onClick={handleLogout} disabled={isLoading} {...props}>
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {children || "Log Out"}
    </Button>
  )
}

