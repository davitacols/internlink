import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

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

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill,
    })
  }

  // Create demo users

  // Student
  const studentPassword = await hash("password123", 10)
  const student = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      name: "Jane Doe",
      email: "student@example.com",
      password: studentPassword,
      role: "STUDENT",
      profileImage: "/placeholder.svg?height=40&width=40",
      student: {
        create: {
          school: "Stanford University",
          major: "Computer Science",
          graduationYear: 2025,
          bio: "Passionate about technology and design.",
          profileCompletion: 85,
        },
      },
    },
    include: {
      student: true,
    },
  })

  // Add skills to student
  if (student.student) {
    const studentSkills = [
      { skillName: "JavaScript", proficiency: 75 },
      { skillName: "React", proficiency: 60 },
      { skillName: "UI/UX Design", proficiency: 80 },
      { skillName: "Project Management", proficiency: 45 },
    ]

    for (const studentSkill of studentSkills) {
      const skill = await prisma.skill.findUnique({
        where: { name: studentSkill.skillName },
      })

      if (skill) {
        await prisma.studentSkill.upsert({
          where: {
            studentId_skillId: {
              studentId: student.student.id,
              skillId: skill.id,
            },
          },
          update: {
            proficiency: studentSkill.proficiency,
          },
          create: {
            studentId: student.student.id,
            skillId: skill.id,
            proficiency: studentSkill.proficiency,
          },
        })
      }
    }
  }

  // Company
  const companyPassword = await hash("password123", 10)
  const company = await prisma.user.upsert({
    where: { email: "company@example.com" },
    update: {},
    create: {
      name: "TechCorp",
      email: "company@example.com",
      password: companyPassword,
      role: "COMPANY",
      profileImage: "/placeholder.svg?height=40&width=40",
      company: {
        create: {
          industry: "Technology",
          size: "51-200",
          location: "San Francisco, CA",
          website: "https://techcorp.example.com",
          description: "Innovative technology company focused on creating cutting-edge solutions.",
        },
      },
    },
    include: {
      company: true,
    },
  })

  // Create internships for company
  if (company.company) {
    const internships = [
      {
        title: "UX Design Intern",
        description: "Join our design team to create beautiful and functional user interfaces.",
        location: "San Francisco, CA",
        isRemote: true,
        isPaid: true,
        compensation: "$25/hour",
        deadline: new Date("2025-05-30"),
        requiredSkills: ["UI/UX Design", "Figma"],
      },
      {
        title: "Frontend Developer Intern",
        description: "Work on our web applications using React and modern JavaScript.",
        location: "San Francisco, CA",
        isHybrid: true,
        isPaid: true,
        compensation: "$28/hour",
        deadline: new Date("2025-05-25"),
        requiredSkills: ["JavaScript", "React"],
      },
      {
        title: "Data Science Intern",
        description: "Analyze data and build models to help us make better decisions.",
        location: "San Francisco, CA",
        isRemote: true,
        isPaid: true,
        compensation: "$30/hour",
        deadline: new Date("2025-06-05"),
        requiredSkills: ["Python", "Data Analysis"],
      },
    ]

    for (const internshipData of internships) {
      const { requiredSkills, ...rest } = internshipData

      const internship = await prisma.internship.create({
        data: {
          ...rest,
          companyId: company.company.id,
        },
      })

      // Add required skills to internship
      for (const skillName of requiredSkills) {
        const skill = await prisma.skill.findUnique({
          where: { name: skillName },
        })

        if (skill) {
          await prisma.internshipSkill.create({
            data: {
              internshipId: internship.id,
              skillId: skill.id,
              importance: 5,
            },
          })
        }
      }
    }
  }

  // School
  const schoolPassword = await hash("password123", 10)
  const school = await prisma.user.upsert({
    where: { email: "school@example.com" },
    update: {},
    create: {
      name: "State University",
      email: "school@example.com",
      password: schoolPassword,
      role: "SCHOOL",
      profileImage: "/placeholder.svg?height=40&width=40",
      school: {
        create: {
          type: "University",
          location: "Boston, MA",
          website: "https://stateuniversity.example.com",
          description: "A leading institution dedicated to excellence in education and research.",
        },
      },
    },
    include: {
      school: true,
    },
  })

  // Create programs for school
  if (school.school) {
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
      await prisma.program.create({
        data: {
          ...programData,
          schoolId: school.school.id,
        },
      })
    }

    // Create partnership between school and company
    if (company.company) {
      await prisma.schoolPartnership.create({
        data: {
          schoolId: school.school.id,
          companyId: company.company.id,
          status: "ACTIVE",
        },
      })
    }
  }

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

