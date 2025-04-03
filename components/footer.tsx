import Link from "next/link"
import { Briefcase } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Briefcase className="h-6 w-6" />
              <span className="font-bold text-xl">InternLink</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Connecting students with career-building internship opportunities and helping companies discover top
              talent.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-4">For Students</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/internships" className="text-muted-foreground hover:text-foreground">
                  Browse Internships
                </Link>
              </li>
              <li>
                <Link href="/resources/students" className="text-muted-foreground hover:text-foreground">
                  Career Resources
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-muted-foreground hover:text-foreground">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">For Companies</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/post-internship" className="text-muted-foreground hover:text-foreground">
                  Post an Internship
                </Link>
              </li>
              <li>
                <Link href="/resources/companies" className="text-muted-foreground hover:text-foreground">
                  Hiring Resources
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} InternLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

