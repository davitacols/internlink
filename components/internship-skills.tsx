import { Badge } from "@/components/ui/badge"

interface Skill {
  id: string
  name: string
  category: string
  importance: number
}

interface InternshipSkillsProps {
  skills: Skill[]
}

export default function InternshipSkills({ skills }: InternshipSkillsProps) {
  // Group skills by category
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, Skill[]>,
  )

  return (
    <div className="space-y-4">
      {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
        <div key={category}>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">{category}</h4>
          <div className="flex flex-wrap gap-2">
            {categorySkills.map((skill) => (
              <Badge key={skill.id} variant={skill.importance >= 4 ? "default" : "outline"}>
                {skill.name}
                {skill.importance === 5 && " (Required)"}
              </Badge>
            ))}
          </div>
        </div>
      ))}

      {skills.length === 0 && <p className="text-muted-foreground">No specific skills required for this internship.</p>}
    </div>
  )
}

