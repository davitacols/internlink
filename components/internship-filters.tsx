"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Search, X } from "lucide-react"

export default function InternshipFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("q") || "")
  const [isPaid, setIsPaid] = useState(searchParams.get("paid") === "true")
  const [isRemote, setIsRemote] = useState(searchParams.get("remote") === "true")

  // Update the URL when filters change
  const updateFilters = () => {
    const params = new URLSearchParams()

    if (search) params.set("q", search)
    if (isPaid) params.set("paid", "true")
    if (isRemote) params.set("remote", "true")

    router.push(`/internships?${params.toString()}`)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearch("")
    setIsPaid(false)
    setIsRemote(false)
    router.push("/internships")
  }

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== searchParams.get("q")) {
        updateFilters()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="w-full md:w-auto space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search internships..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {(isPaid || isRemote || search) && (
          <Button variant="ghost" size="icon" onClick={clearFilters} aria-label="Clear filters">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="paid-filter"
            checked={isPaid}
            onCheckedChange={(checked) => {
              setIsPaid(checked)
              setTimeout(updateFilters, 0)
            }}
          />
          <Label htmlFor="paid-filter">Paid Only</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="remote-filter"
            checked={isRemote}
            onCheckedChange={(checked) => {
              setIsRemote(checked)
              setTimeout(updateFilters, 0)
            }}
          />
          <Label htmlFor="remote-filter">Remote Only</Label>
        </div>
      </div>
    </div>
  )
}

