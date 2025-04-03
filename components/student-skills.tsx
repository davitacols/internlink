import { sql } from "@/lib/db-utils"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
}

export default async function StudentSkills({ studentId }: { studentId: string }) {
  // Fetch skills for this student
  const skills = await sql`
    SELECT 
      s.id,
      s.name,
      s.category,
      ss.proficiency
    FROM "Skill" s
    JOIN "StudentSkill" ss ON s.id = ss."skillId"
    WHERE ss."studentId" = ${studentId}
    ORDER BY ss.proficiency DESC, s.name ASC
  `

  if (skills.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground mb-4">No skills added to your profile yet.</p>
        <Badge variant="outline">Add Skills</Badge>
      </div>
    )
  }

  // Group skills by category
  const skillsByCategory: Record<string, Skill[]> = {}

  skills.forEach((skill: Skill) => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = []
    }
    skillsByCategory[skill.category].push(skill)
  })

  return (
    <div className="space-y-6">
      {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
        <div key={category}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">{category}</h3>
          <div className="space-y-4">
            {categorySkills.map((skill) => (
              <div key={skill.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{skill.name}</span>
                  <span>{getProficiencyLabel(skill.proficiency)}</span>
                </div>
                <Progress value={skill.proficiency} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function getProficiencyLabel(proficiency: number): string {
  if (proficiency >= 80) return "Expert"
  if (proficiency >= 60) return "Advanced"
  if (proficiency >= 40) return "Intermediate"
  return "Beginner"
}

