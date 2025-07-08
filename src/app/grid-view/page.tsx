'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Clock, MapPin, Video, CalendarX2, Users } from 'lucide-react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Filters, FilterState } from '@/components/ui/filters'
import { filterEvents, getUniqueTags, getUniqueDates, getUniqueLocations, getUniqueTypes, formatDate, getClashingSessions, hasClashes, getTotalAvailableSlots, areAllSlotsFull } from '@/lib/filter-utils'
import { events, eventInfo } from '@/lib/events-data'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import BookingToast from '@/components/ui/booking-toast'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import SessionDetailModal from '@/components/ui/session-detail-modal'

// Define the booking structure
interface BookedSession {
  eventId: number
  selectedTimeSlot?: string
}

export default function GridView() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    sortBy: 'date-asc',
    tags: [],
    dates: [],
    locations: [],
    types: [],
    startTimes: []
  })
  const [bookedSessions, setBookedSessions] = useState<BookedSession[]>([])
  const [activeTab, setActiveTab] = useState('sessions')
  const [hideFullSessions, setHideFullSessions] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const tags = getUniqueTags(events)
  const dates = getUniqueDates(events)
  const locations = getUniqueLocations(events)
  const types = getUniqueTypes(events)
  const filteredEvents = filterEvents(events, filters)
  const displayEvents = hideFullSessions
    ? filteredEvents.filter(event => !isSessionFull(event) || event.waitlistSpaces)
    : filteredEvents

  const handleAddToBooking = (eventId: number, selectedTimeSlot?: string) => {
    setBookedSessions(prev => {
      // Check if already booked
      const existingIndex = prev.findIndex(booking => booking.eventId === eventId)
      if (existingIndex >= 0) {
        // Update existing booking with new time slot if provided
        const updated = [...prev]
        updated[existingIndex] = { eventId, selectedTimeSlot }
        return updated
      }
      // Add new booking
      return [...prev, { eventId, selectedTimeSlot }]
    })
  }
  const handleRemoveFromBooking = (eventId: number) => {
    setBookedSessions(prev => prev.filter(booking => booking.eventId !== eventId))
  }
  const handleProceedToBooking = () => {
    setActiveTab('booking')
  }

  const handleOpenModal = (event: typeof events[0]) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  // Helper function to check if a session is full (handles multi-time sessions)
  const isSessionFull = (event: typeof events[0]) => {
    if (event.isMultiTime) {
      return getTotalAvailableSlots(event) === 0
    }
    return event.attendees === 0 && !event.waitlistSpaces
  }

  // Helper function to check if a session should be visually grayed out
  const shouldGrayOut = (event: typeof events[0]) => {
    if (event.isMultiTime) {
      return areAllSlotsFull(event)
    }
    return event.attendees === 0 && !event.waitlistSpaces
  }

  // Helper function to check if an event is booked
  const isEventBooked = (eventId: number) => {
    return bookedSessions.some(booking => booking.eventId === eventId)
  }

  // Helper function to get selected time slot for an event
  const getSelectedTimeSlot = (eventId: number) => {
    const booking = bookedSessions.find(booking => booking.eventId === eventId)
    return booking?.selectedTimeSlot
  }

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
        <div className="max-w-7xl mx-auto pb-24">
          {/* Event Information */}
          <div className="mb-8">
            <div className="relative h-48 rounded-lg overflow-hidden mb-6">
              <Image 
                src={eventInfo.image} 
                alt={eventInfo.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h1 className="text-3xl font-bold mb-2">{eventInfo.title}</h1>
                <p className="text-lg opacity-90">{eventInfo.date}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-6">
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">About this event</h3>
                <p className="text-slate-600 leading-relaxed">{eventInfo.description}</p>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Event details</h3>
                  <div className="space-y-2 text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{eventInfo.location}</span>
                    </div>
                                                          <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{eventInfo.capacity.toLocaleString()} spaces available</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {eventInfo.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="booking">Booking Form</TabsTrigger>
            </TabsList>

            <TabsContent value="sessions">
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
                      Showing {displayEvents.length} of {events.length} sessions
                    </p>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="hide-full"
                        checked={hideFullSessions}
                        onCheckedChange={setHideFullSessions}
                      />
                      <label htmlFor="hide-full" className="text-sm text-slate-600">
                        Hide full sessions
                      </label>
                    </div>
                  </div>

                  {displayEvents.length === 0 ? (
                    <Alert>
                      <CalendarX2 className="h-4 w-4" />
                      <AlertDescription>
                        No sessions found.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                              {displayEvents.map((event) => {
                          const isBooked = isEventBooked(event.id)
                          const selectedTimeSlot = getSelectedTimeSlot(event.id)
                          const bookedSessionsWithSlots = bookedSessions.map(booking => ({
                            event: events.find(e => e.id === booking.eventId)!,
                            selectedTimeSlot: booking.selectedTimeSlot
                          }))
                          const clashingSessions = getClashingSessions(event, bookedSessionsWithSlots, selectedTimeSlot)
                          const hasClash = clashingSessions.length > 0
                        return (
                          <Card 
                            key={event.id}
                            className={`h-full overflow-hidden ${hasClash && !isBooked ? 'border-orange-300' : ''}`}
                          >
                            {/* Image */}
                            <div className="relative h-40">
                              <Image 
                                src={event.image || '/placeholder-image.jpg'} 
                                alt={event.title}
                                fill
                                className={`object-cover ${shouldGrayOut(event) ? 'opacity-50' : ''}`}
                              />
                              {/* Status Badge */}
                              {shouldGrayOut(event) && (
                                <div className="absolute top-3 left-3">
                                  <Badge className={event.waitlistSpaces ? "bg-orange-100 text-orange-700 rounded-full font-bold" : "bg-pink-100 text-pink-700 rounded-full font-bold"}>
                                    {event.waitlistSpaces ? "Waitlist available" : "Session full"}
                                  </Badge>
                                </div>
                              )}
                              {/* Clash Warning Bar */}
                              {hasClash && !isBooked && (
                                <div className="absolute bottom-0 left-0 right-0 bg-orange-100 text-orange-700 text-center py-1 px-2 text-xs font-medium">
                                  Time clash with booked session
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <CardContent className="p-6 flex flex-col flex-1">
                              <div className="flex-1">
                                <div className="mb-3">
                                  <CardTitle 
                                    className="text-base line-clamp-2 mb-2 leading-tight cursor-pointer hover:underline"
                                    onClick={() => handleOpenModal(event)}
                                  >
                                    {event.title}
                                  </CardTitle>
                                </div>

                                <p className="text-slate-600 text-sm mb-4">
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

                              {/* Booking Button with Tooltip for clashes */}
                              {hasClash && !isBooked ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span>
                                      <Button
                                        size="sm"
                                        className="w-full mt-4"
                                        variant={isSessionFull(event) ? "secondary" : isEventBooked(event.id) ? "outline" : "default"}
                                        disabled
                                        aria-disabled
                                      >
                                        {isEventBooked(event.id)
                                          ? "Remove from booking"
                                          : isSessionFull(event)
                                            ? event.waitlistSpaces
                                              ? "Join waitlist"
                                              : "Session full"
                                            : "Add to booking"
                                        }
                                      </Button>
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom">
                                    Remove <span className="font-semibold">{clashingSessions[0]?.title ?? 'clashing'}</span> in order to book
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                <Button
                                  size="sm"
                                  className="w-full mt-4"
                                  variant={isSessionFull(event) ? "secondary" : isEventBooked(event.id) ? "outline" : "default"}
                                  disabled={isSessionFull(event) && !event.waitlistSpaces}
                                  aria-disabled={isSessionFull(event) && !event.waitlistSpaces}
                                  onClick={() => {
                                    if (isSessionFull(event) && !event.waitlistSpaces) return
                                    if (isEventBooked(event.id)) {
                                      handleRemoveFromBooking(event.id)
                                    } else if (event.isMultiTime) {
                                      // For multi-time sessions, open modal to select time slot
                                      handleOpenModal(event)
                                    } else {
                                      handleAddToBooking(event.id)
                                    }
                                  }}
                                >
                                  {isEventBooked(event.id)
                                    ? "Remove from booking"
                                    : isSessionFull(event)
                                      ? event.waitlistSpaces
                                        ? "Join waitlist"
                                        : "Session full"
                                      : "Add to booking"
                                  }
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
              {/* Booking Toast - Only show on Sessions tab */}
              {activeTab === "sessions" && (
                <BookingToast 
                  sessionCount={bookedSessions.length}
                  onProceedToBooking={handleProceedToBooking}
                />
              )}
            </TabsContent>

            <TabsContent value="booking">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Booking form</h3>
                  <p className="text-slate-600 mb-6">
                    {bookedSessions.length === 0 
                      ? "No sessions selected for booking. Please add sessions from the Sessions tab."
                      : `You have ${bookedSessions.length} session${bookedSessions.length === 1 ? '' : 's'} selected for booking.`
                    }
                  </p>
                                      {(() => {
                      const selectedSessions = bookedSessions.map(booking => ({
                        event: events.find(e => e.id === booking.eventId)!,
                        selectedTimeSlot: booking.selectedTimeSlot
                      }))
                      const hasClash = hasClashes(selectedSessions)
                    return hasClash ? (
                      <Alert className="mb-6 border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700">
                          ⚠️ You have selected sessions with overlapping times. Please review your itinerary and remove conflicting sessions.
                        </AlertDescription>
                      </Alert>
                    ) : null
                  })()}
                  <div className="space-y-6">
                    {/* Contact Information Form */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-slate-900">Contact Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
                            First Name
                          </label>
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="Enter your first name"
                            className="w-full"
                            disabled={bookedSessions.length === 0}
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">
                            Last Name
                          </label>
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Enter your last name"
                            className="w-full"
                            disabled={bookedSessions.length === 0}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          className="w-full"
                          disabled={bookedSessions.length === 0}
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                          Phone Number
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          className="w-full"
                          disabled={bookedSessions.length === 0}
                        />
                      </div>
                    </div>
                    {/* Sessions Section */}
                    {bookedSessions.length > 0 && (
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-slate-900 mb-4">Your itinerary</h4>
                        {(() => {
                          const selectedSessions = bookedSessions.map(booking => events.find(e => e.id === booking.eventId))
                          const sessionsByDate = selectedSessions.reduce((groups, session) => {
                            const date = session!.date
                            if (!groups[date]) {
                              groups[date] = []
                            }
                            groups[date].push(session!)
                            return groups
                          }, {} as Record<string, typeof events>)
                          return (
                            <div className="space-y-4">
                              {Object.entries(sessionsByDate).map(([date, sessions]) => (
                                <div key={date}>
                                  <h5 className="text-xs text-slate-500 mb-2">
                                    {new Date(date).toLocaleDateString('en-US', { 
                                      weekday: 'long',
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </h5>
                                  <div className="space-y-2">
                                    {sessions.map((session) => (
                                      <div key={session.id} className="flex items-center justify-between">
                                        <div className="text-sm text-slate-900">
                                          {session.title} ({session.time})
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleRemoveFromBooking(session.id)}
                                          className="h-6 w-6 p-0 text-slate-500 hover:text-slate-700"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        })()}
                      </div>
                    )}
                    <div className="pt-4">
                      <Button className="w-full" disabled={bookedSessions.length === 0}>
                        Complete Booking
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {activeTab === 'sessions' && (
        <BookingToast
          sessionCount={bookedSessions.length}
          onProceedToBooking={handleProceedToBooking}
        />
      )}

      {/* Session Detail Modal */}
      <SessionDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToBooking={(eventId, selectedTimeSlot) => handleAddToBooking(eventId, selectedTimeSlot)}
        onRemoveFromBooking={handleRemoveFromBooking}
        isBooked={selectedEvent ? isEventBooked(selectedEvent.id) : false}
        hasClash={selectedEvent ? getClashingSessions(selectedEvent, bookedSessions.map(booking => ({
          event: events.find(e => e.id === booking.eventId)!,
          selectedTimeSlot: booking.selectedTimeSlot
        })), getSelectedTimeSlot(selectedEvent.id)).length > 0 : false}
        clashingSessions={selectedEvent ? getClashingSessions(selectedEvent, bookedSessions.map(booking => ({
          event: events.find(e => e.id === booking.eventId)!,
          selectedTimeSlot: booking.selectedTimeSlot
        })), getSelectedTimeSlot(selectedEvent.id)) : []}
      />
    </div>
  )
} 