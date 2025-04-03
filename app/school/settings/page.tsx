"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

export default function SchoolSettings() {
  const [isLoading, setIsLoading] = useState(false)

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Profile updated",
        description: "Your school profile has been updated successfully.",
      })
    }, 1000)
  }

  const handleNotificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
      })
    }, 1000)
  }

  const handleIntegrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Integration settings updated",
        description: "Your integration settings have been saved.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">School Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>School Profile</CardTitle>
              <CardDescription>Manage your school information and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">School Name</Label>
                    <Input id="name" defaultValue="State University" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" type="url" defaultValue="https://stateuniversity.edu" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue="San Francisco, CA" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="type">Institution Type</Label>
                    <Select defaultValue="public">
                      <SelectTrigger>
                        <SelectValue placeholder="Select institution type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public University</SelectItem>
                        <SelectItem value="private">Private University</SelectItem>
                        <SelectItem value="community">Community College</SelectItem>
                        <SelectItem value="technical">Technical Institute</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      defaultValue="State University is a leading institution dedicated to excellence in education and research."
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationsSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Student Applications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when students apply to internships
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Placement Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when students are placed in internships
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Internship Opportunities</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about new internship postings
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive weekly summary reports of student activities
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketing Communications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about InternLink features and events
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Preferences"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Curriculum Integrations</CardTitle>
              <CardDescription>Connect InternLink with your school's systems</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleIntegrationSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="lms">Learning Management System</Label>
                    <Select defaultValue="none">
                      <SelectTrigger>
                        <SelectValue placeholder="Select LMS" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="canvas">Canvas</SelectItem>
                        <SelectItem value="blackboard">Blackboard</SelectItem>
                        <SelectItem value="moodle">Moodle</SelectItem>
                        <SelectItem value="d2l">D2L Brightspace</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="sis">Student Information System</Label>
                    <Select defaultValue="none">
                      <SelectTrigger>
                        <SelectValue placeholder="Select SIS" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="banner">Ellucian Banner</SelectItem>
                        <SelectItem value="colleague">Ellucian Colleague</SelectItem>
                        <SelectItem value="peoplesoft">Oracle PeopleSoft</SelectItem>
                        <SelectItem value="workday">Workday Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="api_key">API Key</Label>
                    <Input id="api_key" type="password" placeholder="Enter API key" />
                    <p className="text-sm text-muted-foreground">Used for secure communication with your systems</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="auto_sync" />
                    <Label htmlFor="auto_sync">Enable automatic data synchronization</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="credit" />
                    <Label htmlFor="credit">Enable academic credit tracking for internships</Label>
                  </div>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Integration Settings"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

