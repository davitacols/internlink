import prisma from "../prisma"

export async function getStudentProfile(userId: string) {
  return prisma.student.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
        },
      },
      skills: {
        include: {
          skill: true,
        },
      },
      applications: {
        include: {
          internship: {
            include: {
              company: {
                include: {
                  user: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      assessments: true,
    },
  })
}

export async function updateStudentProfile(userId: string, data: any) {
  return prisma.student.update({
    where: { userId },
    data,
  })
}

export async function getRecommendedInternships(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      skills: {
        include: {
          skill: true,
        },
      },
    },
  })

  if (!student) {
    throw new Error("Student not found")
  }

  // Get student skills
  const studentSkillIds = student.skills.map((s) => s.skillId)

  // Find internships that match student skills
  const internships = await prisma.internship.findMany({
    where: {
      status: "ACTIVE",
      requiredSkills: {
        some: {
          skillId: {
            in: studentSkillIds,
          },
        },
      },
    },
    include: {
      company: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
      requiredSkills: {
        include: {
          skill: true,
        },
      },
    },
    take: 10,
  })

  // Calculate match percentage based on skills
  return internships
    .map((internship) => {
      const matchingSkills = internship.requiredSkills.filter((rs) => studentSkillIds.includes(rs.skillId))

      const matchPercentage = Math.round((matchingSkills.length / internship.requiredSkills.length) * 100)

      return {
        ...internship,
        matchPercentage: Math.min(matchPercentage, 100),
      }
    })
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
}

