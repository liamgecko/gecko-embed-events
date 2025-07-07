'use client'

import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BookingToastProps {
  sessionCount: number
  onProceedToBooking: () => void
}

const BookingToast = ({ sessionCount, onProceedToBooking }: BookingToastProps) => {
  if (sessionCount === 0) return null

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-4 flex items-center gap-2 min-w-[480px]">
        <CheckCircle2 className="w-5 h-5 text-slate-900 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-900">
            {sessionCount} {sessionCount === 1 ? 'session' : 'sessions'} added to booking
          </p>
        </div>
        <Button 
          size="sm" 
          onClick={onProceedToBooking}
          className="flex-shrink-0"
        >
          Proceed to booking
        </Button>
      </div>
    </div>
  )
}

export default BookingToast 