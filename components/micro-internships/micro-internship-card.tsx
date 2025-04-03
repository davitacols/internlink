import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Calendar, DollarSign, Briefcase } from "lucide-react"
import Link from "next/link"
import type { MicroInternship } from "@/lib/db/micro-internships"

interface MicroInternshipCardProps {
  microInternship: MicroInternship
}

export function MicroInternshipCard({ microInternship }: MicroInternshipCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold line-clamp-2">{microInternship.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{microInternship.companyName}</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {microInternship.isRemote && (
              <Badge variant="outline" className="text-xs">
                Remote
              </Badge>
            )}
            {microInternship.isFlexibleSchedule && (
              <Badge variant="outline" className="text-xs">
                Flexible
              </Badge>
            )}
            {microInternship.isPaid && (
              <Badge variant="secondary" className="text-xs">
                Paid
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm">
            <Briefcase className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">{microInternship.projectType || "Project"}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">{microInternship.location}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">
              {microInternship.weeklyCommitment ? `${microInternship.weeklyCommitment} hours/week` : "Flexible hours"}
              {microInternship.durationWeeks ? ` · ${microInternship.durationWeeks} weeks` : ""}
            </span>
          </div>
          {microInternship.isPaid && microInternship.compensation && (
            <div className="flex items-center text-sm">
              <DollarSign className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground">{microInternship.compensation}</span>
            </div>
          )}
          <div className="flex items-center text-sm">
            <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">
              Deadline: {new Date(microInternship.deadline).toLocaleDateString()}
            </span>
          </div>
        </div>
        <p className="text-sm line-clamp-3">{microInternship.description}</p>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild className="w-full" size="sm">
          <Link href={`/micro-internships/${microInternship.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

