"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { getUserByEmail, verifyPassword } from "@/lib/db/user"

type UserRole = "STUDENT" | "COMPANY" | "SCHOOL" | null

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  profileImage?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (userData: any, role: UserRole) => Promise<void>
  signOut: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (typeof window !== "undefined") {
          const storedUser = localStorage.getItem("internlink_user")
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Get user from database
      const dbUser = await getUserByEmail(email)

      if (!dbUser) {
        throw new Error("User not found")
      }

      // Verify password
      const isValid = await verifyPassword(password, dbUser.password)

      if (!isValid) {
        throw new Error("Invalid password")
      }

      // Create user object for frontend
      const userObj: User = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role as UserRole,
        profileImage: dbUser.profileImage || undefined,
      }

      // Store user in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("internlink_user", JSON.stringify(userObj))
      }

      setUser(userObj)

      toast({
        title: "Signed in successfully",
        description: `Welcome back, ${userObj.name}!`,
      })

      // Redirect based on role
      if (userObj.role === "STUDENT") {
        router.push("/dashboard/student")
      } else if (userObj.role === "COMPANY") {
        router.push("/dashboard/company")
      } else if (userObj.role === "SCHOOL") {
        router.push("/dashboard/school")
      }
    } catch (error) {
      console.error("Sign in failed:", error)
      toast({
        title: "Sign in failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (userData: any, role: UserRole) => {
    // This would be implemented with an API route in a real application
    // For now, we'll just show a success message
    toast({
      title: "Account created successfully",
      description: "You can now sign in with your credentials.",
    })

    router.push("/signin")
  }

  const signOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("internlink_user")
    }
    setUser(null)
    toast({
      title: "Signed out successfully",
    })
    router.push("/")
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      if (typeof window !== "undefined") {
        localStorage.setItem("internlink_user", JSON.stringify(updatedUser))
      }
      toast({
        title: "Profile updated successfully",
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

