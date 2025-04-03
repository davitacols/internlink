"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface ApplicationFormProps {
  internshipId: string
  internshipTitle: string
  companyName: string
  studentId: string
}

export default function ApplicationForm({
  internshipId,
  internshipTitle,
  companyName,
  studentId,
}: ApplicationFormProps) {
  const router = useRouter()
  const [coverLetter, setCoverLetter] = useState("")
  const [resumeUrl, setResumeUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          internshipId,
          coverLetter,
          resumeUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Application Submitted</AlertTitle>
        <AlertDescription className="text-green-700">
          Your application for {internshipTitle} at {companyName} has been submitted successfully. You will be
          redirected to the dashboard shortly.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply for {internshipTitle}</CardTitle>
        <CardDescription>Complete the form below to apply for this internship at {companyName}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              placeholder="Introduce yourself and explain why you're a good fit for this position..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={8}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resumeUrl">Resume URL (Optional)</Label>
            <Input
              id="resumeUrl"
              type="url"
              placeholder="https://example.com/your-resume.pdf"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Provide a link to your resume. You can upload it to Google Drive, Dropbox, or any other file hosting
              service.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

