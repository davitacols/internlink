import { compare, hash } from "bcryptjs"
import { sign, verify } from "jsonwebtoken"
import { cookies } from "next/headers"
import { User, UserRole } from "@prisma/client"
import prisma from "./prisma"

type AuthUser = Omit<User, "password">

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const COOKIE_NAME = "internlink_auth"

export interface AuthResult {
  success: boolean
  message: string
  user?: Omit<User, "password">
  userId?: string
}

export async function createUser(email: string, password: string, name: string, role: UserRole): Promise<AuthResult> {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { success: false, message: "User already exists" };
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user using Prisma with automatic ID generation
    const result = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      }
    });

    if (!result?.id) {
      console.error("User creation failed: No ID returned");
      return { success: false, message: "Failed to create user" };
    }

    console.log("User created successfully:", { 
      userId: result.id,
      email: result.email,
      role: result.role
    });

    return {
      success: true,
      message: "User registered successfully",
      userId: result.id
    };

  } catch (error) {
    console.error("User registration error:", {
      error: error instanceof Error ? error.message : error,
      email,
      role
    });
    return { success: false, message: "Registration failed" };
  }
}

export async function createSession(userId: string): Promise<AuthResult> {
  try {
    // Find user
    const user = await queryOne<UserWithPassword>(
      'SELECT id, email, password, name, role, "createdAt", "updatedAt" FROM "User" WHERE id = $1',
      [userId]
    )

    if (!user) {
      return { success: false, message: "Invalid credentials" }
    }

    // Create JWT token
    const token = sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" })

    // Set cookie
    cookies().set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Return success
    return {
      success: true,
      message: "Session created successfully",
    }
  } catch (error) {
    console.error("Session creation error:", error)
    return { success: false, message: "Session creation failed" }
  }
}

export async function loginUser(email: string, password: string): Promise<AuthResult> {
  try {
    // Find user with password
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return { success: false, message: "Invalid credentials" }
    }

    // Verify password
    const passwordMatch = await compare(password, user.password)
    if (!passwordMatch) {
      return { success: false, message: "Invalid credentials" }
    }

    // Create JWT token
    const token = sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" })

    // Set cookie
    cookies().set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return {
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "Login failed" }
  }
}

export async function logoutUser() {
  cookies().delete(COOKIE_NAME)
  return { success: true, message: "Logout successful" }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = (await cookies().get(COOKIE_NAME))?.value
    if (!token) return null

    try {
      const decoded = verify(token, JWT_SECRET) as { id: string }
      const user = await queryOne<User>(
        'SELECT id, email, name, role, "createdAt", "updatedAt" FROM "User" WHERE id = $1',
        [decoded.id]
      )
      return user
    } catch (error) {
      return null
    }
  } catch (error) {
    return null
  }
}

export async function getUserProfile(userId: string, role: UserRole) {
  try {
    let profileData = null

    if (role === "STUDENT") {
      profileData = await queryOne('SELECT * FROM "Student" WHERE "userId" = $1', [userId])
    } else if (role === "COMPANY") {
      profileData = await queryOne('SELECT * FROM "Company" WHERE "userId" = $1', [userId])
    } else if (role === "SCHOOL") {
      profileData = await queryOne('SELECT * FROM "School" WHERE "userId" = $1', [userId])
    }

    return profileData
  } catch (error) {
    console.error("Get profile error:", error)
    return null
  }
}

