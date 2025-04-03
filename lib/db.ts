import { neon } from "@neondatabase/serverless"

// Create a SQL client with the Neon connection string
export const sql = neon(process.env.DATABASE_URL!)

// Helper function to execute a query with parameters
export async function query<T = any>(queryText: string, params: any[] = []): Promise<T[]> {
  try {
    return (await sql(queryText, params)) as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Helper function to execute a query and return a single result
export async function queryOne<T = any>(queryText: string, params: any[] = []): Promise<T | null> {
  try {
    const results = (await sql(queryText, params)) as T[]
    return results.length > 0 ? results[0] : null
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

