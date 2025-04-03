import {
  BarChart3,
  BookOpen,
  Briefcase,
  Calendar,
  Clock,
  GraduationCap,
  MessageSquare,
  Search,
  Star,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getRecommendedInternships } from "@/lib/db/student"
import { getMicroInternships } from "@/lib/db/micro-internships"
import { MicroInternshipCard } from "@/components/micro-internships/micro-internship-card"

export default async function StudentDashboard() {
  const studentId = "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6" // Replace with actual student ID
  const recommendedInternships = await getRecommendedInternships(studentId)
  const microInternships = await getMicroInternships(3)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">InternLink</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="outline" size="icon">
              <MessageSquare className="h-4 w-4" />
              <span className="sr-only">Messages</span>
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 lg:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <div className="flex items-center gap-2 px-2 py-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">Jane Doe</div>
                <div className="text-xs text-muted-foreground">Computer Science Student</div>
              </div>
            </div>
            <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
              <Button variant="ghost" className="justify-start gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="justify-start gap-2">
                <Briefcase className="h-4 w-4" />
                Internships
              </Button>
              <Button variant="ghost" className="justify-start gap-2">
                <BookOpen className="h-4 w-4" />
                Learning
              </Button>
              <Button variant="ghost" className="justify-start gap-2">
                <MessageSquare className="h-4 w-4" />
                Messages
              </Button>
              <Button variant="ghost" className="justify-start gap-2">
                <Calendar className="h-4 w-4" />
                Applications
              </Button>
              <Button variant="ghost" className="justify-start gap-2">
                <User className="h-4 w-4" />
                Profile
              </Button>
            </nav>
          </div>
        </aside>
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <div className="grid gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, Jane! Here's what's happening with your internship journey.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">85%</div>
                    <Progress value={85} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">Complete your profile to improve matching</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Applications</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">7</div>
                    <p className="text-xs text-muted-foreground mt-2">3 in review, 2 interviews scheduled</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Skill Assessment</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4/6</div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Complete 2 more assessments to unlock premium matches
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24.5</div>
                    <p className="text-xs text-muted-foreground mt-2">Hours spent on skill development this month</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Recommended Internships</CardTitle>
                    <CardDescription>Based on your skills, interests, and career goals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recommendedInternships.map((job, i) => (
                        <div key={i} className="flex flex-col gap-2 rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{job.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {job.company.user.name} • {job.location}
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-primary/10 text-primary">
                              {job.matchPercentage}% Match
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {job.requiredSkills.map((skill, j) => (
                              <Badge key={j} variant="secondary" className="text-xs">
                                {skill.skill.name}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              Save
                            </Button>
                            <Button size="sm">Apply</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Recommendations
                    </Button>
                  </CardFooter>
                </Card>
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Skill Development</CardTitle>
                    <CardDescription>Track your progress and identify areas for improvement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { skill: "UI/UX Design", progress: 75, level: "Intermediate" },
                        { skill: "JavaScript", progress: 60, level: "Intermediate" },
                        { skill: "React", progress: 45, level: "Beginner" },
                        { skill: "Project Management", progress: 80, level: "Advanced" },
                        { skill: "Data Analysis", progress: 30, level: "Beginner" },
                      ].map((skill, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{skill.skill}</div>
                              <div className="text-xs text-muted-foreground">{skill.level}</div>
                            </div>
                            <div className="text-sm font-medium">{skill.progress}%</div>
                          </div>
                          <Progress value={skill.progress} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Take Assessment</Button>
                    <Button>Start Learning</Button>
                  </CardFooter>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Micro-Internship Opportunities</CardTitle>
                    <CardDescription>Short-term projects that fit your schedule</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {microInternships.map((microInternship) => (
                        <MicroInternshipCard key={microInternship.id} microInternship={microInternship} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Workshops, webinars, and networking opportunities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Tech Career Fair",
                          date: "May 15, 2025",
                          time: "10:00 AM - 4:00 PM",
                          location: "Virtual",
                        },
                        {
                          title: "Resume Workshop",
                          date: "May 18, 2025",
                          time: "2:00 PM - 3:30 PM",
                          location: "Virtual",
                        },
                        {
                          title: "Interview Preparation",
                          date: "May 22, 2025",
                          time: "1:00 PM - 2:30 PM",
                          location: "Virtual",
                        },
                      ].map((event, i) => (
                        <div key={i} className="flex gap-4 rounded-lg border p-3">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <Calendar className="h-6 w-6" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {event.date} • {event.time}
                            </p>
                            <p className="text-xs text-muted-foreground">{event.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Events
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Application Status</CardTitle>
                    <CardDescription>Track your current applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="active">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="interviews">Interviews</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                      </TabsList>
                      <TabsContent value="active" className="space-y-4 pt-4">
                        {[
                          {
                            title: "Marketing Intern",
                            company: "GlobalBrand",
                            status: "In Review",
                            date: "Applied May 2",
                          },
                          {
                            title: "Product Design Intern",
                            company: "DesignHub",
                            status: "In Review",
                            date: "Applied May 5",
                          },
                          {
                            title: "Frontend Developer",
                            company: "WebSolutions",
                            status: "Screening",
                            date: "Applied Apr 28",
                          },
                        ].map((app, i) => (
                          <div key={i} className="flex justify-between rounded-lg border p-3">
                            <div className="space-y-1">
                              <h4 className="font-medium">{app.title}</h4>
                              <p className="text-xs text-muted-foreground">{app.company}</p>
                              <p className="text-xs text-muted-foreground">{app.date}</p>
                            </div>
                            <Badge variant="outline">{app.status}</Badge>
                          </div>
                        ))}
                      </TabsContent>
                      <TabsContent value="interviews" className="pt-4">
                        <div className="space-y-4">
                          {[
                            {
                              title: "UX Research Intern",
                              company: "TechInnovate",
                              date: "May 12, 2:00 PM",
                              type: "Video Interview",
                            },
                            {
                              title: "Data Science Intern",
                              company: "AnalyticsPro",
                              date: "May 15, 11:00 AM",
                              type: "Technical Assessment",
                            },
                          ].map((interview, i) => (
                            <div key={i} className="flex justify-between rounded-lg border p-3">
                              <div className="space-y-1">
                                <h4 className="font-medium">{interview.title}</h4>
                                <p className="text-xs text-muted-foreground">{interview.company}</p>
                                <p className="text-xs text-muted-foreground">{interview.date}</p>
                              </div>
                              <Badge>{interview.type}</Badge>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      <TabsContent value="completed" className="pt-4">
                        <div className="space-y-4">
                          {[
                            {
                              title: "Social Media Intern",
                              company: "CreativeAgency",
                              result: "Rejected",
                              date: "Apr 20",
                            },
                            {
                              title: "Content Writer",
                              company: "PublishCo",
                              result: "Accepted",
                              date: "Apr 15",
                            },
                          ].map((completed, i) => (
                            <div key={i} className="flex justify-between rounded-lg border p-3">
                              <div className="space-y-1">
                                <h4 className="font-medium">{completed.title}</h4>
                                <p className="text-xs text-muted-foreground">{completed.company}</p>
                                <p className="text-xs text-muted-foreground">{completed.date}</p>
                              </div>
                              <Badge variant={completed.result === "Accepted" ? "default" : "secondary"}>
                                {completed.result}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Recommendations</CardTitle>
                    <CardDescription>Courses and resources to enhance your skills</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          title: "UI/UX Fundamentals",
                          provider: "DesignAcademy",
                          duration: "8 hours",
                          relevance: "High match for your applications",
                        },
                        {
                          title: "JavaScript for Beginners",
                          provider: "CodeSchool",
                          duration: "12 hours",
                          relevance: "Trending skill in your field",
                        },
                        {
                          title: "Data Visualization",
                          provider: "DataLearn",
                          duration: "6 hours",
                          relevance: "Recommended by your school",
                        },
                      ].map((course, i) => (
                        <div key={i} className="flex gap-4 rounded-lg border p-3">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <Star className="h-6 w-6" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-medium">{course.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {course.provider} • {course.duration}
                            </p>
                            <p className="text-xs text-primary">{course.relevance}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Learning Center
                    </Button>
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

