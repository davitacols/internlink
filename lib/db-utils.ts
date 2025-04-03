import { neon } from "@neondatabase/serverless"

// Create a SQL client using the DATABASE_URL environment variable
export const sql = neon(process.env.DATABASE_URL!)

// Helper function to execute a query and return the results
export async function query<T = any>(queryString: TemplateStringsArray, ...params: any[]): Promise<T[]> {
  try {
    return (await sql(queryString, ...params)) as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Helper function to execute a query and return a single result
export async function queryOne<T = any>(queryString: TemplateStringsArray, ...params: any[]): Promise<T | null> {
  try {
    const results = (await sql(queryString, ...params)) as T[]
    return results.length > 0 ? results[0] : null
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

