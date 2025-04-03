"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Building, Calendar, MessageSquare, Settings, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"

export function CompanySidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const routes = [
    {
      label: "Dashboard",
      icon: BarChart3,
      href: "/dashboard/company",
      active: pathname === "/dashboard/company",
    },
    {
      label: "Internships",
      icon: Building,
      href: "/dashboard/company/internships",
      active: pathname === "/dashboard/company/internships",
    },
    {
      label: "Candidates",
      icon: Users,
      href: "/dashboard/company/candidates",
      active: pathname === "/dashboard/company/candidates",
    },
    {
      label: "Messages",
      icon: MessageSquare,
      href: "/dashboard/company/messages",
      active: pathname === "/dashboard/company/messages",
    },
    {
      label: "Schedule",
      icon: Calendar,
      href: "/dashboard/company/schedule",
      active: pathname === "/dashboard/company/schedule",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/company/settings",
      active: pathname === "/dashboard/company/settings",
    },
  ]

  return (
    <aside className="hidden w-64 border-r bg-muted/40 lg:block">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="flex items-center gap-2 px-2 py-4">
          <Avatar>
            <AvatarImage src={user?.profileImage || "/placeholder.svg?height=40&width=40"} alt="Company" />
            <AvatarFallback>{user?.name?.substring(0, 2) || "TC"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user?.name || "TechCorp"}</div>
            <div className="text-xs text-muted-foreground">Software & Technology</div>
          </div>
        </div>
        <nav className="grid gap-1 px-2">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={route.active ? "secondary" : "ghost"}
              className={cn("justify-start gap-2", route.active && "bg-secondary")}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  )
}

