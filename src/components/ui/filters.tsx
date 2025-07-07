import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Search, X } from 'lucide-react'

export interface FilterState {
  search: string
  tags: string[]
  dates: string[]
  locations: string[]
  types: string[]
  startTimes: string[]
}

interface FiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  tags: string[]
  dates: string[]
  locations: string[]
  types: string[]
  className?: string
}

export const Filters = ({ filters, onFiltersChange, tags, dates, locations, types, className = '' }: FiltersProps) => {

  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({
      ...filters,
      search: searchTerm
    })
  }

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag]
    
    onFiltersChange({
      ...filters,
      tags: newTags
    })
  }

  const handleDateToggle = (date: string) => {
    const newDates = filters.dates.includes(date)
      ? filters.dates.filter(d => d !== date)
      : [...filters.dates, date]
    
    onFiltersChange({
      ...filters,
      dates: newDates
    })
  }

  const handleLocationToggle = (location: string) => {
    const newLocations = filters.locations.includes(location)
      ? filters.locations.filter(l => l !== location)
      : [...filters.locations, location]
    
    onFiltersChange({
      ...filters,
      locations: newLocations
    })
  }

  const handleTypeToggle = (type: string) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type]
    
    onFiltersChange({
      ...filters,
      types: newTypes
    })
  }

  const handleStartTimeToggle = (startTime: string) => {
    const newStartTimes = filters.startTimes.includes(startTime)
      ? filters.startTimes.filter(st => st !== startTime)
      : [...filters.startTimes, startTime]
    
    onFiltersChange({
      ...filters,
      startTimes: newStartTimes
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      tags: [],
      dates: [],
      locations: [],
      types: [],
      startTimes: []
    })
  }

  const hasActiveFilters = filters.search.length > 0 || 
    filters.tags.length > 0 || 
    filters.dates.length > 0 || 
    filters.locations.length > 0 || 
    filters.types.length > 0 ||
    filters.startTimes.length > 0

  return (
    <Card className={`w-full sticky top-4 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Filters
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        {/* Search Box */}
        <div className="mb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search sessions"
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-8 pr-8"
            />
            {filters.search.length > 0 && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <Accordion type="multiple" defaultValue={[]} className="w-full">
            {/* Tags */}
            <AccordionItem value="tags">
              <AccordionTrigger className="text-sm font-medium text-slate-700 hover:no-underline">
                Tags
              </AccordionTrigger>
              <AccordionContent className="space-y-3 px-0 pb-5">
                {tags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={filters.tags.includes(tag)}
                      onCheckedChange={() => handleTagToggle(tag)}
                    />
                    <label
                      htmlFor={`tag-${tag}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {tag}
                    </label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Dates */}
            <AccordionItem value="dates">
              <AccordionTrigger className="text-sm font-medium text-slate-700 hover:no-underline">
                Dates
              </AccordionTrigger>
              <AccordionContent className="space-y-3 px-0 pb-5">
                {dates.map((date) => (
                  <div key={date} className="flex items-center space-x-2">
                    <Checkbox
                      id={`date-${date}`}
                      checked={filters.dates.includes(date)}
                      onCheckedChange={() => handleDateToggle(date)}
                    />
                    <label
                      htmlFor={`date-${date}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {date}
                    </label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Start Time */}
            <AccordionItem value="startTimes">
              <AccordionTrigger className="text-sm font-medium text-slate-700 hover:no-underline">
                Start time
              </AccordionTrigger>
              <AccordionContent className="space-y-3 px-0 pb-5">
                {["Morning", "Afternoon"].map((startTime) => (
                  <div key={startTime} className="flex items-center space-x-2">
                    <Checkbox
                      id={`startTime-${startTime}`}
                      checked={filters.startTimes.includes(startTime)}
                      onCheckedChange={() => handleStartTimeToggle(startTime)}
                    />
                    <label
                      htmlFor={`startTime-${startTime}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {startTime}
                    </label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Locations */}
            <AccordionItem value="locations">
              <AccordionTrigger className="text-sm font-medium text-slate-700 hover:no-underline">
                Locations
              </AccordionTrigger>
              <AccordionContent className="space-y-3 px-0 pb-5">
                {locations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={`location-${location}`}
                      checked={filters.locations.includes(location)}
                      onCheckedChange={() => handleLocationToggle(location)}
                    />
                    <label
                      htmlFor={`location-${location}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {location}
                    </label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {/* Types */}
            <AccordionItem value="types">
              <AccordionTrigger className="text-sm font-medium text-slate-700 hover:no-underline">
                Type
              </AccordionTrigger>
              <AccordionContent className="space-y-3 px-0 pb-5">
                {types.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={filters.types.includes(type)}
                      onCheckedChange={() => handleTypeToggle(type)}
                    />
                    <label
                      htmlFor={`type-${type}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Clear All Filters Button */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="w-full"
              >
                Clear filters
              </Button>
            </div>
          )}
        </CardContent>
    </Card>
  )
} 