"use client"

import Image from "next/image"
import { Clock, MapPin, Users, Video, Calendar, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Event } from "@/lib/events-data"

interface SessionDetailModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
  onAddToBooking: (eventId: number) => void
  onRemoveFromBooking: (eventId: number) => void
  isBooked: boolean
  hasClash: boolean
  clashingSessions: Event[]
}

const SessionDetailModal = ({
  event,
  isOpen,
  onClose,
  onAddToBooking,
  onRemoveFromBooking,
  isBooked,
  hasClash,
  clashingSessions
}: SessionDetailModalProps) => {
  if (!event) return null

  const handleBookingAction = () => {
    if (isBooked) {
      onRemoveFromBooking(event.id)
    } else {
      onAddToBooking(event.id)
    }
  }

  const isSessionFull = event.attendees === 0 && !event.waitlistSpaces

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>
              {event.attendees === 0 
                ? event.waitlistSpaces 
                  ? `${event.waitlistSpaces} waitlist spaces` 
                  : "Session full"
                : `${event.attendees} spaces available`
              }
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 px-4 pb-4">
          {/* Image */}
          <div className="relative h-48 w-full rounded-lg overflow-hidden">
            <Image
              src={event.image || '/placeholder-image.jpg'}
              alt={event.title}
              fill
              className={`object-cover ${isSessionFull ? 'opacity-50' : ''}`}
            />
            {/* Status Badge */}
            {event.attendees === 0 && (
              <div className="absolute top-3 left-3">
                <Badge 
                  className={
                    event.waitlistSpaces 
                      ? "bg-orange-100 text-orange-700 rounded-full font-bold" 
                      : "bg-pink-100 text-pink-700 rounded-full font-bold"
                  }
                >
                  {event.waitlistSpaces ? "Waitlist available" : "Session full"}
                </Badge>
              </div>
            )}
          </div>

          {/* Session Details */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-sm">Session details</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-600 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
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
                    <span>Online Session</span>
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-2 text-sm">Description</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Host */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3 text-sm">Host</h4>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                  <span className="text-slate-600 font-semibold text-lg">JD</span>
                </div>
                <div>
                  <h5 className="font-medium text-slate-900">Dr. Jane Doe</h5>
                  <p className="text-slate-600 text-sm">Senior Lecturer, Computer Science</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-2 text-sm">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Clash Warning */}
            {hasClash && !isBooked && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-1">Time Clash Warning</h4>
                    <p className="text-orange-700 text-sm mb-2">
                      This session conflicts with your booked sessions:
                    </p>
                    <ul className="text-orange-700 text-sm space-y-1">
                      {clashingSessions.map((clash) => (
                        <li key={clash.id} className="flex items-center gap-2">
                          <span>• {clash.title} ({clash.time})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

        {/* Action Buttons - Fixed Footer */}
        <div className="flex gap-3 p-4 border-t sticky bottom-0 bg-white">
          <Button
            onClick={handleBookingAction}
            disabled={isSessionFull}
            className="flex-1"
            variant={isBooked ? "outline" : "default"}
          >
            {isBooked ? "Remove from Booking" : "Add to Booking"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SessionDetailModal 