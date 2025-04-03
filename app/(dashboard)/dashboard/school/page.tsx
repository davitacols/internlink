import { Download, GraduationCap, LineChart, PieChart, User, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/dashboard/header"
import { SchoolSidebar } from "@/components/dashboard/school-sidebar"

export default function SchoolDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header userType="school" />
      <div className="flex flex-1">
        <SchoolSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <div className="grid gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">School Dashboard</h1>
                <p className="text-muted-foreground">Monitor student placements and program effectiveness.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">78.4%</div>
                    <p className="text-xs text-muted-foreground mt-2">+5.2% from last year</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Interns</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">342</div>
                    <p className="text-xs text-muted-foreground mt-2">Across 87 companies</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Partner Companies</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">124</div>
                    <p className="text-xs text-muted-foreground mt-2">12 new partners this quarter</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Feedback</CardTitle>
                    <LineChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.7/5</div>
                    <p className="text-xs text-muted-foreground mt-2">Based on 256 student reviews</p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Placement Statistics</CardTitle>
                    <CardDescription>Student internship placement by department</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { department: "Computer Science", students: 124, placed: 108, rate: 87 },
                        { department: "Business Administration", students: 98, placed: 72, rate: 73 },
                        { department: "Engineering", students: 112, placed: 94, rate: 84 },
                        { department: "Design", students: 76, placed: 58, rate: 76 },
                        { department: "Marketing", students: 84, placed: 62, rate: 74 },
                      ].map((dept, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{dept.department}</h4>
                              <p className="text-xs text-muted-foreground">
                                {dept.placed} of {dept.students} students placed
                              </p>
                            </div>
                            <div className="text-sm font-medium">{dept.rate}%</div>
                          </div>
                          <Progress value={dept.rate} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" className="flex gap-2">
                      <Download className="h-4 w-4" />
                      Export Data
                    </Button>
                    <Button>View Details</Button>
                  </CardFooter>
                </Card>
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>In-Demand Skills</CardTitle>
                    <CardDescription>Most requested skills from partner companies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { skill: "Data Analysis", demand: 92, trend: "up" },
                        { skill: "UX/UI Design", demand: 87, trend: "up" },
                        { skill: "Full-Stack Development", demand: 85, trend: "up" },
                        { skill: "Digital Marketing", demand: 78, trend: "up" },
                        { skill: "Project Management", demand: 76, trend: "up" },
                        { skill: "Cloud Computing", demand: 72, trend: "up" },
                        { skill: "Machine Learning", demand: 68, trend: "up" },
                      ].map((skill, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{skill.skill}</span>
                            <span>Demand: {skill.demand}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-primary/20">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${skill.demand}%` }} />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {skill.trend === "up" ? "↑" : "↓"} {Math.floor(Math.random() * 10) + 1}% from last quarter
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Curriculum Alignment Report
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Partner Companies</CardTitle>
                    <CardDescription>Companies with the most student placements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "TechCorp", industry: "Technology", students: 28, rating: 4.8 },
                        { name: "GlobalFinance", industry: "Finance", students: 24, rating: 4.6 },
                        { name: "DesignStudio", industry: "Design", students: 22, rating: 4.9 },
                        { name: "MarketingPro", industry: "Marketing", students: 18, rating: 4.5 },
                        { name: "HealthInnovate", industry: "Healthcare", students: 16, rating: 4.7 },
                      ].map((company, i) => (
                        <div key={i} className="flex justify-between rounded-lg border p-3">
                          <div className="space-y-1">
                            <h4 className="font-medium">{company.name}</h4>
                            <p className="text-xs text-muted-foreground">{company.industry}</p>
                            <p className="text-xs text-muted-foreground">{company.students} students placed</p>
                          </div>
                          <div className="flex flex-col items-end justify-between">
                            <Badge variant="outline" className="bg-primary/10 text-primary">
                              {company.rating}/5
                            </Badge>
                            <Button variant="ghost" size="sm">
                              Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Partners
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Academic Credit Integration</CardTitle>
                    <CardDescription>Internships integrated with curriculum</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="overview">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="programs">Programs</TabsTrigger>
                      </TabsList>
                      <TabsContent value="overview" className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="rounded-lg border p-3">
                            <div className="text-2xl font-bold">78%</div>
                            <div className="text-xs text-muted-foreground">Internships for Credit</div>
                          </div>
                          <div className="rounded-lg border p-3">
                            <div className="text-2xl font-bold">24</div>
                            <div className="text-xs text-muted-foreground">Integrated Courses</div>
                          </div>
                          <div className="rounded-lg border p-3">
                            <div className="text-2xl font-bold">3.8</div>
                            <div className="text-xs text-muted-foreground">Avg. Credits Earned</div>
                          </div>
                          <div className="rounded-lg border p-3">
                            <div className="text-2xl font-bold">92%</div>
                            <div className="text-xs text-muted-foreground">Completion Rate</div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="programs" className="pt-4">
                        <div className="space-y-4">
                          {[
                            {
                              name: "Computer Science Practicum",
                              credits: 4,
                              students: 42,
                              companies: 18,
                            },
                            {
                              name: "Business Internship",
                              credits: 3,
                              students: 38,
                              companies: 15,
                            },
                            {
                              name: "Engineering Co-op",
                              credits: 6,
                              students: 32,
                              companies: 12,
                            },
                            {
                              name: "Design Studio",
                              credits: 3,
                              students: 28,
                              companies: 10,
                            },
                          ].map((program, i) => (
                            <div key={i} className="rounded-lg border p-3">
                              <h4 className="font-medium">{program.name}</h4>
                              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                                <span>{program.credits} credits</span>
                                <span>{program.students} students</span>
                                <span>{program.companies} companies</span>
                              </div>
                              <Button variant="ghost" size="sm" className="mt-2 w-full">
                                Manage
                              </Button>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Curriculum Integration
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Outcome Analytics</CardTitle>
                    <CardDescription>Post-internship student outcomes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <div className="relative h-40 w-40">
                          <PieChart className="h-40 w-40 text-primary/20" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold">68%</span>
                            <span className="text-xs text-muted-foreground">Job Offers</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-primary" />
                            <span className="text-sm">Full-time Offers</span>
                          </div>
                          <span className="text-sm font-medium">42%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-primary/70" />
                            <span className="text-sm">Extended Internships</span>
                          </div>
                          <span className="text-sm font-medium">26%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-primary/40" />
                            <span className="text-sm">No Immediate Offer</span>
                          </div>
                          <span className="text-sm font-medium">32%</span>
                        </div>
                      </div>
                      <div className="rounded-lg border p-3">
                        <h4 className="font-medium">Salary Insights</h4>
                        <p className="text-xs text-muted-foreground">
                          Average starting salary for graduates with internship experience
                        </p>
                        <div className="mt-2 text-2xl font-bold">$68,500</div>
                        <p className="text-xs text-primary">+12% compared to non-interns</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Full Outcomes Report
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

