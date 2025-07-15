"use client"

import { useState, useEffect } from "react"
import { Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Event } from "@/lib/events-data"

interface TimeSlotModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
  onAddToBooking: (eventId: number, selectedTimeSlot?: string) => void
  isBooked: boolean
}

const TimeSlotModal = ({
  event,
  isOpen,
  onClose,
  onAddToBooking,
  isBooked
}: TimeSlotModalProps) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setSelectedTimeSlot(null)
    }
  }, [isOpen])

  if (!event) return null

  const handleBookingAction = () => {
    if (isBooked) {
      onAddToBooking(event.id) // Remove from booking
    } else {
      onAddToBooking(event.id, selectedTimeSlot || undefined)
    }
    onClose()
  }

  const handleTimeSlotSelect = (time: string) => {
    setSelectedTimeSlot(time)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">{event.title}</DialogTitle>
          <DialogDescription>
            Select a time slot for this session
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-4 pb-4">
          {/* Time Slots */}
          {event.isMultiTime && event.availableSlots && (
            <div>
              <div className="grid grid-cols-1 gap-2">
                {event.availableSlots.map((slot, index) => (
                  <div 
                    key={index}
                    onClick={() => slot.attendees < slot.maxAttendees && handleTimeSlotSelect(slot.time)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      slot.attendees >= slot.maxAttendees 
                        ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed' 
                        : selectedTimeSlot === slot.time
                          ? 'border-slate-900 bg-slate-100 text-slate-900'
                          : 'border-slate-200 hover:border-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{slot.time}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="w-3 h-3" />
                        <span>
                          {slot.attendees >= slot.maxAttendees 
                            ? 'Full' 
                            : `${slot.maxAttendees - slot.attendees} available`
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-4 border-t">
          <Button
            onClick={handleBookingAction}
            disabled={event.isMultiTime && !selectedTimeSlot}
            className="flex-1"
            variant={isBooked ? "outline" : "default"}
          >
            {isBooked 
              ? "Remove from Booking" 
              : event.isMultiTime && !selectedTimeSlot
                ? "Select a time slot"
                : "Add to Booking"
            }
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TimeSlotModal 