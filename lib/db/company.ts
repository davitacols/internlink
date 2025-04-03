import prisma from "../prisma"

export async function getCompanyProfile(userId: string) {
  return prisma.company.findUnique({
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
      internships: {
        include: {
          applications: true,
          requiredSkills: {
            include: {
              skill: true,
            },
          },
        },
      },
      schoolPartnerships: {
        include: {
          school: {
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
  })
}

export async function updateCompanyProfile(userId: string, data: any) {
  return prisma.company.update({
    where: { userId },
    data,
  })
}

export async function createInternship(companyId: string, data: any) {
  return prisma.internship.create({
    data: {
      ...data,
      companyId,
    },
  })
}

export async function getInternshipApplications(internshipId: string) {
  return prisma.application.findMany({
    where: { internshipId },
    include: {
      student: {
        include: {
          user: {
            select: {
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
        },
      },
      interviews: true,
    },
  })
}

