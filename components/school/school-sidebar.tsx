"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, BookOpen, Building2, GraduationCap, Home, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const schoolNavItems = [
  {
    title: "Dashboard",
    href: "/school",
    icon: Home,
  },
  {
    title: "Students",
    href: "/school/students",
    icon: GraduationCap,
  },
  {
    title: "Companies",
    href: "/school/companies",
    icon: Building2,
  },
  {
    title: "Programs",
    href: "/school/programs",
    icon: BookOpen,
  },
  {
    title: "Analytics",
    href: "/school/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/school/settings",
    icon: Settings,
  },
]

export function SchoolSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            {schoolNavItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 font-normal",
                    pathname === item.href && "bg-gray-200 font-medium dark:bg-gray-700",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

