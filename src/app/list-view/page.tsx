'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Clock, MapPin, Users, Video, CalendarX2, X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Filters, FilterState } from '@/components/ui/filters'
import { filterEvents, getUniqueTags, getUniqueDates, getUniqueLocations, getUniqueTypes, getClashingSessions, hasClashes, getTotalAvailableSlots, areAllSlotsFull } from '@/lib/filter-utils'
import { events, eventInfo } from '@/lib/events-data'
import { useState } from 'react'
import BookingToast from '@/components/ui/booking-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import SessionDetailModal from '@/components/ui/session-detail-modal'

// Define the booking structure
interface BookedSession {
  eventId: number
  selectedTimeSlot?: string
}

export default function ListView() {
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
  const [activeTab, setActiveTab] = useState("sessions")
  const [hideFullSessions, setHideFullSessions] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    setActiveTab("booking")
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

  const tags = getUniqueTags(events)
  const dates = getUniqueDates(events)
  const locations = getUniqueLocations(events)
  const types = getUniqueTypes(events)
  const filteredEvents = filterEvents(events, filters)
  
  // Filter out full sessions if switch is enabled
  const displayEvents = hideFullSessions 
    ? filteredEvents.filter(event => !isSessionFull(event) || event.waitlistSpaces)
    : filteredEvents
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
        <div className="max-w-6xl mx-auto pb-24">
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

                {/* Events List */}
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
                    <div className="space-y-4">
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
                          <div 
                            key={event.id} 
                            className={`flex items-center justify-between p-4 border rounded-lg ${
                              hasClash && !isBooked ? 'border-orange-300 bg-orange-50' : 
                              shouldGrayOut(event) ? 'border-slate-200 bg-slate-50' :
                              'border-slate-200'
                            }`}
                          >
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
                              <h4 
                                className="font-semibold text-slate-900 mb-1 cursor-pointer hover:underline"
                                onClick={() => handleOpenModal(event)}
                              >
                                {event.title}
                              </h4>
                              <div className="flex sm:flex-row flex-col items-start sm:items-center gap-2 sm:gap-4 text-sm text-slate-600">
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
                                <div className="hidden xl:flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>
                                    {event.isMultiTime 
                                      ? `${getTotalAvailableSlots(event)} spaces available`
                                      : event.attendees === 0 
                                        ? event.waitlistSpaces 
                                          ? `${event.waitlistSpaces} waitlist spaces` 
                                          : "Session full"
                                        : `${event.attendees} spaces available`
                                    }
                                  </span>
                                </div>
                              </div>
                              <div className="flex xl:hidden items-center gap-1 text-sm text-slate-600 mt-4">
                                <Users className="w-4 h-4" />
                                <span>
                                  {event.isMultiTime 
                                    ? `${getTotalAvailableSlots(event)} spaces available`
                                    : event.attendees === 0 
                                      ? event.waitlistSpaces 
                                        ? `${event.waitlistSpaces} waitlist spaces` 
                                        : "Session full"
                                      : `${event.attendees} spaces available`
                                  }
                                </span>
                              </div>
                              {hasClash && !isBooked && (
                                <div className="flex items-center gap-1 text-xs text-orange-700 mt-3">
                                  <AlertTriangle className="w-4 h-4" />
                                  <span>Time clash with booked session</span>
                                </div>
                              )}
                            </div>
                          </div>
                          {(!isSessionFull(event) || event.waitlistSpaces) && (
                            <div className="flex items-center gap-3">
                                                              <Button 
                                  size="sm" 
                                  variant={isSessionFull(event) ? "secondary" : "default"}
                                  onClick={() => {
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
                                      ? "Join waitlist" 
                                      : "Add to booking"
                                  }
                                </Button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                    </div>
                  )}
                </div>
              </div>
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
                      <Alert className="mb-6 border-orange-200 bg-orange-50">
                        <AlertDescription className="text-orange-700">
                          You have selected sessions with overlapping times. Please review your itinerary to ensure you can attend all sessions.
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
                          // Get all selected sessions and sort by date
                          const selectedSessions = bookedSessions.map(booking => events.find(e => e.id === booking.eventId))
                          const sortedSessions = selectedSessions.filter(Boolean).sort((a, b) => new Date(a!.date).getTime() - new Date(b!.date).getTime())

                          // Group sessions by date
                          const sessionsByDate = sortedSessions.reduce((groups, session) => {
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
      
      {/* Booking Toast - Only show on Sessions tab */}
      {activeTab === "sessions" && (
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