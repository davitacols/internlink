import type React from "react"
import { SchoolSidebar } from "@/components/school/school-sidebar"
import { Header } from "@/components/dashboard/header"
import { Toaster } from "@/components/ui/toaster"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"

export default async function SchoolDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session || session.user.role !== "SCHOOL") {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header userType="school" />
      <div className="flex flex-1">
        <SchoolSidebar />
        <main className="flex-1 p-6 pt-2">{children}</main>
      </div>
      <Toaster />
    </div>
  )
}

