"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, User, LogIn, Briefcase, GraduationCap, Building2, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import LogoutButton from "@/components/auth/logout-button"
import MessageIndicator from "@/components/messaging/message-indicator"

interface NavbarProps {
  user: {
    id: string
    name: string
    email: string
    role: string
  } | null
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const routes = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Internships",
      path: "/internships",
    },
    {
      name: "Companies",
      path: "/companies",
    },
    {
      name: "Schools",
      path: "/schools",
    },
    {
      name: "About",
      path: "/about",
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6" />
            <span className="font-bold text-xl">InternLink</span>
          </Link>

          <nav className="hidden md:flex gap-6">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === route.path ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {route.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <MessageIndicator />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    {user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "STUDENT" && (
                    <DropdownMenuItem asChild>
                      <Link href="/profile/student" className="flex items-center cursor-pointer">
                        <GraduationCap className="mr-2 h-4 w-4" />
                        Student Profile
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === "COMPANY" && (
                    <DropdownMenuItem asChild>
                      <Link href="/profile/company" className="flex items-center cursor-pointer">
                        <Building2 className="mr-2 h-4 w-4" />
                        Company Profile
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === "SCHOOL" && (
                    <DropdownMenuItem asChild>
                      <Link href="/profile/school" className="flex items-center cursor-pointer">
                        <GraduationCap className="mr-2 h-4 w-4" />
                        School Profile
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center cursor-pointer">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <LogoutButton className="w-full justify-start" />
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden md:flex">
                <Link href="/login" className="flex items-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  Log In
                </Link>
              </Button>
              <Button asChild size="sm" className="hidden md:flex">
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          )}

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between border-b pb-4">
                  <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
                    <Briefcase className="h-6 w-6" />
                    <span className="font-bold text-xl">InternLink</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>

                <nav className="flex flex-col gap-4 py-6">
                  {routes.map((route) => (
                    <Link
                      key={route.path}
                      href={route.path}
                      className={cn(
                        "text-base font-medium transition-colors hover:text-primary",
                        pathname === route.path ? "text-foreground" : "text-muted-foreground",
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {route.name}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto border-t pt-4 flex flex-col gap-2">
                  {user ? (
                    <>
                      <Button asChild variant="outline" className="justify-start">
                        <Link href="/dashboard" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </Button>
                      <LogoutButton className="justify-start" />
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline" className="justify-start">
                        <Link href="/login" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                          <LogIn className="mr-2 h-4 w-4" />
                          Log In
                        </Link>
                      </Button>
                      <Button asChild className="justify-start">
                        <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                          Sign Up
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

