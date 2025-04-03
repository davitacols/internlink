"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, BookOpen, Briefcase, Calendar, MessageSquare, Settings, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"

export function StudentSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const routes = [
    {
      label: "Dashboard",
      icon: BarChart3,
      href: "/dashboard/student",
      active: pathname === "/dashboard/student",
    },
    {
      label: "Internships",
      icon: Briefcase,
      href: "/dashboard/student/internships",
      active: pathname === "/dashboard/student/internships",
    },
    {
      label: "Learning",
      icon: BookOpen,
      href: "/dashboard/student/learning",
      active: pathname === "/dashboard/student/learning",
    },
    {
      label: "Messages",
      icon: MessageSquare,
      href: "/dashboard/student/messages",
      active: pathname === "/dashboard/student/messages",
    },
    {
      label: "Applications",
      icon: Calendar,
      href: "/dashboard/student/applications",
      active: pathname === "/dashboard/student/applications",
    },
    {
      label: "Profile",
      icon: User,
      href: "/dashboard/student/profile",
      active: pathname === "/dashboard/student/profile",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/dashboard/student/settings",
      active: pathname === "/dashboard/student/settings",
    },
  ]

  return (
    <aside className="hidden w-64 border-r bg-muted/40 lg:block">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="flex items-center gap-2 px-2 py-4">
          <Avatar>
            <AvatarImage src={user?.profileImage || "/placeholder.svg?height=40&width=40"} alt="User" />
            <AvatarFallback>{user?.name?.substring(0, 2) || "JD"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user?.name || "Jane Doe"}</div>
            <div className="text-xs text-muted-foreground">Computer Science Student</div>
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

