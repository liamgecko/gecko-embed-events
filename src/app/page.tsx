import Link from 'next/link'
import { Calendar, Grid3X3, List } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Gecko Events Platform
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Explore different ways to embed our events platform on your website. 
            Choose the view that best fits your design and user experience needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* List View Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center w-10 h-10 bg-slate-950 rounded-sm mb-4">
                <List className="w-6 h-6 text-slate-100" />
              </div>
              <CardTitle className="text-2xl">List View</CardTitle>
              <CardDescription className="text-base">
                Clean, vertical layout perfect for detailed event information. 
                Great for event-heavy websites with lots of details to display.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Button asChild className="w-full">
                <Link href="/list-view">
                  View Demo →
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Grid View Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center w-10 h-10 bg-slate-950 rounded-sm mb-4">
                <Grid3X3 className="w-6 h-6 text-slate-100" />
              </div>
              <CardTitle className="text-2xl">Grid View</CardTitle>
              <CardDescription className="text-base">
                Card-based layout that showcases events visually. 
                Ideal for image-rich events and modern website designs.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Button asChild className="w-full">
                <Link href="/grid-view">
                  View Demo →
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Calendar View Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center w-10 h-10 bg-slate-950 rounded-sm mb-4">
                <Calendar className="w-6 h-6 text-slate-100" />
              </div>
              <CardTitle className="text-2xl">Calendar View</CardTitle>
              <CardDescription className="text-base">
                Traditional calendar layout for easy date navigation. 
                Perfect for recurring events and date-focused browsing.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Button asChild className="w-full">
                <Link href="/calendar-view">
                  View Demo →
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <p className="text-slate-500 text-sm">
            Each view is fully responsive and customizable to match your brand
          </p>
        </div>
      </div>
    </div>
  )
}
