"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"

export default async function SignUpPage({ searchParams }: { searchParams: { role?: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const role = (searchParams.role as string) || "STUDENT"
  const [activeTab, setActiveTab] = useState<"STUDENT" | "COMPANY" | "SCHOOL">(role as "STUDENT" | "COMPANY" | "SCHOOL")

  // Student form state
  const [studentData, setStudentData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    school: "",
    major: "",
    password: "",
    terms: false,
  })

  // Company form state
  const [companyData, setCompanyData] = useState({
    companyName: "",
    industry: "",
    email: "",
    companySize: "",
    password: "",
    terms: false,
  })

  // School form state
  const [schoolData, setSchoolData] = useState({
    schoolName: "",
    schoolType: "",
    email: "",
    department: "",
    password: "",
    terms: false,
  })

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setStudentData({
      ...studentData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setCompanyData({
      ...companyData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setSchoolData({
      ...schoolData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSelectChange = (value: string, field: string, formType: "STUDENT" | "COMPANY" | "SCHOOL") => {
    if (formType === "STUDENT") {
      setStudentData({ ...studentData, [field]: value })
    } else if (formType === "COMPANY") {
      setCompanyData({ ...companyData, [field]: value })
    } else if (formType === "SCHOOL") {
      setSchoolData({ ...schoolData, [field]: value })
    }
  }

  const handleStudentSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      // Call API route
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${studentData.firstName} ${studentData.lastName}`,
          email: studentData.email,
          password: studentData.password,
          role: "STUDENT",
          studentData: {
            school: studentData.school,
            major: studentData.major,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up")
      }

      toast({
        title: "Account created successfully",
        description: "You can now sign in with your credentials.",
      })

      router.push("/signin")
    } catch (error) {
      console.error("Sign up failed:", error)
      toast({
        title: "Sign up failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompanySignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      // Call API route
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: companyData.companyName,
          email: companyData.email,
          password: companyData.password,
          role: "COMPANY",
          companyData: {
            industry: companyData.industry,
            size: companyData.companySize,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up")
      }

      toast({
        title: "Account created successfully",
        description: "You can now sign in with your credentials.",
      })

      router.push("/signin")
    } catch (error) {
      console.error("Sign up failed:", error)
      toast({
        title: "Sign up failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSchoolSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      // Call API route
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: schoolData.schoolName,
          email: schoolData.email,
          password: schoolData.password,
          role: "SCHOOL",
          schoolData: {
            type: schoolData.schoolType,
            department: schoolData.department,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up")
      }

      toast({
        title: "Account created successfully",
        description: "You can now sign in with your credentials.",
      })

      router.push("/signin")
    } catch (error) {
      console.error("Sign up failed:", error)
      toast({
        title: "Sign up failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Select your account type and fill in your details</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs
          defaultValue="STUDENT"
          className="w-full"
          onValueChange={(value) => setActiveTab(value as "STUDENT" | "COMPANY" | "SCHOOL")}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="STUDENT">Student</TabsTrigger>
            <TabsTrigger value="COMPANY">Company</TabsTrigger>
            <TabsTrigger value="SCHOOL">School</TabsTrigger>
          </TabsList>

          <TabsContent value="STUDENT">
            <form onSubmit={handleStudentSignUp} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    disabled={isLoading}
                    required
                    value={studentData.firstName}
                    onChange={handleStudentChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    disabled={isLoading}
                    required
                    value={studentData.lastName}
                    onChange={handleStudentChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  required
                  value={studentData.email}
                  onChange={handleStudentChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school">School/University</Label>
                <Select
                  disabled={isLoading}
                  value={studentData.school}
                  onValueChange={(value) => handleSelectChange(value, "school", "STUDENT")}
                >
                  <SelectTrigger id="school">
                    <SelectValue placeholder="Select your school" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stanford">Stanford University</SelectItem>
                    <SelectItem value="mit">MIT</SelectItem>
                    <SelectItem value="berkeley">UC Berkeley</SelectItem>
                    <SelectItem value="harvard">Harvard University</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="major">Field of Study/Major</Label>
                <Input
                  id="major"
                  name="major"
                  placeholder="Computer Science"
                  disabled={isLoading}
                  required
                  value={studentData.major}
                  onChange={handleStudentChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    disabled={isLoading}
                    required
                    value={studentData.password}
                    onChange={handleStudentChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  name="terms"
                  checked={studentData.terms}
                  onCheckedChange={(checked) => setStudentData({ ...studentData, terms: checked as boolean })}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions
                </label>
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Student Account"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="COMPANY">
            <form onSubmit={handleCompanySignUp} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="Acme Inc."
                  disabled={isLoading}
                  required
                  value={companyData.companyName}
                  onChange={handleCompanyChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  disabled={isLoading}
                  value={companyData.industry}
                  onValueChange={(value) => handleSelectChange(value, "industry", "COMPANY")}
                >
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Company Email</Label>
                <Input
                  id="companyEmail"
                  name="email"
                  placeholder="hr@company.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  required
                  value={companyData.email}
                  onChange={handleCompanyChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size</Label>
                <Select
                  disabled={isLoading}
                  value={companyData.companySize}
                  onValueChange={(value) => handleSelectChange(value, "companySize", "COMPANY")}
                >
                  <SelectTrigger id="companySize">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="501+">501+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyPassword">Password</Label>
                <div className="relative">
                  <Input
                    id="companyPassword"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    disabled={isLoading}
                    required
                    value={companyData.password}
                    onChange={handleCompanyChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="companyTerms"
                  name="terms"
                  checked={companyData.terms}
                  onCheckedChange={(checked) => setCompanyData({ ...companyData, terms: checked as boolean })}
                />
                <label
                  htmlFor="companyTerms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions
                </label>
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Company Account"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="SCHOOL">
            <form onSubmit={handleSchoolSignUp} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="schoolName">School/University Name</Label>
                <Input
                  id="schoolName"
                  name="schoolName"
                  placeholder="State University"
                  disabled={isLoading}
                  required
                  value={schoolData.schoolName}
                  onChange={handleSchoolChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schoolType">Institution Type</Label>
                <Select
                  disabled={isLoading}
                  value={schoolData.schoolType}
                  onValueChange={(value) => handleSelectChange(value, "schoolType", "SCHOOL")}
                >
                  <SelectTrigger id="schoolType">
                    <SelectValue placeholder="Select institution type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="university">University</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                    <SelectItem value="community">Community College</SelectItem>
                    <SelectItem value="technical">Technical Institute</SelectItem>
                    <SelectItem value="highschool">High School</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="schoolEmail">Official Email</Label>
                <Input
                  id="schoolEmail"
                  name="email"
                  placeholder="career@university.edu"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  required
                  value={schoolData.email}
                  onChange={handleSchoolChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  name="department"
                  placeholder="Career Services"
                  disabled={isLoading}
                  required
                  value={schoolData.department}
                  onChange={handleSchoolChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schoolPassword">Password</Label>
                <div className="relative">
                  <Input
                    id="schoolPassword"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    disabled={isLoading}
                    required
                    value={schoolData.password}
                    onChange={handleSchoolChange}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="schoolTerms"
                  name="terms"
                  checked={schoolData.terms}
                  onCheckedChange={(checked) => setSchoolData({ ...schoolData, terms: checked as boolean })}
                />
                <label
                  htmlFor="schoolTerms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the terms and conditions
                </label>
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create School Account"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-center w-full text-muted-foreground">
          Already have an account?{" "}
          <Link href="/signin" className="font-medium text-primary underline-offset-4 hover:underline">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

