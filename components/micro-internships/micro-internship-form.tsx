"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const PROJECT_TYPES = ["Research", "Development", "Design", "Marketing", "Content Creation", "Data Analysis", "Other"]

interface MicroInternshipFormProps {
  companyId: string
  microInternship?: {
    id: string
    title: string
    description: string
    location: string
    isRemote: boolean
    isHybrid: boolean
    isPaid: boolean
    compensation: string
    durationHours: number | null
    durationWeeks: number | null
    weeklyCommitment: number | null
    isFlexibleSchedule: boolean
    projectType: string | null
    deliverables: string | null
    deadline: string
    status: string
  }
  skills?: {
    id: string
    name: string
    category: string
  }[]
  microInternshipSkills?: {
    skillId: string
    importance: number
  }[]
  mode: "create" | "edit"
}

export default function MicroInternshipForm({
  companyId,
  microInternship,
  skills = [],
  microInternshipSkills = [],
  mode,
}: MicroInternshipFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: microInternship?.title || "",
    description: microInternship?.description || "",
    location: microInternship?.location || "",
    isRemote: microInternship?.isRemote || false,
    isHybrid: microInternship?.isHybrid || false,
    isPaid: microInternship?.isPaid || false,
    compensation: microInternship?.compensation || "",
    durationHours: microInternship?.durationHours || null,
    durationWeeks: microInternship?.durationWeeks || null,
    weeklyCommitment: microInternship?.weeklyCommitment || null,
    isFlexibleSchedule: microInternship?.isFlexibleSchedule || false,
    projectType: microInternship?.projectType || "",
    deliverables: microInternship?.deliverables || "",
    deadline: microInternship?.deadline ? new Date(microInternship.deadline).toISOString().split("T")[0] : "",
    status: microInternship?.status || "DRAFT",
    isMicroInternship: true,
  })

  const [selectedSkills, setSelectedSkills] = useState<Record<string, number>>(
    microInternshipSkills.reduce(
      (acc, skill) => {
        acc[skill.skillId] = skill.importance
        return acc
      },
      {} as Record<string, number>,
    ),
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (name: string, value: string) => {
    const numberValue = value === "" ? null : Number.parseInt(value, 10)
    setFormData((prev) => ({ ...prev, [name]: numberValue }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value || null }))
  }

  const handleSkillChange = (skillId: string, checked: boolean) => {
    if (checked) {
      setSelectedSkills((prev) => ({ ...prev, [skillId]: 3 })) // Default importance
    } else {
      setSelectedSkills((prev) => {
        const newSkills = { ...prev }
        delete newSkills[skillId]
        return newSkills
      })
    }
  }

  const handleSkillImportanceChange = (skillId: string, importance: number) => {
    setSelectedSkills((prev) => ({ ...prev, [skillId]: importance }))
  }

  const handleSubmit = async (e: React.FormEvent, saveAsDraft = false) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const status = saveAsDraft ? "DRAFT" : "ACTIVE"

      const payload = {
        ...formData,
        status,
        companyId,
        skills: Object.entries(selectedSkills).map(([skillId, importance]) => ({
          skillId,
          importance,
        })),
      }

      const url = mode === "create" ? "/api/micro-internships" : `/api/micro-internships/${microInternship?.id}`

      const method = mode === "create" ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save micro-internship")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/company/micro-internships")
        router.refresh()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Group skills by category
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, typeof skills>,
  )

  if (success) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Success</AlertTitle>
        <AlertDescription className="text-green-700">
          {mode === "create"
            ? "Your micro-internship has been created successfully."
            : "Your micro-internship has been updated successfully."}{" "}
          You will be redirected shortly.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={(e) => handleSubmit(e, false)}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Provide the basic details about the micro-internship opportunity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., UI Design for Mobile App"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the project, responsibilities, and what interns will learn..."
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type</Label>
              <Select
                value={formData.projectType || ""}
                onValueChange={(value) => handleSelectChange("projectType", value)}
              >
                <SelectTrigger id="projectType">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliverables">Expected Deliverables</Label>
              <Textarea
                id="deliverables"
                name="deliverables"
                value={formData.deliverables || ""}
                onChange={handleChange}
                placeholder="List the specific outputs or deliverables expected from this project..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., San Francisco, CA"
                  required
                />
              </div>

              <div className="space-y-2 flex flex-col justify-end">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isRemote"
                      checked={formData.isRemote}
                      onCheckedChange={(checked) => handleSwitchChange("isRemote", checked)}
                    />
                    <Label htmlFor="isRemote">Remote</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isHybrid"
                      checked={formData.isHybrid}
                      onCheckedChange={(checked) => handleSwitchChange("isHybrid", checked)}
                    />
                    <Label htmlFor="isHybrid">Hybrid</Label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Commitment & Schedule</CardTitle>
            <CardDescription>Define the time requirements for this micro-internship</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="durationWeeks">Duration (weeks)</Label>
                <Input
                  id="durationWeeks"
                  type="number"
                  min="1"
                  max="12"
                  value={formData.durationWeeks || ""}
                  onChange={(e) => handleNumberChange("durationWeeks", e.target.value)}
                  placeholder="e.g., 4"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weeklyCommitment">Weekly Hours</Label>
                <Input
                  id="weeklyCommitment"
                  type="number"
                  min="1"
                  max="40"
                  value={formData.weeklyCommitment || ""}
                  onChange={(e) => handleNumberChange("weeklyCommitment", e.target.value)}
                  placeholder="e.g., 10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isFlexibleSchedule"
                  checked={formData.isFlexibleSchedule}
                  onCheckedChange={(checked) => handleSwitchChange("isFlexibleSchedule", checked)}
                />
                <Label htmlFor="isFlexibleSchedule">Flexible Schedule</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Allow students to complete work on their own schedule, as long as deadlines are met.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Application Deadline</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compensation</CardTitle>
            <CardDescription>Define the compensation for this micro-internship</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPaid"
                  checked={formData.isPaid}
                  onCheckedChange={(checked) => handleSwitchChange("isPaid", checked)}
                />
                <Label htmlFor="isPaid">Paid Opportunity</Label>
              </div>
            </div>

            {formData.isPaid && (
              <div className="space-y-2">
                <Label htmlFor="compensation">Compensation Details</Label>
                <Input
                  id="compensation"
                  name="compensation"
                  value={formData.compensation}
                  onChange={handleChange}
                  placeholder="e.g., $500 flat fee, $15/hour, etc."
                  required={formData.isPaid}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Required Skills</CardTitle>
            <CardDescription>Select the skills required for this micro-internship</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category} className="mb-6 last:mb-0">
                <h3 className="text-lg font-semibold mb-3">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categorySkills.map((skill) => (
                    <div key={skill.id} className="flex items-start">
                      <div className="flex items-center h-5 mt-1">
                        <input
                          type="checkbox"
                          id={`skill-${skill.id}`}
                          checked={!!selectedSkills[skill.id]}
                          onChange={(e) => handleSkillChange(skill.id, e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </div>
                      <div className="ml-3 flex-grow">
                        <Label htmlFor={`skill-${skill.id}`} className="font-medium">
                          {skill.name}
                        </Label>

                        {selectedSkills[skill.id] && (
                          <div className="mt-2">
                            <Label
                              htmlFor={`importance-${skill.id}`}
                              className="text-sm text-muted-foreground mb-1 block"
                            >
                              Importance
                            </Label>
                            <Select
                              value={selectedSkills[skill.id].toString()}
                              onValueChange={(value) => handleSkillImportanceChange(skill.id, Number.parseInt(value))}
                            >
                              <SelectTrigger id={`importance-${skill.id}`} className="w-full">
                                <SelectValue placeholder="Select importance" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">Nice to have</SelectItem>
                                <SelectItem value="2">Preferred</SelectItem>
                                <SelectItem value="3">Important</SelectItem>
                                <SelectItem value="4">Very important</SelectItem>
                                <SelectItem value="5">Required</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
              </div>
            ))}

            {Object.keys(skillsByCategory).length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No skills available. Please add skills to the system first.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>

          <Button type="button" variant="outline" onClick={(e) => handleSubmit(e, true)} disabled={isSubmitting}>
            Save as Draft
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : mode === "create" ? "Create Micro-Internship" : "Update Micro-Internship"}
          </Button>
        </div>
      </div>
    </form>
  )
}

