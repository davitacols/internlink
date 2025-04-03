import { neon } from "@/lib/db"

// Types for our matching algorithm
export type SkillMatch = {
  skillId: string
  skillName: string
  studentProficiency: number
  requiredProficiency: number
  match: number // 0-1 score representing how well the skill matches
}

export type InternshipMatch = {
  internshipId: string
  internshipTitle: string
  companyId: string
  companyName: string
  location: string
  matchScore: number // 0-1 score representing overall match
  skillMatches: SkillMatch[]
  culturalFitScore: number // 0-1 score for cultural fit
  locationScore: number // 0-1 score for location preference match
  compensationScore: number // 0-1 score for compensation match
}

export type StudentMatch = {
  studentId: string
  studentName: string
  matchScore: number // 0-1 score representing overall match
  skillMatches: SkillMatch[]
  educationScore: number // 0-1 score for education match
  experienceScore: number // 0-1 score for experience match
}

// Weights for different matching factors
const WEIGHTS = {
  skills: 0.6,
  culturalFit: 0.15,
  location: 0.15,
  compensation: 0.1,
  education: 0.2,
  experience: 0.2,
}

/**
 * Find matching internships for a student
 */
export async function findMatchingInternshipsForStudent(studentId: string, limit = 10): Promise<InternshipMatch[]> {
  const sql = neon(process.env.DATABASE_URL!)

  // Get student skills
  const studentSkills = await sql`
    SELECT ss.skill_id, s.name as skill_name, ss.proficiency
    FROM student_skills ss
    JOIN skills s ON ss.skill_id = s.id
    WHERE ss.student_id = ${studentId}
  `

  // Get student preferences
  const studentPrefs = await sql`
    SELECT location_preference, remote_preference, compensation_preference
    FROM students
    WHERE id = ${studentId}
  `

  const locationPref = studentPrefs[0]?.location_preference || ""
  const remotePref = studentPrefs[0]?.remote_preference || false
  const compensationPref = studentPrefs[0]?.compensation_preference || 0

  // Get all active internships with their required skills
  const internships = await sql`
    SELECT 
      i.id, i.title, i.location, i.is_remote, i.compensation, 
      i.company_id, c.name as company_name,
      c.culture_values
    FROM internships i
    JOIN companies c ON i.company_id = c.id
    WHERE i.status = 'ACTIVE'
  `

  // Get required skills for all internships
  const internshipSkills = await sql`
    SELECT is.internship_id, is.skill_id, s.name as skill_name, is.proficiency
    FROM internship_skills is
    JOIN skills s ON is.skill_id = s.id
  `

  // Group skills by internship
  const skillsByInternship = internshipSkills.reduce((acc: any, skill: any) => {
    if (!acc[skill.internship_id]) {
      acc[skill.internship_id] = []
    }
    acc[skill.internship_id].push(skill)
    return acc
  }, {})

  // Calculate match scores for each internship
  const matches: InternshipMatch[] = internships.map((internship: any) => {
    // Calculate skill match
    const requiredSkills = skillsByInternship[internship.id] || []
    const skillMatches: SkillMatch[] = []

    let totalSkillScore = 0
    let maxPossibleSkillScore = requiredSkills.length * 1 // Max score is 1 per skill

    // If no skills required, avoid division by zero
    if (maxPossibleSkillScore === 0) maxPossibleSkillScore = 1

    requiredSkills.forEach((requiredSkill: any) => {
      const studentSkill = studentSkills.find((s: any) => s.skill_id === requiredSkill.skill_id)

      let match = 0
      if (studentSkill) {
        // Calculate how well the student's proficiency matches the required proficiency
        match = Math.min(studentSkill.proficiency / requiredSkill.proficiency, 1)
      }

      totalSkillScore += match

      skillMatches.push({
        skillId: requiredSkill.skill_id,
        skillName: requiredSkill.skill_name,
        studentProficiency: studentSkill?.proficiency || 0,
        requiredProficiency: requiredSkill.proficiency,
        match,
      })
    })

    const skillScore = totalSkillScore / maxPossibleSkillScore

    // Calculate location match
    let locationScore = 0
    if (remotePref && internship.is_remote) {
      locationScore = 1
    } else if (locationPref && internship.location.includes(locationPref)) {
      locationScore = 1
    } else if (!locationPref) {
      locationScore = 0.5 // Neutral if no preference
    }

    // Calculate compensation match
    let compensationScore = 0
    if (compensationPref === 0 || internship.compensation >= compensationPref) {
      compensationScore = 1
    } else {
      compensationScore = internship.compensation / compensationPref
    }

    // Calculate cultural fit (simplified version)
    // In a real implementation, this would use more sophisticated analysis
    const culturalFitScore = 0.7 // Placeholder

    // Calculate overall match score using weighted factors
    const matchScore =
      skillScore * WEIGHTS.skills +
      culturalFitScore * WEIGHTS.culturalFit +
      locationScore * WEIGHTS.location +
      compensationScore * WEIGHTS.compensation

    return {
      internshipId: internship.id,
      internshipTitle: internship.title,
      companyId: internship.company_id,
      companyName: internship.company_name,
      location: internship.location,
      matchScore,
      skillMatches,
      culturalFitScore,
      locationScore,
      compensationScore,
    }
  })

  // Sort by match score and return top matches
  return matches.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit)
}

/**
 * Find matching students for an internship
 */
export async function findMatchingStudentsForInternship(internshipId: string, limit = 10): Promise<StudentMatch[]> {
  const sql = neon(process.env.DATABASE_URL!)

  // Get internship details and required skills
  const internship = await sql`
    SELECT i.id, i.title, i.location, i.is_remote, i.compensation, i.required_education, i.required_experience
    FROM internships i
    WHERE i.id = ${internshipId}
  `

  if (internship.length === 0) {
    return []
  }

  const requiredEducation = internship[0].required_education || ""
  const requiredExperience = internship[0].required_experience || 0

  // Get required skills for the internship
  const requiredSkills = await sql`
    SELECT is.skill_id, s.name as skill_name, is.proficiency
    FROM internship_skills is
    JOIN skills s ON is.skill_id = s.id
    WHERE is.internship_id = ${internshipId}
  `

  // Get all students with their skills
  const students = await sql`
    SELECT s.id, s.name, s.education, s.experience_years
    FROM students s
    JOIN users u ON s.user_id = u.id
    WHERE u.status = 'ACTIVE'
  `

  // Get all student skills
  const studentSkills = await sql`
    SELECT ss.student_id, ss.skill_id, s.name as skill_name, ss.proficiency
    FROM student_skills ss
    JOIN skills s ON ss.skill_id = s.id
  `

  // Group skills by student
  const skillsByStudent = studentSkills.reduce((acc: any, skill: any) => {
    if (!acc[skill.student_id]) {
      acc[skill.student_id] = []
    }
    acc[skill.student_id].push(skill)
    return acc
  }, {})

  // Calculate match scores for each student
  const matches: StudentMatch[] = students.map((student: any) => {
    // Calculate skill match
    const studentSkillsList = skillsByStudent[student.id] || []
    const skillMatches: SkillMatch[] = []

    let totalSkillScore = 0
    let maxPossibleSkillScore = requiredSkills.length * 1 // Max score is 1 per skill

    // If no skills required, avoid division by zero
    if (maxPossibleSkillScore === 0) maxPossibleSkillScore = 1

    requiredSkills.forEach((requiredSkill: any) => {
      const studentSkill = studentSkillsList.find((s: any) => s.skill_id === requiredSkill.skill_id)

      let match = 0
      if (studentSkill) {
        // Calculate how well the student's proficiency matches the required proficiency
        match = Math.min(studentSkill.proficiency / requiredSkill.proficiency, 1)
      }

      totalSkillScore += match

      skillMatches.push({
        skillId: requiredSkill.skill_id,
        skillName: requiredSkill.skill_name,
        studentProficiency: studentSkill?.proficiency || 0,
        requiredProficiency: requiredSkill.proficiency,
        match,
      })
    })

    const skillScore = totalSkillScore / maxPossibleSkillScore

    // Calculate education match
    let educationScore = 0
    if (!requiredEducation || student.education.includes(requiredEducation)) {
      educationScore = 1
    } else {
      // Simple education level matching
      const educationLevels = ["High School", "Associate", "Bachelor", "Master", "PhD"]
      const requiredLevel = educationLevels.findIndex((level) => requiredEducation.includes(level))
      const studentLevel = educationLevels.findIndex((level) => student.education.includes(level))

      if (studentLevel >= requiredLevel && requiredLevel !== -1) {
        educationScore = 1
      } else if (requiredLevel !== -1 && studentLevel !== -1) {
        educationScore = studentLevel / requiredLevel
      }
    }

    // Calculate experience match
    let experienceScore = 0
    if (requiredExperience === 0 || student.experience_years >= requiredExperience) {
      experienceScore = 1
    } else if (student.experience_years > 0) {
      experienceScore = student.experience_years / requiredExperience
    }

    // Calculate overall match score using weighted factors
    const matchScore =
      skillScore * WEIGHTS.skills + educationScore * WEIGHTS.education + experienceScore * WEIGHTS.experience

    return {
      studentId: student.id,
      studentName: student.name,
      matchScore,
      skillMatches,
      educationScore,
      experienceScore,
    }
  })

  // Sort by match score and return top matches
  return matches.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit)
}

