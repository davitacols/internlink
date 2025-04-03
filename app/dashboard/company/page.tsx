"use client"

import { Building, Calendar, Clock, Download, GraduationCap, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Header } from "@/components/dashboard/header"
import { CompanySidebar } from "@/components/dashboard/company-sidebar"

export default function CompanyDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header userType="company" />
      <div className="flex flex-1">
        <CompanySidebar />
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <div className="grid gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Company Dashboard</h1>
                <p className="text-muted-foreground">Manage your internship programs and candidate pipeline.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Internships</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground mt-2">3 positions filled, 5 still recruiting</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">142</div>
                    <p className="text-xs text-muted-foreground mt-2">32 new applications this week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground mt-2">4 today, 8 this week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Time to Hire</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">14.3</div>
                    <p className="text-xs text-muted-foreground mt-2">Average days from posting to hiring</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Candidate Pipeline</CardTitle>
                    <CardDescription>Track applicants through your hiring process</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div className="rounded-lg border bg-card p-3">
                          <div className="text-2xl font-bold">142</div>
                          <div className="text-xs text-muted-foreground">Applied</div>
                        </div>
                        <div className="rounded-lg border bg-card p-3">
                          <div className="text-2xl font-bold">87</div>
                          <div className="text-xs text-muted-foreground">Screened</div>
                        </div>
                        <div className="rounded-lg border bg-card p-3">
                          <div className="text-2xl font-bold">32</div>
                          <div className="text-xs text-muted-foreground">Interviewed</div>
                        </div>
                        <div className="rounded-lg border bg-card p-3">
                          <div className="text-2xl font-bold">12</div>
                          <div className="text-xs text-muted-foreground">Hired</div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Recent Applicants</h4>
                        {[
                          {
                            name: "Alex Johnson",
                            school: "Stanford University",
                            position: "UX Design Intern",
                            match: 98,
                            status: "Screening",
                          },
                          {
                            name: "Maria Garcia",
                            school: "MIT",
                            position: "Software Developer Intern",
                            match: 95,
                            status: "Interview Scheduled",
                          },
                          {
                            name: "David Kim",
                            school: "UC Berkeley",
                            position: "Data Science Intern",
                            match: 92,
                            status: "Application Review",
                          },
                          {
                            name: "Sarah Williams",
                            school: "NYU",
                            position: "Marketing Intern",
                            match: 90,
                            status: "Screening",
                          },
                        ].map((candidate, i) => (
                          <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarFallback>
                                  {candidate.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{candidate.name}</h4>
                                <p className="text-sm text-muted-foreground">{candidate.school}</p>
                                <p className="text-sm text-muted-foreground">{candidate.position}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant="outline" className="bg-primary/10 text-primary">
                                {candidate.match}% Match
                              </Badge>
                              <span className="text-xs text-muted-foreground">{candidate.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Candidates
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Internship Postings</CardTitle>
                    <CardDescription>Manage your active internship opportunities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          title: "UX Design Intern",
                          applicants: 42,
                          qualified: 28,
                          deadline: "May 30, 2025",
                          status: "Active",
                        },
                        {
                          title: "Software Developer Intern",
                          applicants: 56,
                          qualified: 34,
                          deadline: "May 25, 2025",
                          status: "Active",
                        },
                        {
                          title: "Data Science Intern",
                          applicants: 38,
                          qualified: 22,
                          deadline: "June 5, 2025",
                          status: "Active",
                        },
                        {
                          title: "Marketing Intern",
                          applicants: 29,
                          qualified: 18,
                          deadline: "May 20, 2025",
                          status: "Active",
                        },
                        {
                          title: "Product Management Intern",
                          applicants: 35,
                          qualified: 24,
                          deadline: "June 10, 2025",
                          status: "Draft",
                        },
                      ].map((posting, i) => (
                        <div key={i} className="rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{posting.title}</h4>
                            <Badge variant={posting.status === "Active" ? "default" : "secondary"}>
                              {posting.status}
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            <div className="flex justify-between">
                              <span>Applicants: {posting.applicants}</span>
                              <span>Qualified: {posting.qualified}</span>
                            </div>
                            <div className="mt-1">Deadline: {posting.deadline}</div>
                          </div>
                          <div className="mt-3 flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button size="sm">View</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Manage Postings</Button>
                    <Button>Create New</Button>
                  </CardFooter>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>School Partnerships</CardTitle>
                    <CardDescription>Your connections with educational institutions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          name: "Stanford University",
                          students: 28,
                          hires: 5,
                          programs: ["Computer Science", "Design"],
                        },
                        {
                          name: "MIT",
                          students: 32,
                          hires: 4,
                          programs: ["Engineering", "Business"],
                        },
                        {
                          name: "UC Berkeley",
                          students: 24,
                          hires: 3,
                          programs: ["Data Science", "Marketing"],
                        },
                      ].map((school, i) => (
                        <div key={i} className="flex gap-4 rounded-lg border p-3">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <GraduationCap className="h-6 w-6" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-medium">{school.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {school.students} students • {school.hires} hires
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {school.programs.map((program, j) => (
                                <Badge key={j} variant="secondary" className="text-xs">
                                  {program}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Manage Partnerships
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Interviews</CardTitle>
                    <CardDescription>Your scheduled candidate interviews</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="today">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="today">Today</TabsTrigger>
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                      </TabsList>
                      <TabsContent value="today" className="space-y-4 pt-4">
                        {[
                          {
                            name: "Maria Garcia",
                            position: "Software Developer Intern",
                            time: "2:00 PM - 3:00 PM",
                            interviewer: "John Smith",
                          },
                          {
                            name: "David Lee",
                            position: "UX Design Intern",
                            time: "3:30 PM - 4:30 PM",
                            interviewer: "Sarah Johnson",
                          },
                          {
                            name: "Alex Rodriguez",
                            position: "Marketing Intern",
                            time: "5:00 PM - 6:00 PM",
                            interviewer: "Michael Brown",
                          },
                        ].map((interview, i) => (
                          <div key={i} className="flex justify-between rounded-lg border p-3">
                            <div className="space-y-1">
                              <h4 className="font-medium">{interview.name}</h4>
                              <p className="text-xs text-muted-foreground">{interview.position}</p>
                              <p className="text-xs text-muted-foreground">{interview.time}</p>
                              <p className="text-xs text-muted-foreground">Interviewer: {interview.interviewer}</p>
                            </div>
                            <div className="flex flex-col items-end justify-between">
                              <Badge>Today</Badge>
                              <Button variant="outline" size="sm">
                                Prepare
                              </Button>
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                      <TabsContent value="upcoming" className="pt-4">
                        <div className="space-y-4">
                          {[
                            {
                              name: "Emily Chen",
                              position: "Data Science Intern",
                              date: "May 12",
                              time: "10:00 AM - 11:00 AM",
                              interviewer: "Robert Wilson",
                            },
                            {
                              name: "James Taylor",
                              position: "Product Management Intern",
                              date: "May 13",
                              time: "1:00 PM - 2:00 PM",
                              interviewer: "Lisa Anderson",
                            },
                          ].map((interview, i) => (
                            <div key={i} className="flex justify-between rounded-lg border p-3">
                              <div className="space-y-1">
                                <h4 className="font-medium">{interview.name}</h4>
                                <p className="text-xs text-muted-foreground">{interview.position}</p>
                                <p className="text-xs text-muted-foreground">
                                  {interview.date}, {interview.time}
                                </p>
                                <p className="text-xs text-muted-foreground">Interviewer: {interview.interviewer}</p>
                              </div>
                              <div className="flex flex-col items-end justify-between">
                                <Badge variant="outline">{interview.date}</Badge>
                                <Button variant="outline" size="sm">
                                  Reschedule
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Calendar
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics</CardTitle>
                    <CardDescription>Internship program performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Application Conversion Rate</h4>
                          <span className="text-sm font-medium">24.6%</span>
                        </div>
                        <Progress value={24.6} />
                        <p className="text-xs text-muted-foreground">+2.4% from last quarter</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Offer Acceptance Rate</h4>
                          <span className="text-sm font-medium">78.3%</span>
                        </div>
                        <Progress value={78.3} />
                        <p className="text-xs text-muted-foreground">+5.1% from last quarter</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Intern Satisfaction</h4>
                          <span className="text-sm font-medium">92.7%</span>
                        </div>
                        <Progress value={92.7} />
                        <p className="text-xs text-muted-foreground">+1.3% from last quarter</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Conversion to Full-Time</h4>
                          <span className="text-sm font-medium">42.1%</span>
                        </div>
                        <Progress value={42.1} />
                        <p className="text-xs text-muted-foreground">+3.7% from last quarter</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" className="flex gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                    <Button>Full Report</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

