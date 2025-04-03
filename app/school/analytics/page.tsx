"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Sample data - in a real app, this would come from an API
const placementData = [
  { month: "Jan", placements: 5 },
  { month: "Feb", placements: 8 },
  { month: "Mar", placements: 12 },
  { month: "Apr", placements: 10 },
  { month: "May", placements: 15 },
  { month: "Jun", placements: 18 },
  { month: "Jul", placements: 20 },
  { month: "Aug", placements: 25 },
  { month: "Sep", placements: 22 },
  { month: "Oct", placements: 18 },
  { month: "Nov", placements: 15 },
  { month: "Dec", placements: 10 },
]

const skillsGapData = [
  { name: "JavaScript", demand: 85, supply: 65 },
  { name: "Python", demand: 75, supply: 60 },
  { name: "React", demand: 70, supply: 45 },
  { name: "Data Analysis", demand: 65, supply: 40 },
  { name: "Machine Learning", demand: 60, supply: 30 },
  { name: "UI/UX Design", demand: 55, supply: 50 },
  { name: "Project Management", demand: 50, supply: 45 },
]

const industryData = [
  { name: "Technology", value: 40 },
  { name: "Finance", value: 20 },
  { name: "Healthcare", value: 15 },
  { name: "Education", value: 10 },
  { name: "Manufacturing", value: 8 },
  { name: "Retail", value: 7 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d", "#ffc658"]

export default function SchoolAnalytics() {
  const [activeTab, setActiveTab] = useState("placements")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
      </div>

      <Tabs defaultValue="placements" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="placements">Placements</TabsTrigger>
          <TabsTrigger value="skills">Skills Gap</TabsTrigger>
          <TabsTrigger value="industries">Industries</TabsTrigger>
        </TabsList>

        <TabsContent value="placements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Placements</CardTitle>
              <CardDescription>Monthly internship placements over the past year</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={placementData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="placements" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Placement Rate</CardTitle>
                <CardDescription>Percentage of students who secured internships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-5xl font-bold">68%</div>
                  <p className="text-sm text-muted-foreground mt-2">+12% from previous year</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Time to Placement</CardTitle>
                <CardDescription>Average days from application to acceptance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-5xl font-bold">24</div>
                  <p className="text-sm text-muted-foreground mt-2">Days (5 days faster than last year)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skills Gap Analysis</CardTitle>
              <CardDescription>Comparison between industry demand and student skill supply</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillsGapData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="demand" fill="#8884d8" name="Industry Demand" />
                  <Bar dataKey="supply" fill="#82ca9d" name="Student Supply" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Curriculum Focus</CardTitle>
              <CardDescription>Skills with the largest gaps between demand and supply</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillsGapData
                  .sort((a, b) => b.demand - b.supply - (a.demand - a.supply))
                  .slice(0, 3)
                  .map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{skill.name}</div>
                        <div className="text-sm text-muted-foreground">Gap: {skill.demand - skill.supply}%</div>
                      </div>
                      <div className="text-sm font-medium">Priority {index + 1}</div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="industries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Internship Distribution by Industry</CardTitle>
              <CardDescription>Breakdown of internships by industry sector</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={industryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {industryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Companies by Placements</CardTitle>
              <CardDescription>Companies that hired the most students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">TechCorp Inc.</div>
                  <div>12 students</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Finance Partners LLC</div>
                  <div>8 students</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Healthcare Solutions</div>
                  <div>7 students</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">EdTech Innovations</div>
                  <div>5 students</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Manufacturing Global</div>
                  <div>4 students</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

