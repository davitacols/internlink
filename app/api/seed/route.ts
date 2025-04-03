import { NextResponse } from "next/server"
import { sql } from "@/lib/db-utils"
import { hash } from "bcryptjs"

export async function POST() {
  try {
    // Create skills
    const skills = [
      { name: "JavaScript", category: "Programming" },
      { name: "React", category: "Frontend" },
      { name: "Node.js", category: "Backend" },
      { name: "Python", category: "Programming" },
      { name: "UI/UX Design", category: "Design" },
      { name: "Figma", category: "Design Tools" },
      { name: "Data Analysis", category: "Data Science" },
      { name: "Marketing", category: "Business" },
      { name: "Project Management", category: "Business" },
      { name: "Communication", category: "Soft Skills" },
    ]

    const now = new Date().toISOString()

    // Insert skills
    for (const skill of skills) {
      const skillId = crypto.randomUUID()
      await sql`
        INSERT INTO "Skill" (id, name, category, "createdAt", "updatedAt")
        VALUES (${skillId}, ${skill.name}, ${skill.category}, ${now}, ${now})
        ON CONFLICT (name) DO NOTHING
      `
    }

    // Create demo users
    // Student
    const studentPassword = await hash("password123", 10)
    const studentId = crypto.randomUUID()

    await sql`
      INSERT INTO "User" (id, name, email, password, role, "profileImage", "createdAt", "updatedAt")
      VALUES (
        ${studentId}, 
        'Jane Doe', 
        'student@example.com', 
        ${studentPassword}, 
        'STUDENT', 
        '/placeholder.svg?height=40&width=40', 
        ${now}, 
        ${now}
      )
      ON CONFLICT (email) DO NOTHING
    `

    // Get the student user to check if it was inserted
    const studentUser = await sql`SELECT * FROM "User" WHERE email = 'student@example.com'`

    if (studentUser.length > 0) {
      // Create student profile
      const studentProfileId = crypto.randomUUID()
      await sql`
        INSERT INTO "Student" (
          id, 
          "userId", 
          school, 
          major, 
          "graduationYear", 
          bio, 
          "profileCompletion", 
          "createdAt", 
          "updatedAt"
        )
        VALUES (
          ${studentProfileId}, 
          ${studentUser[0].id}, 
          'Stanford University', 
          'Computer Science', 
          2025, 
          'Passionate about technology and design.', 
          85, 
          ${now}, 
          ${now}
        )
        ON CONFLICT ("userId") DO NOTHING
      `

      // Get student profile
      const studentProfile = await sql`SELECT * FROM "Student" WHERE "userId" = ${studentUser[0].id}`

      if (studentProfile.length > 0) {
        // Add skills to student
        const jsSkill = await sql`SELECT * FROM "Skill" WHERE name = 'JavaScript'`
        const reactSkill = await sql`SELECT * FROM "Skill" WHERE name = 'React'`
        const uxSkill = await sql`SELECT * FROM "Skill" WHERE name = 'UI/UX Design'`
        const pmSkill = await sql`SELECT * FROM "Skill" WHERE name = 'Project Management'`

        if (jsSkill.length > 0) {
          const skillLinkId = crypto.randomUUID()
          await sql`
            INSERT INTO "StudentSkill" (id, "studentId", "skillId", proficiency, "createdAt", "updatedAt")
            VALUES (${skillLinkId}, ${studentProfile[0].id}, ${jsSkill[0].id}, 75, ${now}, ${now})
            ON CONFLICT ("studentId", "skillId") DO NOTHING
          `
        }

        if (reactSkill.length > 0) {
          const skillLinkId = crypto.randomUUID()
          await sql`
            INSERT INTO "StudentSkill" (id, "studentId", "skillId", proficiency, "createdAt", "updatedAt")
            VALUES (${skillLinkId}, ${studentProfile[0].id}, ${reactSkill[0].id}, 60, ${now}, ${now})
            ON CONFLICT ("studentId", "skillId") DO NOTHING
          `
        }

        if (uxSkill.length > 0) {
          const skillLinkId = crypto.randomUUID()
          await sql`
            INSERT INTO "StudentSkill" (id, "studentId", "skillId", proficiency, "createdAt", "updatedAt")
            VALUES (${skillLinkId}, ${studentProfile[0].id}, ${uxSkill[0].id}, 80, ${now}, ${now})
            ON CONFLICT ("studentId", "skillId") DO NOTHING
          `
        }

        if (pmSkill.length > 0) {
          const skillLinkId = crypto.randomUUID()
          await sql`
            INSERT INTO "StudentSkill" (id, "studentId", "skillId", proficiency, "createdAt", "updatedAt")
            VALUES (${skillLinkId}, ${studentProfile[0].id}, ${pmSkill[0].id}, 45, ${now}, ${now})
            ON CONFLICT ("studentId", "skillId") DO NOTHING
          `
        }
      }
    }

    // Company
    const companyPassword = await hash("password123", 10)
    const companyId = crypto.randomUUID()

    await sql`
      INSERT INTO "User" (id, name, email, password, role, "profileImage", "createdAt", "updatedAt")
      VALUES (
        ${companyId}, 
        'TechCorp', 
        'company@example.com', 
        ${companyPassword}, 
        'COMPANY', 
        '/placeholder.svg?height=40&width=40', 
        ${now}, 
        ${now}
      )
      ON CONFLICT (email) DO NOTHING
    `

    // Get the company user to check if it was inserted
    const companyUser = await sql`SELECT * FROM "User" WHERE email = 'company@example.com'`

    if (companyUser.length > 0) {
      // Create company profile
      const companyProfileId = crypto.randomUUID()
      await sql`
        INSERT INTO "Company" (
          id, 
          "userId", 
          industry, 
          size, 
          location, 
          website, 
          description, 
          "createdAt", 
          "updatedAt"
        )
        VALUES (
          ${companyProfileId}, 
          ${companyUser[0].id}, 
          'Technology', 
          '51-200', 
          'San Francisco, CA', 
          'https://techcorp.example.com', 
          'Innovative technology company focused on creating cutting-edge solutions.', 
          ${now}, 
          ${now}
        )
        ON CONFLICT ("userId") DO NOTHING
      `

      // Get company profile
      const companyProfile = await sql`SELECT * FROM "Company" WHERE "userId" = ${companyUser[0].id}`

      if (companyProfile.length > 0) {
        // Create internships
        const internships = [
          {
            title: "UX Design Intern",
            description: "Join our design team to create beautiful and functional user interfaces.",
            location: "San Francisco, CA",
            isRemote: true,
            isPaid: true,
            compensation: "$25/hour",
            deadline: new Date("2025-05-30").toISOString(),
            requiredSkills: ["UI/UX Design", "Figma"],
          },
          {
            title: "Frontend Developer Intern",
            description: "Work on our web applications using React and modern JavaScript.",
            location: "San Francisco, CA",
            isHybrid: true,
            isPaid: true,
            compensation: "$28/hour",
            deadline: new Date("2025-05-25").toISOString(),
            requiredSkills: ["JavaScript", "React"],
          },
          {
            title: "Data Science Intern",
            description: "Analyze data and build models to help us make better decisions.",
            location: "San Francisco, CA",
            isRemote: true,
            isPaid: true,
            compensation: "$30/hour",
            deadline: new Date("2025-06-05").toISOString(),
            requiredSkills: ["Python", "Data Analysis"],
          },
        ]

        for (const internshipData of internships) {
          const internshipId = crypto.randomUUID()

          await sql`
            INSERT INTO "Internship" (
              id, 
              "companyId", 
              title, 
              description, 
              location, 
              "isRemote", 
              "isHybrid", 
              deadline, 
              "isPaid", 
              compensation, 
              "createdAt", 
              "updatedAt"
            )
            VALUES (
              ${internshipId}, 
              ${companyProfile[0].id}, 
              ${internshipData.title}, 
              ${internshipData.description}, 
              ${internshipData.location}, 
              ${internshipData.isRemote || false}, 
              ${internshipData.isHybrid || false}, 
              ${internshipData.deadline}, 
              ${internshipData.isPaid || false}, 
              ${internshipData.compensation || null}, 
              ${now}, 
              ${now}
            )
          `

          // Add required skills to internship
          for (const skillName of internshipData.requiredSkills) {
            const skill = await sql`SELECT * FROM "Skill" WHERE name = ${skillName}`

            if (skill.length > 0) {
              const skillLinkId = crypto.randomUUID()
              await sql`
                INSERT INTO "InternshipSkill" (id, "internshipId", "skillId", importance, "createdAt", "updatedAt")
                VALUES (${skillLinkId}, ${internshipId}, ${skill[0].id}, 5, ${now}, ${now})
                ON CONFLICT ("internshipId", "skillId") DO NOTHING
              `
            }
          }
        }
      }
    }

    // School
    const schoolPassword = await hash("password123", 10)
    const schoolId = crypto.randomUUID()

    await sql`
      INSERT INTO "User" (id, name, email, password, role, "profileImage", "createdAt", "updatedAt")
      VALUES (
        ${schoolId}, 
        'State University', 
        'school@example.com', 
        ${schoolPassword}, 
        'SCHOOL', 
        '/placeholder.svg?height=40&width=40', 
        ${now}, 
        ${now}
      )
      ON CONFLICT (email) DO NOTHING
    `

    // Get the school user to check if it was inserted
    const schoolUser = await sql`SELECT * FROM "User" WHERE email = 'school@example.com'`

    if (schoolUser.length > 0) {
      // Create school profile
      const schoolProfileId = crypto.randomUUID()
      await sql`
        INSERT INTO "School" (
          id, 
          "userId", 
          type, 
          location, 
          website, 
          description, 
          "createdAt", 
          "updatedAt"
        )
        VALUES (
          ${schoolProfileId}, 
          ${schoolUser[0].id}, 
          'University', 
          'Boston, MA', 
          'https://stateuniversity.example.com', 
          'A leading institution dedicated to excellence in education and research.', 
          ${now}, 
          ${now}
        )
        ON CONFLICT ("userId") DO NOTHING
      `

      // Get school profile
      const schoolProfile = await sql`SELECT * FROM "School" WHERE "userId" = ${schoolUser[0].id}`

      if (schoolProfile.length > 0) {
        // Create programs
        const programs = [
          {
            name: "Computer Science Practicum",
            description: "Practical experience in software development.",
            credits: 4,
            isInternshipEligible: true,
          },
          {
            name: "Business Internship",
            description: "Professional experience in business settings.",
            credits: 3,
            isInternshipEligible: true,
          },
          {
            name: "Engineering Co-op",
            description: "Cooperative education program for engineering students.",
            credits: 6,
            isInternshipEligible: true,
          },
        ]

        for (const programData of programs) {
          const programId = crypto.randomUUID()

          await sql`
            INSERT INTO "Program" (
              id, 
              "schoolId", 
              name, 
              description, 
              credits, 
              "isInternshipEligible", 
              "createdAt", 
              "updatedAt"
            )
            VALUES (
              ${programId}, 
              ${schoolProfile[0].id}, 
              ${programData.name}, 
              ${programData.description}, 
              ${programData.credits}, 
              ${programData.isInternshipEligible}, 
              ${now}, 
              ${now}
            )
          `
        }

        // Create partnership between school and company
        const companyProfile = await sql`SELECT * FROM "Company" WHERE "userId" = ${companyUser[0].id}`

        if (companyProfile.length > 0) {
          const partnershipId = crypto.randomUUID()

          await sql`
            INSERT INTO "SchoolPartnership" (
              id, 
              "schoolId", 
              "companyId", 
              status, 
              "createdAt", 
              "updatedAt"
            )
            VALUES (
              ${partnershipId}, 
              ${schoolProfile[0].id}, 
              ${companyProfile[0].id}, 
              'ACTIVE', 
              ${now}, 
              ${now}
            )
            ON CONFLICT ("schoolId", "companyId") DO NOTHING
          `
        }
      }
    }

    return NextResponse.json({ message: "Database seeded successfully!" })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}

