"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, X } from "lucide-react"

const PROJECT_TYPES = ["Research", "Development", "Design", "Marketing", "Content Creation", "Data Analysis", "Other"]

export function MicroInternshipFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [isRemote, setIsRemote] = useState<boolean | undefined>(
    searchParams.get("isRemote") === "true" ? true : searchParams.get("isRemote") === "false" ? false : undefined,
  )
  const [isPaid, setIsPaid] = useState<boolean | undefined>(
    searchParams.get("isPaid") === "true" ? true : searchParams.get("isPaid") === "false" ? false : undefined,
  )
  const [maxDurationWeeks, setMaxDurationWeeks] = useState<number | undefined>(
    searchParams.get("maxDurationWeeks") ? Number.parseInt(searchParams.get("maxDurationWeeks") || "0", 10) : undefined,
  )
  const [maxWeeklyCommitment, setMaxWeeklyCommitment] = useState<number | undefined>(
    searchParams.get("maxWeeklyCommitment")
      ? Number.parseInt(searchParams.get("maxWeeklyCommitment") || "0", 10)
      : undefined,
  )
  const [projectType, setProjectType] = useState<string | undefined>(searchParams.get("projectType") || undefined)

  const [isFiltersVisible, setIsFiltersVisible] = useState(false)
  const [hasActiveFilters, setHasActiveFilters] = useState(false)

  // Check if any filters are active
  useEffect(() => {
    setHasActiveFilters(
      isRemote !== undefined ||
        isPaid !== undefined ||
        maxDurationWeeks !== undefined ||
        maxWeeklyCommitment !== undefined ||
        projectType !== undefined,
    )
  }, [isRemote, isPaid, maxDurationWeeks, maxWeeklyCommitment, projectType])

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (search) params.set("search", search)
    if (isRemote !== undefined) params.set("isRemote", isRemote.toString())
    if (isPaid !== undefined) params.set("isPaid", isPaid.toString())
    if (maxDurationWeeks !== undefined) params.set("maxDurationWeeks", maxDurationWeeks.toString())
    if (maxWeeklyCommitment !== undefined) params.set("maxWeeklyCommitment", maxWeeklyCommitment.toString())
    if (projectType) params.set("projectType", projectType)

    router.push(`/micro-internships?${params.toString()}`)
  }

  const resetFilters = () => {
    setIsRemote(undefined)
    setIsPaid(undefined)
    setMaxDurationWeeks(undefined)
    setMaxWeeklyCommitment(undefined)
    setProjectType(undefined)

    if (search) {
      router.push(`/micro-internships?search=${search}`)
    } else {
      router.push("/micro-internships")
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search micro-internships..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          type="button"
          variant={isFiltersVisible ? "default" : "outline"}
          onClick={() => setIsFiltersVisible(!isFiltersVisible)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 rounded-full bg-primary-foreground text-primary w-5 h-5 flex items-center justify-center text-xs">
              !
            </span>
          )}
        </Button>
        <Button type="submit">Search</Button>
      </form>

      {isFiltersVisible && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="remote-filter">Remote Only</Label>
                  <Switch
                    id="remote-filter"
                    checked={isRemote === true}
                    onCheckedChange={(checked) => setIsRemote(checked ? true : undefined)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="paid-filter">Paid Only</Label>
                  <Switch
                    id="paid-filter"
                    checked={isPaid === true}
                    onCheckedChange={(checked) => setIsPaid(checked ? true : undefined)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="duration-filter">Max Duration (weeks)</Label>
                    {maxDurationWeeks !== undefined && (
                      <span className="text-sm font-medium">{maxDurationWeeks} weeks</span>
                    )}
                  </div>
                  <Slider
                    id="duration-filter"
                    min={1}
                    max={12}
                    step={1}
                    value={maxDurationWeeks !== undefined ? [maxDurationWeeks] : [12]}
                    onValueChange={(value) => setMaxDurationWeeks(value[0])}
                    disabled={maxDurationWeeks === undefined}
                  />
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">1 week</span>
                    <span className="text-xs text-muted-foreground">12 weeks</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Switch
                      id="enable-duration"
                      checked={maxDurationWeeks !== undefined}
                      onCheckedChange={(checked) => setMaxDurationWeeks(checked ? 8 : undefined)}
                    />
                    <Label htmlFor="enable-duration" className="text-xs">
                      Enable duration filter
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hours-filter">Max Weekly Hours</Label>
                    {maxWeeklyCommitment !== undefined && (
                      <span className="text-sm font-medium">{maxWeeklyCommitment} hours</span>
                    )}
                  </div>
                  <Slider
                    id="hours-filter"
                    min={1}
                    max={40}
                    step={1}
                    value={maxWeeklyCommitment !== undefined ? [maxWeeklyCommitment] : [20]}
                    onValueChange={(value) => setMaxWeeklyCommitment(value[0])}
                    disabled={maxWeeklyCommitment === undefined}
                  />
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">1 hour</span>
                    <span className="text-xs text-muted-foreground">40 hours</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Switch
                      id="enable-hours"
                      checked={maxWeeklyCommitment !== undefined}
                      onCheckedChange={(checked) => setMaxWeeklyCommitment(checked ? 20 : undefined)}
                    />
                    <Label htmlFor="enable-hours" className="text-xs">
                      Enable hours filter
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-type">Project Type</Label>
                <Select value={projectType || ""} onValueChange={(value) => setProjectType(value || undefined)}>
                  <SelectTrigger id="project-type">
                    <SelectValue placeholder="Any project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any project type</SelectItem>
                    {PROJECT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={resetFilters} type="button">
                <X className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
              <Button onClick={applyFilters} type="button">
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

