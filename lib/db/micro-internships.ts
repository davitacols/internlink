import { query, queryOne } from "../db"

export interface MicroInternship {
  id: string
  title: string
  description: string
  companyId: string
  companyName: string
  location: string
  isRemote: boolean
  isHybrid: boolean
  isPaid: boolean
  compensation: string | null
  durationHours: number | null
  durationWeeks: number | null
  weeklyCommitment: number | null
  isFlexibleSchedule: boolean
  projectType: string | null
  deliverables: string | null
  deadline: string
  status: string
  createdAt: string
  updatedAt: string
}

export async function getMicroInternships(limit = 10, offset = 0): Promise<MicroInternship[]> {
  return await query<MicroInternship>(
    `
    SELECT 
      i.id, 
      i.title, 
      i.description, 
      i."companyId",
      u.name as "companyName",
      i.location, 
      i."isRemote", 
      i."isHybrid", 
      i."isPaid", 
      i.compensation,
      i."durationHours",
      i."durationWeeks",
      i."weeklyCommitment",
      i."isFlexibleSchedule",
      i."projectType",
      i.deliverables,
      i.deadline,
      i.status,
      i."createdAt",
      i."updatedAt"
    FROM "Internship" i
    JOIN "Company" c ON i."companyId" = c.id
    JOIN "User" u ON c."userId" = u.id
    WHERE i."isMicroInternship" = TRUE
    AND i.status = 'ACTIVE'
    ORDER BY i."createdAt" DESC
    LIMIT $1 OFFSET $2
    `,
    [limit, offset],
  )
}

export async function getMicroInternshipById(id: string): Promise<MicroInternship | null> {
  return await queryOne<MicroInternship>(
    `
    SELECT 
      i.id, 
      i.title, 
      i.description, 
      i."companyId",
      u.name as "companyName",
      i.location, 
      i."isRemote", 
      i."isHybrid", 
      i."isPaid", 
      i.compensation,
      i."durationHours",
      i."durationWeeks",
      i."weeklyCommitment",
      i."isFlexibleSchedule",
      i."projectType",
      i.deliverables,
      i.deadline,
      i.status,
      i."createdAt",
      i."updatedAt"
    FROM "Internship" i
    JOIN "Company" c ON i."companyId" = c.id
    JOIN "User" u ON c."userId" = u.id
    WHERE i.id = $1
    AND i."isMicroInternship" = TRUE
    `,
    [id],
  )
}

export async function getMicroInternshipsByCompany(companyId: string): Promise<MicroInternship[]> {
  return await query<MicroInternship>(
    `
    SELECT 
      i.id, 
      i.title, 
      i.description, 
      i."companyId",
      u.name as "companyName",
      i.location, 
      i."isRemote", 
      i."isHybrid", 
      i."isPaid", 
      i.compensation,
      i."durationHours",
      i."durationWeeks",
      i."weeklyCommitment",
      i."isFlexibleSchedule",
      i."projectType",
      i.deliverables,
      i.deadline,
      i.status,
      i."createdAt",
      i."updatedAt"
    FROM "Internship" i
    JOIN "Company" c ON i."companyId" = c.id
    JOIN "User" u ON c."userId" = u.id
    WHERE i."companyId" = $1
    AND i."isMicroInternship" = TRUE
    ORDER BY i."createdAt" DESC
    `,
    [companyId],
  )
}

export async function searchMicroInternships(
  searchTerm: string,
  filters: {
    isRemote?: boolean
    isPaid?: boolean
    maxDurationWeeks?: number
    maxWeeklyCommitment?: number
    projectType?: string
  } = {},
): Promise<MicroInternship[]> {
  let sql = `
    SELECT 
      i.id, 
      i.title, 
      i.description, 
      i."companyId",
      u.name as "companyName",
      i.location, 
      i."isRemote", 
      i."isHybrid", 
      i."isPaid", 
      i.compensation,
      i."durationHours",
      i."durationWeeks",
      i."weeklyCommitment",
      i."isFlexibleSchedule",
      i."projectType",
      i.deliverables,
      i.deadline,
      i.status,
      i."createdAt",
      i."updatedAt"
    FROM "Internship" i
    JOIN "Company" c ON i."companyId" = c.id
    JOIN "User" u ON c."userId" = u.id
    WHERE i."isMicroInternship" = TRUE
    AND i.status = 'ACTIVE'
  `

  const params: any[] = []
  let paramIndex = 1

  if (searchTerm) {
    sql += ` AND (i.title ILIKE $${paramIndex} OR i.description ILIKE $${paramIndex} OR u.name ILIKE $${paramIndex})`
    params.push(`%${searchTerm}%`)
    paramIndex++
  }

  if (filters.isRemote !== undefined) {
    sql += ` AND i."isRemote" = $${paramIndex}`
    params.push(filters.isRemote)
    paramIndex++
  }

  if (filters.isPaid !== undefined) {
    sql += ` AND i."isPaid" = $${paramIndex}`
    params.push(filters.isPaid)
    paramIndex++
  }

  if (filters.maxDurationWeeks !== undefined) {
    sql += ` AND (i."durationWeeks" <= $${paramIndex} OR i."durationWeeks" IS NULL)`
    params.push(filters.maxDurationWeeks)
    paramIndex++
  }

  if (filters.maxWeeklyCommitment !== undefined) {
    sql += ` AND (i."weeklyCommitment" <= $${paramIndex} OR i."weeklyCommitment" IS NULL)`
    params.push(filters.maxWeeklyCommitment)
    paramIndex++
  }

  if (filters.projectType) {
    sql += ` AND i."projectType" = $${paramIndex}`
    params.push(filters.projectType)
    paramIndex++
  }

  sql += ` ORDER BY i."createdAt" DESC`

  return await query<MicroInternship>(sql, params)
}

