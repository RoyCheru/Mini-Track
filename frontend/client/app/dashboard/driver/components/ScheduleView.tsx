'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, Clock, Play, CheckCircle } from 'lucide-react'

type TripStatus = 'scheduled' | 'picked_up' | 'completed' | 'cancelled'
type ServiceType = 'morning' | 'evening'

interface ScheduleTrip {
  id: number
  pickup_location: string
  dropoff_location: string
  start_date: string
  service_type: ServiceType
  seats_booked: number
  status: TripStatus
  days_of_week?: string
}

interface ScheduleViewProps {
  schedule: ScheduleTrip[]
  onStartTrip: (tripId: number) => void
  onCompleteTrip: (tripId: number) => void
  showAll?: boolean
  startingTripId?: number | null
}

function shortPlace(v: string) {
  const s = String(v || '').trim()
  if (!s) return '—'
  return s.split(',')[0]
}

function displayLeg(trip: Pick<ScheduleTrip, 'pickup_location' | 'dropoff_location' | 'service_type'>) {
  const pickup = String(trip.pickup_location || '').trim()
  const dropoff = String(trip.dropoff_location || '').trim()
  if (trip.service_type === 'evening') return { from: dropoff || '—', to: pickup || '—' }
  return { from: pickup || '—', to: dropoff || '—' }
}

function statusBadge(status: TripStatus) {
  const base = 'capitalize'
  if (status === 'picked_up') return <Badge className="bg-blue-600 text-white">Picked Up</Badge>
  if (status === 'completed') return <Badge className="bg-emerald-600 text-white">Completed</Badge>
  if (status === 'cancelled') return <Badge className="bg-red-600 text-white">Cancelled</Badge>
  return <Badge variant="outline" className={base}>Scheduled</Badge>
}

function parseDays(days_of_week?: string) {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const raw = String(days_of_week || '').trim()
  if (!raw) return []
  return raw
    .split(',')
    .map(s => Number(String(s).trim()))
    .filter(n => Number.isFinite(n) && n >= 1 && n <= 7)
    .map(n => dayNames[n - 1])
}

export default function ScheduleView({
  schedule,
  onStartTrip,
  onCompleteTrip,
  showAll = false,
  startingTripId = null,
}: ScheduleViewProps) {
  const safeSchedule = Array.isArray(schedule) ? schedule : []

  if (safeSchedule.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No trips scheduled</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {safeSchedule.map(trip => {
        const days = parseDays(trip.days_of_week)
        const leg = displayLeg(trip)
        const isStarting = startingTripId === trip.id

        return (
          <div key={trip.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold">
                    {shortPlace(leg.from)} → {shortPlace(leg.to)}
                  </h4>

                  {statusBadge(trip.status)}

                  <Badge variant="outline" className="capitalize">
                    {trip.service_type}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {trip.seats_booked} passengers
                  </span>

                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {trip.start_date || '—'}
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {days.join(', ') || '—'}
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {shortPlace(leg.from)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {trip.status === 'scheduled' && (
                  <Button
                    size="sm"
                    onClick={() => onStartTrip(trip.id)}
                    className="gap-1"
                    disabled={isStarting}
                  >
                    <Play className="w-4 h-4" />
                    {isStarting ? 'Starting...' : 'Start Trip'}
                  </Button>
                )}

                {trip.status === 'picked_up' && (
                  <Button
                    size="sm"
                    onClick={() => onCompleteTrip(trip.id)}
                    className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Complete Trip
                  </Button>
                )}
              </div>
            </div>

            {showAll && (
              <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                <span>
                  {trip.seats_booked} children assigned for {trip.service_type} service
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
