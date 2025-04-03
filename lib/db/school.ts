import prisma from "../prisma"

export async function getSchoolProfile(userId: string) {
  return prisma.school.findUnique({
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
      programs: true,
      companyPartnerships: {
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
  })
}

export async function updateSchoolProfile(userId: string, data: any) {
  return prisma.school.update({
    where: { userId },
    data,
  })
}

export async function getPlacementStatistics(schoolId: string) {
  // This would be a complex query in a real application
  // For now, we'll return mock data
  return {
    totalStudents: 500,
    placedStudents: 392,
    placementRate: 78.4,
    departmentStats: [
      { department: "Computer Science", students: 124, placed: 108, rate: 87 },
      { department: "Business Administration", students: 98, placed: 72, rate: 73 },
      { department: "Engineering", students: 112, placed: 94, rate: 84 },
      { department: "Design", students: 76, placed: 58, rate: 76 },
      { department: "Marketing", students: 84, placed: 62, rate: 74 },
    ],
  }
}

