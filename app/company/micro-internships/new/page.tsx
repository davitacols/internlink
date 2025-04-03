import { query } from "@/lib/db"
import MicroInternshipForm from "@/components/micro-internships/micro-internship-form"

interface Skill {
  id: string
  name: string
  category: string
}

// This is a placeholder function - in a real app, you would get the current user from the session
async function getCurrentCompanyId() {
  // For demo purposes, we'll return a hardcoded company ID
  // In a real app, you would get this from the authenticated user session
  return "f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1"
}

async function getSkills(): Promise<Skill[]> {
  return await query<Skill>(`
    SELECT id, name, category
    FROM "Skill"
    ORDER BY category, name
  `)
}

export default async function NewMicroInternshipPage() {
  const companyId = await getCurrentCompanyId()
  const skills = await getSkills()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Create New Micro-Internship</h1>
      <p className="text-muted-foreground mb-6">Post a short-term, flexible opportunity for students</p>

      <MicroInternshipForm companyId={companyId} skills={skills} mode="create" />
    </div>
  )
}

