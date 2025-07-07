'use client'

import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, MapPin, Video, CalendarX2 } from 'lucide-react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Filters, FilterState } from '@/components/ui/filters'
import { filterEvents, getUniqueTags, getUniqueDates, getUniqueLocations, getUniqueTypes, formatDate } from '@/lib/filter-utils'
import { events } from '@/lib/events-data'
import { useState } from 'react'

export default function GridView() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    tags: [],
    dates: [],
    locations: [],
    types: [],
    startTimes: []
  })

  const tags = getUniqueTags(events)
  const dates = getUniqueDates(events)
  const locations = getUniqueLocations(events)
  const types = getUniqueTypes(events)
  const filteredEvents = filterEvents(events, filters)
  return (
    <div className="min-h-screen">
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
            <h1 className="text-2xl font-bold text-slate-900">Grid View</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Sessions</h2>
            <p className="text-slate-600">Browse sessions in a card-based grid layout</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Filters
                filters={filters}
                onFiltersChange={setFilters}
                tags={tags}
                dates={dates}
                locations={locations}
                types={types}
              />
            </div>

            {/* Events Grid */}
            <div className="lg:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-slate-600">
                  Showing {filteredEvents.length} of {events.length} sessions
                </p>
              </div>

              {filteredEvents.length === 0 ? (
                <Alert>
                  <CalendarX2 className="h-4 w-4" />
                  <AlertDescription>
                    No sessions found.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
              <Card 
                key={event.id}
                className="overflow-hidden"
              >
                {/* Image */}
                <div className="relative">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className={`w-full h-48 object-cover ${event.attendees === 0 && !event.waitlistSpaces ? 'opacity-50' : ''}`}
                  />
                  {/* Status Badge */}
                  {event.attendees === 0 && (
                    <div className="absolute top-3 left-3">
                      <Badge className={event.waitlistSpaces ? "bg-orange-100 text-orange-700 rounded-full font-bold" : "bg-pink-100 text-pink-700 rounded-full font-bold"}>
                        {event.waitlistSpaces ? "Waitlist available" : "Session full"}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex-1">
                    <div className="mb-3">
                      <CardTitle className="text-lg line-clamp-2 mb-2">
                        {event.title}
                      </CardTitle>
                      {/* <Badge variant="secondary" className={getCategoryColor(event.category)}>
                        {event.category}
                      </Badge> */}
                    </div>

                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                      {event.type === "Online" ? (
                        <>
                          <Video className="w-4 h-4" />
                          <span>Online</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{event.location}</span>
                        </>
                      )}
                    </div>
                    </div>
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full mt-4"
                    disabled={event.attendees === 0 && !event.waitlistSpaces}
                  >
                    {event.attendees === 0 
                      ? event.waitlistSpaces 
                        ? "Join waitlist" 
                        : "Session full"
                      : "Add to booking"
                    }
                  </Button>
                </CardContent>
              </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 