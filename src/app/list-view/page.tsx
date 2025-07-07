'use client'

import Link from 'next/link'
import { ArrowLeft, Clock, MapPin, Users, Video, CalendarX2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Filters, FilterState } from '@/components/ui/filters'
import { filterEvents, getUniqueTags, getUniqueDates, getUniqueLocations, getUniqueTypes } from '@/lib/filter-utils'
import { events } from '@/lib/events-data'
import { useState } from 'react'

export default function ListView() {
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
        <div className="container mx-auto p-4">
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
            <h1 className="text-2xl font-bold text-slate-900">List View</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Sessions</h2>
            <p className="text-slate-600">Browse sessions in a clean, organised list format</p>
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

            {/* Events List */}
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
                              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
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
                            {event.type === "Online" ? (
                              <>
                                <Video className="w-4 h-4" />
                                <span>Online</span>
                              </>
                            ) : (
                              <>
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>
                              {event.attendees === 0 
                                ? event.waitlistSpaces 
                                  ? `${event.waitlistSpaces} waitlist spaces` 
                                  : "Session full"
                                : `${event.attendees} spaces available`
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {(event.attendees > 0 || event.waitlistSpaces) && (
                      <div className="flex items-center gap-3">
                        <Button size="sm" variant={event.attendees === 0 ? "secondary" : "default"}>
                          {event.attendees === 0 ? "Join waitlist" : "Add to booking"}
                        </Button>
                      </div>
                    )}
                  </div>
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