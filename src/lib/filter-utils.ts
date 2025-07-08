import { FilterState } from '@/components/ui/filters'
import { Event } from './events-data'

// Utility function to format dates consistently
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export const filterEvents = (events: Event[], filters: FilterState): Event[] => {
  const filteredEvents = events.filter(event => {
    // Search filter
    if (filters.search.length > 0) {
      const searchTerm = filters.search.toLowerCase()
      const titleMatch = event.title.toLowerCase().includes(searchTerm)
      const descriptionMatch = event.description?.toLowerCase().includes(searchTerm) || false
      const categoryMatch = event.category.toLowerCase().includes(searchTerm)
      const locationMatch = event.location.toLowerCase().includes(searchTerm)
      const tagsMatch = event.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) || false
      
      if (!titleMatch && !descriptionMatch && !categoryMatch && !locationMatch && !tagsMatch) {
        return false
      }
    }

    // Tags filter
    if (filters.tags.length > 0 && event.tags) {
      const hasMatchingTag = filters.tags.some(tag => event.tags!.includes(tag))
      if (!hasMatchingTag) {
        return false
      }
    }

    // Dates filter
    if (filters.dates.length > 0) {
      const eventDate = formatDate(event.date)
      if (!filters.dates.includes(eventDate)) {
        return false
      }
    }

    // Locations filter
    if (filters.locations.length > 0 && !filters.locations.includes(event.location)) {
      return false
    }

    // Types filter
    if (filters.types.length > 0 && event.type && !filters.types.includes(event.type)) {
      return false
    }

    // Start time filter
    if (filters.startTimes.length > 0) {
      // Extract the start time from the time range (e.g., "9:00 AM - 5:00 PM" -> "9:00 AM")
      const startTimeMatch = event.time.match(/^([^-\n]+)/)
      const startTime = startTimeMatch ? startTimeMatch[1].trim() : event.time
      
      // Check if start time is AM or PM
      const isMorning = startTime.toLowerCase().includes('am')
      const isAfternoon = startTime.toLowerCase().includes('pm')
      
      const hasMatchingStartTime = filters.startTimes.some(filterStartTime => {
        if (filterStartTime === 'Morning') return isMorning
        if (filterStartTime === 'Afternoon') return isAfternoon
        return false
      })
      
      if (!hasMatchingStartTime) {
        return false
      }
    }

    return true
  })

  // Sort the filtered events
  return sortEvents(filteredEvents, filters.sortBy)
}

const parseEventDateTime = (event: Event): Date => {
  // Combine date and start time into a single Date object
  // Assumes event.date is 'YYYY-MM-DD' and event.time is 'HH:MM AM/PM - ...'
  const [startTime] = event.time.split(' - ')
  return new Date(`${event.date} ${startTime}`)
}

const sortEvents = (events: Event[], sortBy: string): Event[] => {
  const sortedEvents = [...events]
  
  switch (sortBy) {
    case 'date-asc':
      return sortedEvents.sort((a, b) => parseEventDateTime(a).getTime() - parseEventDateTime(b).getTime())
    
    case 'date-desc':
      return sortedEvents.sort((a, b) => parseEventDateTime(b).getTime() - parseEventDateTime(a).getTime())
    
    case 'title-asc':
      return sortedEvents.sort((a, b) => a.title.localeCompare(b.title))
    
    case 'title-desc':
      return sortedEvents.sort((a, b) => b.title.localeCompare(a.title))
    
    case 'time-asc':
      return sortedEvents.sort((a, b) => {
        // Extract start time from time range (e.g., "9:00 AM - 5:00 PM" -> "9:00 AM")
        const aStartTime = a.time.match(/^([^-\n]+)/)?.[1]?.trim() || a.time
        const bStartTime = b.time.match(/^([^-\n]+)/)?.[1]?.trim() || b.time
        
        // Convert to 24-hour format for comparison
        const aTime = convertTo24Hour(aStartTime)
        const bTime = convertTo24Hour(bStartTime)
        
        return aTime - bTime
      })
    
    case 'time-desc':
      return sortedEvents.sort((a, b) => {
        const aStartTime = a.time.match(/^([^-\n]+)/)?.[1]?.trim() || a.time
        const bStartTime = b.time.match(/^([^-\n]+)/)?.[1]?.trim() || b.time
        
        const aTime = convertTo24Hour(aStartTime)
        const bTime = convertTo24Hour(bStartTime)
        
        return bTime - aTime
      })
    
    default:
      return sortedEvents
  }
}

const convertTo24Hour = (timeString: string): number => {
  const time = timeString.trim().toLowerCase()
  const match = time.match(/(\d+):?(\d*)\s*(am|pm)/)
  
  if (!match) return 0
  
  let hours = parseInt(match[1])
  const minutes = match[2] ? parseInt(match[2]) : 0
  const period = match[3]
  
  if (period === 'pm' && hours !== 12) {
    hours += 12
  } else if (period === 'am' && hours === 12) {
    hours = 0
  }
  
  return hours * 60 + minutes // Convert to minutes for easier comparison
}

export const getUniqueTags = (events: Event[]): string[] => {
  const allTags = events.flatMap(event => event.tags || [])
  return [...new Set(allTags)].sort()
}

export const getUniqueDates = (events: Event[]): string[] => {
  const dates = events.map(event => formatDate(event.date))
  return [...new Set(dates)].sort()
}

export const getUniqueLocations = (events: Event[]): string[] => {
  const locations = events.map(event => event.location)
  return [...new Set(locations)].sort()
}

export const getUniqueTypes = (events: Event[]): string[] => {
  const types = events.map(event => event.type).filter(Boolean) as string[]
  return [...new Set(types)].sort()
}

// Clash detection functions
export const parseTimeRange = (timeString: string): { start: number; end: number } => {
  const match = timeString.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)\s*-\s*(\d{1,2}):?(\d{2})?\s*(AM|PM)/i)
  
  if (!match) return { start: 0, end: 0 }
  
  const startHour = parseInt(match[1])
  const startMinute = match[2] ? parseInt(match[2]) : 0
  const startPeriod = match[3].toUpperCase()
  const endHour = parseInt(match[4])
  const endMinute = match[5] ? parseInt(match[5]) : 0
  const endPeriod = match[6].toUpperCase()
  
  const start = convertTo24Hour(`${startHour}:${startMinute.toString().padStart(2, '0')} ${startPeriod}`)
  const end = convertTo24Hour(`${endHour}:${endMinute.toString().padStart(2, '0')} ${endPeriod}`)
  
  return { start, end }
}

// New function to parse a single time slot (e.g., "10:00 AM" -> start and end times)
export const parseTimeSlot = (timeSlot: string, duration: number = 60): { start: number; end: number } => {
  const start = convertTo24Hour(timeSlot)
  const end = start + duration // duration in minutes
  return { start, end }
}

// New function to get the effective time range for clash detection
export const getEffectiveTimeRange = (event: Event, selectedTimeSlot?: string): { start: number; end: number } => {
  // If it's a multi-time session and a time slot is selected, use that specific slot
  if (event.isMultiTime && selectedTimeSlot && event.timeSlotDuration) {
    return parseTimeSlot(selectedTimeSlot, event.timeSlotDuration)
  }
  
  // Otherwise, use the full time range
  return parseTimeRange(event.time)
}

export const doSessionsClash = (session1: Event, session2: Event, selectedTimeSlot1?: string, selectedTimeSlot2?: string): boolean => {
  // Sessions on different dates don't clash
  if (session1.date !== session2.date) return false
  
  const time1 = getEffectiveTimeRange(session1, selectedTimeSlot1)
  const time2 = getEffectiveTimeRange(session2, selectedTimeSlot2)
  
  // Check for overlap: session1 starts before session2 ends AND session2 starts before session1 ends
  return time1.start < time2.end && time2.start < time1.end
}

export const getClashingSessions = (targetSession: Event, bookedSessions: Array<{ event: Event; selectedTimeSlot?: string }>, targetSelectedTimeSlot?: string): Event[] => {
  return bookedSessions
    .filter(({ event }) => event.id !== targetSession.id)
    .filter(({ event, selectedTimeSlot }) => 
      doSessionsClash(targetSession, event, targetSelectedTimeSlot, selectedTimeSlot)
    )
    .map(({ event }) => event)
}

export const hasClashes = (bookedSessions: Array<{ event: Event; selectedTimeSlot?: string }>): boolean => {
  for (let i = 0; i < bookedSessions.length; i++) {
    for (let j = i + 1; j < bookedSessions.length; j++) {
      if (doSessionsClash(
        bookedSessions[i].event, 
        bookedSessions[j].event, 
        bookedSessions[i].selectedTimeSlot, 
        bookedSessions[j].selectedTimeSlot
      )) {
        return true
      }
    }
  }
  return false
}

// Multi-time session utility functions
export const getTotalAvailableSlots = (event: Event): number => {
  if (!event.isMultiTime || !event.availableSlots) return 0
  return event.availableSlots.reduce((total, slot) => {
    return total + Math.max(0, slot.maxAttendees - slot.attendees)
  }, 0)
}

export const getTotalSlots = (event: Event): number => {
  if (!event.isMultiTime || !event.availableSlots) return 0
  return event.availableSlots.reduce((total, slot) => total + slot.maxAttendees, 0)
}

export const getAvailableSlotsCount = (event: Event): number => {
  if (!event.isMultiTime || !event.availableSlots) return 0
  return event.availableSlots.filter(slot => slot.attendees < slot.maxAttendees).length
}

export const getTotalSlotsCount = (event: Event): number => {
  if (!event.isMultiTime || !event.availableSlots) return 0
  return event.availableSlots.length
}

export const areAllSlotsFull = (event: Event): boolean => {
  if (!event.isMultiTime || !event.availableSlots) return false
  return event.availableSlots.every(slot => slot.attendees >= slot.maxAttendees)
} 