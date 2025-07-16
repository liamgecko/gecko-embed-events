'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Clock, MapPin, Users, Video, CalendarX2, AlertTriangle, ListFilter, ChevronDown, Search, X, List, Grid3X3, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { getClashingSessions, getTotalAvailableSlots, areAllSlotsFull, filterEvents, getUniqueTags, getUniqueDates, getUniqueLocations, getUniqueTypes } from '@/lib/filter-utils'
import { events, eventInfo } from '@/lib/events-data'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import SessionDetailModal from '@/components/ui/session-detail-modal'
import TimeSlotModal from '@/components/ui/time-slot-modal'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

// Define the booking structure
interface BookedSession {
  eventId: number
  selectedTimeSlot?: string
}

interface FilterState {
  search: string
  sortBy: string
  tags: string[]
  dates: string[]
  locations: string[]
  types: string[]
  startTimes: string[]
}

export default function FormFieldView() {
  const [bookedSessions, setBookedSessions] = useState<BookedSession[]>([])
  const [hideFullSessions, setHideFullSessions] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTimeSlotModalOpen, setIsTimeSlotModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    sortBy: 'date-asc',
    tags: [],
    dates: [],
    locations: [],
    types: [],
    startTimes: []
  })
  const sessionsPerPage = 10

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

  const handleOpenModal = (event: typeof events[0]) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  const handleOpenTimeSlotModal = (event: typeof events[0]) => {
    setSelectedEvent(event)
    setIsTimeSlotModalOpen(true)
  }

  const handleCloseTimeSlotModal = () => {
    setIsTimeSlotModalOpen(false)
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

  // Filter handling
  const handleFilterChange = (filterType: keyof FilterState, value: string, checked: boolean, e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    
    setFilters(prev => {
      const currentValues = prev[filterType] as string[]
      let newValues: string[]
      
      if (checked) {
        newValues = [...currentValues, value]
      } else {
        newValues = currentValues.filter(v => v !== value)
      }
      
      return {
        ...prev,
        [filterType]: newValues
      }
    })
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleSortChange = (sortBy: string, e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    
    setFilters(prev => ({ ...prev, sortBy }))
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      sortBy: 'date-asc',
      tags: [],
      dates: [],
      locations: [],
      types: [],
      startTimes: []
    })
    setCurrentPage(1)
    setIsFilterOpen(false) // Close dropdown when clearing all filters
  }

  // Get filter options
  const tags = getUniqueTags(events)
  const dates = getUniqueDates(events)
  const locations = getUniqueLocations(events)
  const types = getUniqueTypes(events)

  // Apply filters
  const filteredEvents = filterEvents(events, filters)
  
  // Filter out full sessions if switch is enabled
  const displayEvents = hideFullSessions 
    ? filteredEvents.filter(event => !isSessionFull(event) || event.waitlistSpaces)
    : filteredEvents

  // Calculate pagination
  const totalPages = Math.ceil(displayEvents.length / sessionsPerPage)
  const startIndex = (currentPage - 1) * sessionsPerPage
  const endIndex = startIndex + sessionsPerPage
  const paginatedEvents = displayEvents.slice(startIndex, endIndex)

  // Reset to first page when filters change
  const handleHideFullSessionsChange = (checked: boolean) => {
    setHideFullSessions(checked)
    setCurrentPage(1)
  }

  // Count active filters (excluding sort)
  const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
    // Skip the sortBy field
    if (key === 'sortBy') return count
    
    if (Array.isArray(value)) {
      return count + value.length
    }
    return count + (value ? 1 : 0)
  }, 0)

  return (
    <div className="min-h-screen bg-white">
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
            <h1 className="text-2xl font-bold text-slate-900">Form Field View</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto my-6 px-6">
        {/* Session List */}
        <Card>
          <CardHeader>
            <CardTitle>{eventInfo.title}</CardTitle>
            <p className="text-sm text-slate-600">{eventInfo.date}</p>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Filter Dropdown */}
                <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="relative cursor-pointer">
                      <ListFilter className="h-4 w-4" />
                      {activeFilterCount > 0 && (
                        <span className="absolute -top-2 -right-2 rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56" onCloseAutoFocus={(e) => e.preventDefault()}>
                    <DropdownMenuLabel>Filter sessions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* Search Input */}
                    <div className="p-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                          placeholder="Search sessions..."
                          value={filters.search}
                          onChange={(e) => {
                            setFilters(prev => ({ ...prev, search: e.target.value }))
                            setCurrentPage(1)
                          }}
                          className="h-8 pl-8"
                        />
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    
                    {/* Tags Filter */}
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <span>Tags</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {tags.length > 6 ? (
                          <ScrollArea className="h-[300px]">
                            {tags.map((tag) => (
                              <DropdownMenuCheckboxItem
                                key={tag}
                                checked={filters.tags.includes(tag)}
                                onCheckedChange={(checked) => handleFilterChange('tags', tag, checked)}
                                onSelect={(e) => e.preventDefault()}
                                className="cursor-pointer"
                              >
                                {tag}
                              </DropdownMenuCheckboxItem>
                            ))}
                          </ScrollArea>
                        ) : (
                          <>
                            {tags.map((tag) => (
                              <DropdownMenuCheckboxItem
                                key={tag}
                                checked={filters.tags.includes(tag)}
                                onCheckedChange={(checked) => handleFilterChange('tags', tag, checked)}
                                onSelect={(e) => e.preventDefault()}
                                className="cursor-pointer"
                              >
                                {tag}
                              </DropdownMenuCheckboxItem>
                            ))}
                          </>
                        )}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    {/* Dates Filter */}
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <span>Dates</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {dates.length > 6 ? (
                          <ScrollArea className="h-[300px]">
                            {dates.map((date) => (
                              <DropdownMenuCheckboxItem
                                key={date}
                                checked={filters.dates.includes(date)}
                                onCheckedChange={(checked) => handleFilterChange('dates', date, checked)}
                                onSelect={(e) => e.preventDefault()}
                                className="cursor-pointer"
                              >
                                {date}
                              </DropdownMenuCheckboxItem>
                            ))}
                          </ScrollArea>
                        ) : (
                          <>
                            {dates.map((date) => (
                              <DropdownMenuCheckboxItem
                                key={date}
                                checked={filters.dates.includes(date)}
                                onCheckedChange={(checked) => handleFilterChange('dates', date, checked)}
                                onSelect={(e) => e.preventDefault()}
                                className="cursor-pointer"
                              >
                                {date}
                              </DropdownMenuCheckboxItem>
                            ))}
                          </>
                        )}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    {/* Locations Filter */}
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <span>Locations</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {locations.length > 6 ? (
                          <ScrollArea className="h-[300px]">
                            {locations.map((location) => (
                              <DropdownMenuCheckboxItem
                                key={location}
                                checked={filters.locations.includes(location)}
                                onCheckedChange={(checked) => handleFilterChange('locations', location, checked)}
                                onSelect={(e) => e.preventDefault()}
                                className="cursor-pointer"
                              >
                                {location}
                              </DropdownMenuCheckboxItem>
                            ))}
                          </ScrollArea>
                        ) : (
                          <>
                            {locations.map((location) => (
                              <DropdownMenuCheckboxItem
                                key={location}
                                checked={filters.locations.includes(location)}
                                onCheckedChange={(checked) => handleFilterChange('locations', location, checked)}
                                onSelect={(e) => e.preventDefault()}
                                className="cursor-pointer"
                              >
                                {location}
                              </DropdownMenuCheckboxItem>
                            ))}
                          </>
                        )}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    {/* Types Filter */}
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <span>Types</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {types.length > 6 ? (
                          <ScrollArea className="h-[300px]">
                            {types.map((type) => (
                              <DropdownMenuCheckboxItem
                                key={type}
                                checked={filters.types.includes(type)}
                                onCheckedChange={(checked) => handleFilterChange('types', type, checked)}
                                onSelect={(e) => e.preventDefault()}
                                className="cursor-pointer"
                              >
                                {type}
                              </DropdownMenuCheckboxItem>
                            ))}
                          </ScrollArea>
                        ) : (
                          <>
                            {types.map((type) => (
                              <DropdownMenuCheckboxItem
                                key={type}
                                checked={filters.types.includes(type)}
                                onCheckedChange={(checked) => handleFilterChange('types', type, checked)}
                                onSelect={(e) => e.preventDefault()}
                                className="cursor-pointer"
                              >
                                {type}
                              </DropdownMenuCheckboxItem>
                            ))}
                          </>
                        )}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    {/* Clear Filters */}
                    {activeFilterCount > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleClearFilters}
                          className="text-red-600 cursor-pointer"
                        >
                          Clear all filters
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 cursor-pointer">
                      <span>Sort</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuLabel>Sort sessions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                                            <DropdownMenuCheckboxItem
                          checked={filters.sortBy === 'date-asc'}
                          onCheckedChange={(checked) => checked && handleSortChange('date-asc')}
                          onSelect={(e) => e.preventDefault()}
                          className="cursor-pointer"
                        >
                          Date (Earliest First)
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={filters.sortBy === 'date-desc'}
                          onCheckedChange={(checked) => checked && handleSortChange('date-desc')}
                          onSelect={(e) => e.preventDefault()}
                          className="cursor-pointer"
                        >
                          Date (Latest First)
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={filters.sortBy === 'time-asc'}
                          onCheckedChange={(checked) => checked && handleSortChange('time-asc')}
                          onSelect={(e) => e.preventDefault()}
                          className="cursor-pointer"
                        >
                          Time (Earliest First)
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={filters.sortBy === 'time-desc'}
                          onCheckedChange={(checked) => checked && handleSortChange('time-desc')}
                          onSelect={(e) => e.preventDefault()}
                          className="cursor-pointer"
                        >
                          Time (Latest First)
                        </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="hide-full"
                  checked={hideFullSessions}
                  onCheckedChange={handleHideFullSessionsChange}
                />
                <label htmlFor="hide-full" className="text-sm text-slate-600">
                  Hide full sessions
                </label>
                
                {/* View Switcher */}
                <div className="flex items-center space-x-1 bg-slate-100 rounded-sm p-1">
                  {viewMode !== 'list' ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="flex items-center gap-2 px-3 py-1 rounded-sm text-sm font-medium focus:outline-none transition-colors cursor-pointer text-slate-600 hover:text-slate-900"
                          aria-label="List view"
                          onClick={() => setViewMode('list')}
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">Switch to list view</TooltipContent>
                    </Tooltip>
                  ) : (
                    <button
                      type="button"
                      className="flex items-center gap-2 px-3 py-1 rounded-sm text-sm font-medium focus:outline-none transition-colors cursor-pointer bg-white shadow text-slate-900"
                      aria-label="List view"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  )}
                  {viewMode !== 'grid' ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="flex items-center gap-2 px-3 py-1 rounded-sm text-sm font-medium focus:outline-none transition-colors cursor-pointer text-slate-600 hover:text-slate-900"
                          aria-label="Grid view"
                          onClick={() => setViewMode('grid')}
                        >
                          <Grid3X3 className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">Switch to grid view</TooltipContent>
                    </Tooltip>
                  ) : (
                    <button
                      type="button"
                      className="flex items-center gap-2 px-3 py-1 rounded-sm text-sm font-medium focus:outline-none transition-colors cursor-pointer bg-white shadow text-slate-900"
                      aria-label="Grid view"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {paginatedEvents.length === 0 ? (
              <Alert>
                <CalendarX2 className="h-4 w-4" />
                <AlertDescription>
                  No sessions found.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {viewMode === 'list' ? (
                  <div className="space-y-4">
                    {paginatedEvents.map((event) => {
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
                                    // For multi-time sessions, open time slot modal
                                    handleOpenTimeSlotModal(event)
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
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {paginatedEvents.map((event) => {
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
                          className={`overflow-hidden ${hasClash && !isBooked ? 'border-orange-300' : ''}`}
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
                                  <span>{new Date(event.date).toLocaleDateString('en-US', { 
                                    weekday: 'short', 
                                    month: 'short', 
                                    day: 'numeric' 
                                  })}</span>
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
                              variant={isSessionFull(event) ? "secondary" : isBooked ? "outline" : "default"}
                              disabled={isSessionFull(event) && !event.waitlistSpaces}
                              onClick={() => {
                                if (isSessionFull(event) && !event.waitlistSpaces) return
                                if (isBooked) {
                                  handleRemoveFromBooking(event.id)
                                } else if (event.isMultiTime) {
                                  // For multi-time sessions, open time slot modal
                                  handleOpenTimeSlotModal(event)
                                } else {
                                  handleAddToBooking(event.id)
                                }
                              }}
                            >
                              {isBooked
                                ? "Remove from booking"
                                : isSessionFull(event) 
                                  ? event.waitlistSpaces 
                                    ? "Join waitlist" 
                                    : "Session full"
                                  : "Add to booking"
                              }
                            </Button>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}

                {/* Session count and pagination */}
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-slate-600 text-sm">
                    Showing {startIndex + 1}-{Math.min(endIndex, displayEvents.length)} of {displayEvents.length} sessions
                  </p>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-end">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            >
                              <ArrowLeft className="h-4 w-4" />
                            </PaginationPrevious>
                          </PaginationItem>
                          
                          {/* First page */}
                          {currentPage > 3 && (
                            <>
                              <PaginationItem>
                                <PaginationLink onClick={() => setCurrentPage(1)}>
                                  1
                                </PaginationLink>
                              </PaginationItem>
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                            </>
                          )}

                          {/* Page numbers around current page */}
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                            if (pageNum > totalPages) return null
                            
                            return (
                              <PaginationItem key={pageNum}>
                                <PaginationLink 
                                  onClick={() => setCurrentPage(pageNum)}
                                  isActive={currentPage === pageNum}
                                >
                                  {pageNum}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          })}

                          {/* Last page */}
                          {currentPage < totalPages - 2 && (
                            <>
                              <PaginationItem>
                                <PaginationEllipsis />
                              </PaginationItem>
                              <PaginationItem>
                                <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                                  {totalPages}
                                </PaginationLink>
                              </PaginationItem>
                            </>
                          )}

                          <PaginationItem>
                            <PaginationNext 
                              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            >
                              <ArrowRight className="h-4 w-4" />
                            </PaginationNext>
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Itinerary Section */}
            {bookedSessions.length > 0 && (
              <>
                <Separator className="my-8" />
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-slate-900 mb-4">Your itinerary</h4>
                  {(() => {
                    // Get all selected sessions with their booking data and sort by date and time
                    const selectedSessionsWithBookings = bookedSessions.map(booking => ({
                      session: events.find(e => e.id === booking.eventId)!,
                      selectedTimeSlot: booking.selectedTimeSlot
                    }))
                      .filter(item => item.session)
                      .sort((a, b) => {
                        // First sort by date
                        const dateComparison = new Date(a.session!.date).getTime() - new Date(b.session!.date).getTime()
                        if (dateComparison !== 0) return dateComparison
                        
                        // If same date, sort by time
                        const timeA = a.session!.isMultiTime && a.selectedTimeSlot ? a.selectedTimeSlot : a.session!.time
                        const timeB = b.session!.isMultiTime && b.selectedTimeSlot ? b.selectedTimeSlot : b.session!.time
                        
                        // Convert time strings to comparable values (assuming 12-hour format)
                        const parseTime = (timeStr: string) => {
                          const [time, period] = timeStr.split(' ')
                          const [hours, minutes] = time.split(':').map(Number)
                          let hour24 = hours
                          if (period === 'PM' && hours !== 12) hour24 += 12
                          if (period === 'AM' && hours === 12) hour24 = 0
                          return hour24 * 60 + minutes
                        }
                        
                        return parseTime(timeA) - parseTime(timeB)
                      })

                    // Group sessions by date
                    const sessionsByDate = selectedSessionsWithBookings.reduce((groups, item) => {
                      const date = item.session!.date
                      if (!groups[date]) {
                        groups[date] = []
                      }
                      groups[date].push(item)
                      return groups
                    }, {} as Record<string, typeof selectedSessionsWithBookings>)

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
                              {sessions.map((item) => {
                                const session = item.session!
                                const displayTime = session.isMultiTime && item.selectedTimeSlot 
                                  ? item.selectedTimeSlot 
                                  : session.time
                                return (
                                  <div key={session.id} className="flex items-center justify-between">
                                    <div className="text-sm text-slate-900">
                                      {session.title} ({displayTime})
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
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })()}
                </div>
              </>
            )}

            {/* Separator */}
            <Separator className="my-8" />

            {/* Booking Form */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Booking form</h3>
              <p className="text-slate-600 mb-6">
                {bookedSessions.length === 0 
                  ? "No sessions selected for booking. Please add sessions from the list above."
                  : `You have ${bookedSessions.length} session${bookedSessions.length === 1 ? '' : 's'} selected for booking.`
                }
              </p>
              
              {(() => {
                if (bookedSessions.length === 0) return null
                
                const selectedSessions = bookedSessions.map(booking => ({
                  event: events.find(e => e.id === booking.eventId)!,
                  selectedTimeSlot: booking.selectedTimeSlot
                }))
                
                // Check for clashes between any two sessions
                let hasClash = false
                for (let i = 0; i < selectedSessions.length; i++) {
                  for (let j = i + 1; j < selectedSessions.length; j++) {
                    const session1 = selectedSessions[i]
                    const session2 = selectedSessions[j]
                    if (session1.event && session2.event) {
                      const clashes = getClashingSessions(session1.event, [session2], session1.selectedTimeSlot)
                      if (clashes.length > 0) {
                        hasClash = true
                        break
                      }
                    }
                  }
                  if (hasClash) break
                }
                
                return hasClash ? (
                  <Alert className="mb-6 border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-4 w-4" />
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
                

                
                <div className="pt-4">
                  <Button className="w-full" disabled={bookedSessions.length === 0}>
                    Complete Booking
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Detail Modal */}
        {selectedEvent && (
          <SessionDetailModal
            event={selectedEvent}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onAddToBooking={handleAddToBooking}
            onRemoveFromBooking={handleRemoveFromBooking}
            isBooked={isEventBooked(selectedEvent.id)}
            hasClash={false}
            clashingSessions={[]}
          />
        )}

        {/* Time Slot Modal */}
        <TimeSlotModal
          event={selectedEvent}
          isOpen={isTimeSlotModalOpen}
          onClose={handleCloseTimeSlotModal}
          onAddToBooking={(eventId, selectedTimeSlot) => handleAddToBooking(eventId, selectedTimeSlot)}
          isBooked={selectedEvent ? isEventBooked(selectedEvent.id) : false}
        />
      </div>
    </div>
  )
} 