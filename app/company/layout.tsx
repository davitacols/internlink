import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { queryOne } from "@/lib/db"
import { Briefcase, Building, ClipboardList, Home, LogOut, Settings, Users } from "lucide-react"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"

export const metadata: Metadata = {
  title: "Company Dashboard | InternLink",
  description: "Manage your internships and applications on InternLink",
}

interface Company {
  id: string
  userId: string
  name: string
}

// This is a placeholder function - in a real app, you would get the current user from the session
async function getCurrentUser() {
  // For demo purposes, we'll return a hardcoded company ID
  // In a real app, you would get this from the authenticated user session
  return {
    id: "6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u",
    role: "COMPANY",
  }
}

async function getCompany(userId: string): Promise<Company | null> {
  return await queryOne<Company>(
    `
    SELECT c.id, c."userId", u.name
    FROM "Company" c
    JOIN "User" u ON c."userId" = u.id
    WHERE c."userId" = $1
  `,
    [userId],
  )
}

export default async function CompanyDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get current user (in a real app, this would be from the session)
  const user = await getCurrentUser()

  // Check if user is a company
  if (user.role !== "COMPANY") {
    redirect("/")
  }

  const company = await getCompany(user.id)

  if (!company) {
    redirect("/")
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b">
          <div className="flex items-center gap-2 px-2">
            <Building className="h-6 w-6" />
            <div className="font-semibold">{company.name}</div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/company">
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/company/internships">
                  <Briefcase className="h-4 w-4" />
                  <span>Internships</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/company/applications">
                  <ClipboardList className="h-4 w-4" />
                  <span>Applications</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/company/students">
                  <Users className="h-4 w-4" />
                  <span>Browse Students</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/company/settings">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/logout">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger />
          <div className="font-semibold">Company Dashboard</div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

