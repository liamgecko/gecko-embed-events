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
  return events.filter(event => {
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