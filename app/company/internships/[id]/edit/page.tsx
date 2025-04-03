import { notFound } from "next/navigation"
import { query, queryOne } from "@/lib/db"
import InternshipForm from "@/components/internship-form"

interface Internship {
  id: string
  title: string
  description: string
  location: string
  isRemote: boolean
  isHybrid: boolean
  startDate: string
  endDate: string
  deadline: string
  isPaid: boolean
  compensation: string
  status: string
  companyId: string
}

interface Skill {
  id: string
  name: string
  category: string
}

interface InternshipSkill {
  skillId: string
  importance: number
}

// This is a placeholder function - in a real app, you would get the current user from the session
async function getCurrentCompanyId() {
  // For demo purposes, we'll return a hardcoded company ID
  // In a real app, you would get this from the authenticated user session
  return "f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1"
}

async function getInternship(id: string): Promise<Internship | null> {
  return await queryOne<Internship>(
    `
    SELECT *
    FROM "Internship"
    WHERE id = $1
  `,
    [id],
  )
}

async function getSkills(): Promise<Skill[]> {
  return await query<Skill>(`
    SELECT id, name, category
    FROM "Skill"
    ORDER BY category, name
  `)
}

async function getInternshipSkills(internshipId: string): Promise<InternshipSkill[]> {
  return await query<InternshipSkill>(
    `
    SELECT "skillId", importance
    FROM "InternshipSkill"
    WHERE "internshipId" = $1
  `,
    [internshipId],
  )
}

export default async function EditInternshipPage({ params }: { params: { id: string } }) {
  const companyId = await getCurrentCompanyId()
  const internship = await getInternship(params.id)

  if (!internship) {
    notFound()
  }

  // Check if the internship belongs to the current company
  if (internship.companyId !== companyId) {
    notFound()
  }

  const skills = await getSkills()
  const internshipSkills = await getInternshipSkills(internship.id)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Internship</h1>

      <InternshipForm
        companyId={companyId}
        internship={internship}
        skills={skills}
        internshipSkills={internshipSkills}
        mode="edit"
      />
    </div>
  )
}

