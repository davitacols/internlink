import { queryOne } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CompanyProfileForm from "@/components/company-profile-form"
import AccountSettingsForm from "@/components/account-settings-form"

interface Company {
  id: string
  userId: string
  industry: string
  size: string
  location: string
  website: string
  description: string
  createdAt: string
  updatedAt: string
}

interface User {
  id: string
  name: string
  email: string
  profileImage: string | null
}

// This is a placeholder function - in a real app, you would get the current user from the session
async function getCurrentUser() {
  // For demo purposes, we'll return a hardcoded user ID
  // In a real app, you would get this from the authenticated user session
  return {
    id: "6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u",
    role: "COMPANY",
  }
}

async function getCompanyProfile(userId: string): Promise<{ company: Company; user: User } | null> {
  const company = await queryOne<Company>(
    `
    SELECT *
    FROM "Company"
    WHERE "userId" = $1
  `,
    [userId],
  )

  if (!company) return null

  const user = await queryOne<User>(
    `
    SELECT id, name, email, "profileImage"
    FROM "User"
    WHERE id = $1
  `,
    [userId],
  )

  if (!user) return null

  return { company, user }
}

export default async function CompanySettingsPage() {
  const currentUser = await getCurrentUser()
  const profile = await getCompanyProfile(currentUser.id)

  if (!profile) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Company profile not found. Please contact support.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Company Profile</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
              <CardDescription>Update your company information and public profile</CardDescription>
            </CardHeader>
            <CardContent>
              <CompanyProfileForm company={profile.company} user={profile.user} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account settings and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <AccountSettingsForm user={profile.user} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

