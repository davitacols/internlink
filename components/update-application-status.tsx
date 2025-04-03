"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UpdateApplicationStatusProps {
  applicationId: string
  currentStatus: string
}

export function UpdateApplicationStatus({ applicationId, currentStatus }: UpdateApplicationStatusProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return

    setIsSubmitting(true)
    setStatus(newStatus)

    try {
      const formData = new FormData()
      formData.append("status", newStatus)

      await fetch(`/api/applications/${applicationId}/status`, {
        method: "POST",
        body: formData,
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating application status:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <Select value={status} onValueChange={handleStatusChange} disabled={isSubmitting}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Update status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="APPLIED">Applied</SelectItem>
          <SelectItem value="REVIEWING">Reviewing</SelectItem>
          <SelectItem value="ACCEPTED">Accept</SelectItem>
          <SelectItem value="REJECTED">Reject</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

