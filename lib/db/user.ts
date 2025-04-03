import { hash, compare } from "bcryptjs"
import prisma from "../prisma"
import type { UserRole } from "@prisma/client"

export async function createUser(data: {
  name: string
  email: string
  password: string
  role: UserRole
  profileImage?: string
}) {
  const hashedPassword = await hash(data.password, 10)

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      profileImage: data.profileImage,
    },
  })

  // Create role-specific profile
  if (user.role === "STUDENT") {
    await prisma.student.create({
      data: {
        userId: user.id,
      },
    })
  } else if (user.role === "COMPANY") {
    await prisma.company.create({
      data: {
        userId: user.id,
      },
    })
  } else if (user.role === "SCHOOL") {
    await prisma.school.create({
      data: {
        userId: user.id,
      },
    })
  }

  return user
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      student: true,
      company: true,
      school: true,
    },
  })
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword)
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      student: true,
      company: true,
      school: true,
    },
  })
}

