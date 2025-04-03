"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin")
    } else if (user) {
      // Redirect to the appropriate dashboard if on the wrong one
      if (pathname.includes("/dashboard/student") && user.role !== "student") {
        router.push(`/dashboard/${user.role}`)
      } else if (pathname.includes("/dashboard/company") && user.role !== "company") {
        router.push(`/dashboard/${user.role}`)
      } else if (pathname.includes("/dashboard/school") && user.role !== "school") {
        router.push(`/dashboard/${user.role}`)
      }
    }
  }, [isLoading, user, router, pathname])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <>
      {children}
      <Toaster />
    </>
  )
}

