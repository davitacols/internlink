"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, BookOpen, Calendar, MessageSquare, Settings, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"

export function SchoolSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const routes = [
    {
      label: "Dashboard",
      icon: BarChart3,
      href: "/dashboard/school",
      active: pathname === "/dashboard/school",
    },
    {
      label: "Students",
      icon: Users,
      href: "/dashboard/school/students",
      active: pathname === "/dashboard/school/students",
    },
    {
      label: "Programs",
      icon: BookOpen,
      href: "/dashboard/school/programs",
      active: pathname === "/dashboard/school/programs",
    },
    {
      label: "Messages",
      icon: MessageSquare,
      href: "/dashboard/school/messages",
      active: pathname === "/dashboard/school/messages",
    },
    {
      label: "Events",
      icon: Calendar,
      href: "/dashboard/school/events",
      active: pathname === "/dashboard/school/events",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/school/settings",
      active: pathname === "/dashboard/school/settings",
    },
  ]

  return (
    <aside className="hidden w-64 border-r bg-muted/40 lg:block">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="flex items-center gap-2 px-2 py-4">
          <Avatar>
            <AvatarImage src={user?.profileImage || "/placeholder.svg?height=40&width=40"} alt="School" />
            <AvatarFallback>{user?.name?.substring(0, 2) || "SU"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user?.name || "State University"}</div>
            <div className="text-xs text-muted-foreground">Higher Education</div>
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

