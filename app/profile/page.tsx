import { redirect } from "next/navigation"
import { getCurrentUser, getUserProfile } from "@/lib/auth"
import ProfileForm from "./profile-form"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const profile = await getUserProfile(user.id, user.role)

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <ProfileForm user={user} profile={profile} />
    </div>
  )
}

