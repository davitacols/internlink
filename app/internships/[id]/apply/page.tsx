import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { queryOne } from "@/lib/db"
import ApplicationForm from "@/components/application-form"

export const metadata: Metadata = {
  title: "Apply for Internship | InternLink",
  description: "Apply for an internship on InternLink",
}

interface Internship {
  id: string
  title: string
  companyId: string
  companyName: string
  deadline: string
}

async function getInternship(id: string): Promise<Internship | null> {
  return await queryOne<Internship>(
    `
    SELECT i.id, i.title, i."companyId", u.name as "companyName", i.deadline
    FROM "Internship" i
    JOIN "Company" c ON i."companyId" = c.id
    JOIN "User" u ON c."userId" = u.id
    WHERE i.id = $1 AND i.status = 'ACTIVE'
  `,
    [id],
  )
}

// This is a placeholder function - in a real app, you would get the current user from the session
async function getCurrentUser() {
  // For demo purposes, we'll return a hardcoded student ID
  // In a real app, you would get this from the authenticated user session
  return {
    id: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6", // This should match a student ID in your database
    role: "STUDENT",
  }
}

export default async function ApplyPage({ params }: { params: { id: string } }) {
  const internship = await getInternship(params.id)

  if (!internship) {
    notFound()
  }

  // Check if deadline has passed
  const deadline = new Date(internship.deadline)
  const now = new Date()

  if (deadline < now) {
    redirect(`/internships/${params.id}?error=deadline-passed`)
  }

  // Get current user (in a real app, this would be from the session)
  const user = await getCurrentUser()

  // Check if user is a student
  if (user.role !== "STUDENT") {
    redirect(`/internships/${params.id}?error=not-student`)
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Apply for Internship</h1>

      <ApplicationForm
        internshipId={internship.id}
        internshipTitle={internship.title}
        companyName={internship.companyName}
        studentId={user.id}
      />
    </div>
  )
}

