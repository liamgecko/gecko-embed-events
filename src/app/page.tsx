import Link from 'next/link'
import { FileText, ArrowLeftRight } from 'lucide-react'
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

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Form Field Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center w-10 h-10 bg-slate-950 rounded-sm mb-4">
                <FileText className="w-6 h-6 text-slate-100" />
              </div>
              <CardTitle className="text-2xl">Form Field</CardTitle>
              <CardDescription className="text-base">
                Comprehensive form components and field types for user registration and data collection. 
                Perfect for collecting user information and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Button asChild className="w-full">
                <Link href="/form-field">
                  View Demo →
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Embedded Event Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center w-10 h-10 bg-slate-950 rounded-sm mb-4">
                <ArrowLeftRight className="w-6 h-6 text-slate-100" />
              </div>
              <CardTitle className="text-2xl">Embedded Event</CardTitle>
              <CardDescription className="text-base">
                An all-in-one session view solution enabling users to switch between different viewing modes seamlessly.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Button asChild className="w-full">
                <Link href="/embedded-event">
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
