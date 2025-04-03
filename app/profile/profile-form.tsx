"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

interface ProfileFormProps {
  user: User
  profile: any
}

export default function ProfileForm({ user, profile }: ProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Common user fields
  const [name, setName] = useState(user.name || "")
  const [email, setEmail] = useState(user.email)

  // Student-specific fields
  const [school, setSchool] = useState(profile?.school || "")
  const [major, setMajor] = useState(profile?.major || "")
  const [graduationYear, setGraduationYear] = useState(profile?.graduationYear || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [skills, setSkills] = useState(profile?.skills?.join(", ") || "")

  // Company-specific fields
  const [companyName, setCompanyName] = useState(profile?.companyName || "")
  const [industry, setIndustry] = useState(profile?.industry || "")
  const [size, setSize] = useState(profile?.size || "")
  const [location, setLocation] = useState(profile?.location || "")
  const [website, setWebsite] = useState(profile?.website || "")
  const [description, setDescription] = useState(profile?.description || "")

  // School-specific fields
  const [schoolName, setSchoolName] = useState(profile?.schoolName || "")
  const [type, setType] = useState(profile?.type || "")
  const [schoolLocation, setSchoolLocation] = useState(profile?.location || "")
  const [schoolWebsite, setSchoolWebsite] = useState(profile?.website || "")
  const [schoolDescription, setSchoolDescription] = useState(profile?.description || "")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          // Include role-specific fields based on user.role
          ...(user.role === "STUDENT" && {
            school,
            major,
            graduationYear: graduationYear ? Number.parseInt(graduationYear) : null,
            bio,
            skills: skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean),
          }),
          ...(user.role === "COMPANY" && {
            companyName,
            industry,
            size,
            location,
            website,
            description,
          }),
          ...(user.role === "SCHOOL" && {
            schoolName,
            type,
            location: schoolLocation,
            website: schoolWebsite,
            description: schoolDescription,
          }),
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update profile",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your personal information and profile details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} disabled placeholder="Your email" />
                <p className="text-sm text-muted-foreground">Email cannot be changed</p>
              </div>
            </div>

            {user.role === "STUDENT" && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="school">School</Label>
                    <Input
                      id="school"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="Your school"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="major">Major</Label>
                    <Input
                      id="major"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      placeholder="Your major"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">Graduation Year</Label>
                    <Input
                      id="graduationYear"
                      type="number"
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                      placeholder="Expected graduation year"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills</Label>
                    <Input
                      id="skills"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="Comma-separated list of skills"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
              </>
            )}

            {user.role === "COMPANY" && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Your company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="Company industry"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="size">Company Size</Label>
                    <Input
                      id="size"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      placeholder="Number of employees"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Company location"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="Company website"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your company"
                    rows={4}
                  />
                </div>
              </>
            )}

            {user.role === "SCHOOL" && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input
                      id="schoolName"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="School name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">School Type</Label>
                    <Input
                      id="type"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      placeholder="University, College, etc."
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="schoolLocation">Location</Label>
                    <Input
                      id="schoolLocation"
                      value={schoolLocation}
                      onChange={(e) => setSchoolLocation(e.target.value)}
                      placeholder="School location"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schoolWebsite">Website</Label>
                    <Input
                      id="schoolWebsite"
                      value={schoolWebsite}
                      onChange={(e) => setSchoolWebsite(e.target.value)}
                      placeholder="School website"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolDescription">School Description</Label>
                  <Textarea
                    id="schoolDescription"
                    value={schoolDescription}
                    onChange={(e) => setSchoolDescription(e.target.value)}
                    placeholder="Describe your school"
                    rows={4}
                  />
                </div>
              </>
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

