import type { Metadata } from "next"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import RegisterForm from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Register | InternLink",
  description: "Create an account on InternLink",
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Redirect if already logged in
  const user = await getCurrentUser()
  if (user) {
    redirect("/dashboard")
  }

  // Get the role from the query parameters
  const role = (searchParams.role as string) || "STUDENT"

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Enter your information to create your InternLink account</p>
        </div>
        <RegisterForm initialRole={role as "STUDENT" | "COMPANY" | "SCHOOL"} />
      </div>
    </div>
  )
}

