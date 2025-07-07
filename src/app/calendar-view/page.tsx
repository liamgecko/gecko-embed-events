import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, Clock, MapPin, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { events, getCategoryColor } from '@/lib/events-data'

const getEventsForDate = (date: string) => {
  return events.filter(event => event.date === date)
}

const CalendarView = () => {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const formatDate = (day: number, month: number, year: number) => {
    const date = new Date(year, month, day)
    return date.toISOString().split('T')[0]
  }

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear)
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Overview
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Calendar View</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Event Calendar</h2>
            <p className="text-slate-600">Browse events by date in a traditional calendar layout</p>
          </div>

          {/* Calendar Navigation */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900">
                  {monthNames[currentMonth]} {currentYear}
                </h3>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day Headers */}
                {dayNames.map(day => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-slate-600 bg-slate-50 rounded-lg">
                    {day}
                  </div>
                ))}

                {/* Empty cells for days before the first day of the month */}
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                  <div key={`empty-${index}`} className="p-3 min-h-[80px] bg-slate-50 rounded-lg"></div>
                ))}

                {/* Calendar days */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1
                  const dateString = formatDate(day, currentMonth, currentYear)
                  const dayEvents = getEventsForDate(dateString)
                  const isToday = day === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear()

                  return (
                    <div 
                      key={day}
                      className={`p-3 min-h-[80px] border border-slate-200 rounded-lg ${
                        isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
                      }`}
                    >
                      <div className={`text-sm font-medium mb-2 ${
                        isToday ? 'text-blue-600' : 'text-slate-900'
                      }`}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.map(event => (
                          <div 
                            key={event.id}
                            className="text-xs p-1 rounded bg-slate-100 hover:bg-slate-200 cursor-pointer transition-colors"
                            title={`${event.title} - ${event.time}`}
                          >
                            <div className="font-medium text-slate-900 truncate">
                              {event.title}
                            </div>
                            <div className="text-slate-600 truncate">
                              {event.time}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events List */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.slice(0, 5).map(event => (
                  <div key={event.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-slate-900">
                          {new Date(event.date).getDate()}
                        </div>
                        <div className="text-xs text-slate-600 uppercase">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">{event.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{event.attendees} attending</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className={getCategoryColor(event.category)}>
                        {event.category}
                      </Badge>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">{event.price}</div>
                      </div>
                      <Button size="sm">
                        Add to booking
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CalendarView 