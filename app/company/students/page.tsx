import { query } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, Mail, MapPin, Search, User } from "lucide-react"
import Link from "next/link"
import MessageUserButton from "@/components/message-user-button"

interface Student {
  id: string
  userId: string
  name: string
  email: string
  school: string
  major: string
  graduationYear: number
  bio: string
  location: string
  profileCompletion: number
  skills: {
    skillId: string
    skillName: string
    skillCategory: string
    proficiency: number
  }[]
}

// This is a placeholder function - in a real app, you would get the current user from the session
async function getCurrentCompanyId() {
  // For demo purposes, we'll return a hardcoded company ID
  // In a real app, you would get this from the authenticated user session
  return "f6g7h8i9-j0k1-l2m3-n4o5-p6q7r8s9t0u1"
}

async function getStudents(searchParams: { [key: string]: string | string[] | undefined }): Promise<Student[]> {
  const search = typeof searchParams.search === "string" ? searchParams.search : ""
  const school = typeof searchParams.school === "string" ? searchParams.school : ""
  const major = typeof searchParams.major === "string" ? searchParams.major : ""
  const graduationYear = typeof searchParams.graduationYear === "string" ? searchParams.graduationYear : ""
  const skill = typeof searchParams.skill === "string" ? searchParams.skill : ""

  let sql = `
    SELECT 
      s.id, 
      s."userId",
      u.name,
      u.email,
      s.school,
      s.major,
      s."graduationYear",
      s.bio,
      s.location,
      s."profileCompletion"
    FROM "Student" s
    JOIN "User" u ON s."userId" = u.id
  `

  const whereConditions = []
  const params: any[] = []
  let paramIndex = 1

  if (search) {
    whereConditions.push(`(
      u.name ILIKE $${paramIndex} OR 
      s.school ILIKE $${paramIndex} OR 
      s.major ILIKE $${paramIndex} OR 
      s.bio ILIKE $${paramIndex}
    )`)
    params.push(`%${search}%`)
    paramIndex++
  }

  if (school) {
    whereConditions.push(`s.school ILIKE $${paramIndex}`)
    params.push(`%${school}%`)
    paramIndex++
  }

  if (major) {
    whereConditions.push(`s.major ILIKE $${paramIndex}`)
    params.push(`%${major}%`)
    paramIndex++
  }

  if (graduationYear) {
    whereConditions.push(`s."graduationYear" = $${paramIndex}`)
    params.push(Number.parseInt(graduationYear))
    paramIndex++
  }

  if (skill) {
    sql += `
      JOIN "StudentSkill" ss ON s.id = ss."studentId"
      JOIN "Skill" sk ON ss."skillId" = sk.id
    `
    whereConditions.push(`sk.name ILIKE $${paramIndex}`)
    params.push(`%${skill}%`)
    paramIndex++
  }

  if (whereConditions.length > 0) {
    sql += ` WHERE ${whereConditions.join(" AND ")}`
  }

  sql += ` ORDER BY s."profileCompletion" DESC, u.name`

  const students = await query<Student>(sql, params)

  // Get skills for each student
  for (const student of students) {
    student.skills = await query(
      `
      SELECT 
        ss."skillId",
        s.name as "skillName",
        s.category as "skillCategory",
        ss.proficiency
      FROM "StudentSkill" ss
      JOIN "Skill" s ON ss."skillId" = s.id
      WHERE ss."studentId" = $1
      ORDER BY ss.proficiency DESC, s.name
    `,
      [student.id],
    )
  }

  return students
}

async function getSchools() {
  return await query<{ school: string }>(`
    SELECT DISTINCT school
    FROM "Student"
    WHERE school IS NOT NULL AND school != ''
    ORDER BY school
  `)
}

async function getMajors() {
  return await query<{ major: string }>(`
    SELECT DISTINCT major
    FROM "Student"
    WHERE major IS NOT NULL AND major != ''
    ORDER BY major
  `)
}

async function getGraduationYears() {
  return await query<{ graduationYear: number }>(`
    SELECT DISTINCT "graduationYear"
    FROM "Student"
    WHERE "graduationYear" IS NOT NULL
    ORDER BY "graduationYear"
  `)
}

async function getSkills() {
  return await query<{ id: string; name: string }>(`
    SELECT id, name
    FROM "Skill"
    ORDER BY name
  `)
}

export default async function CompanyStudentsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const students = await getStudents(searchParams)
  const schools = await getSchools()
  const majors = await getMajors()
  const graduationYears = await getGraduationYears()
  const skills = await getSkills()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Browse Students</h1>

      <div className="bg-card border rounded-lg p-4 mb-6">
        <form className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  name="search"
                  placeholder="Search students..."
                  className="pl-8"
                  defaultValue={searchParams.search || ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Select name="school" defaultValue={searchParams.school?.toString() || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="School" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Schools</SelectItem>
                  {schools.map((school) => (
                    <SelectItem key={school.school} value={school.school}>
                      {school.school}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select name="major" defaultValue={searchParams.major?.toString() || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Major" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Majors</SelectItem>
                  {majors.map((major) => (
                    <SelectItem key={major.major} value={major.major}>
                      {major.major}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select name="graduationYear" defaultValue={searchParams.graduationYear?.toString() || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Graduation Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {graduationYears.map((year) => (
                    <SelectItem key={year.graduationYear} value={year.graduationYear.toString()}>
                      {year.graduationYear}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select name="skill" defaultValue={searchParams.skill?.toString() || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  {skills.map((skill) => (
                    <SelectItem key={skill.id} value={skill.name}>
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit">Filter</Button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {students.map((student) => (
          <Card key={student.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`}
                      alt={student.name}
                    />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="text-xl font-semibold">{student.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <GraduationCap className="h-4 w-4 mr-1" />
                      <span>
                        {student.major}, {student.graduationYear}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{student.school}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-grow space-y-3">
                  <div className="line-clamp-2 text-sm text-muted-foreground">{student.bio || "No bio provided."}</div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {student.skills.slice(0, 5).map((skill) => (
                        <Badge key={skill.skillId} variant="outline" className="text-xs">
                          {skill.skillName}
                          {skill.proficiency > 3 && " ★"}
                        </Badge>
                      ))}
                      {student.skills.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{student.skills.length - 5} more
                        </Badge>
                      )}
                      {student.skills.length === 0 && (
                        <span className="text-xs text-muted-foreground">No skills listed</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button asChild>
                    <Link href={`/students/${student.id}`}>
                      <User className="mr-2 h-4 w-4" />
                      View Profile
                    </Link>
                  </Button>

                  <Button asChild variant="outline">
                    <a href={`mailto:${student.email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Contact
                    </a>
                  </Button>
                  <div className="flex gap-2 mt-2">
                    <MessageUserButton userId={student.userId} size="sm" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {students.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Students Found</h3>
              <p className="text-muted-foreground mb-4">
                No students match your search criteria. Try adjusting your filters.
              </p>
              <Button asChild>
                <Link href="/company/students">Clear Filters</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

