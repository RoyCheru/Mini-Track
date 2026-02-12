'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserCheck, Play } from 'lucide-react'

type PassengerStatus = 'pending' | 'picked-up' | 'dropped-off' | 'absent'
type TripStatus = 'scheduled' | 'picked_up' | 'completed' | 'cancelled'

type Passenger = {
  id: number
  name: string
  status: PassengerStatus
  pickup_location?: string
  dropoff_location?: string
  checked_in_time?: string
  checked_out_time?: string
}

type Trip = {
  id: number
  pickup_location: string
  dropoff_location: string
  service_type: 'morning' | 'evening'
  status: TripStatus
  passengers: Passenger[]
}

export default function PassengerTracking({
  trip,
  onMarkPassenger,
  onStartTrip,
  startingTripId,
}: {
  trip: Trip
  onMarkPassenger: (passengerId: number, status: PassengerStatus) => void
  onStartTrip?: (tripId: number) => void
  startingTripId?: number | null
}) {
  const passengers = Array.isArray(trip.passengers) ? trip.passengers : []

  const canStart = trip.status === 'scheduled'
  const isStarting = startingTripId === trip.id

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <UserCheck className="w-5 h-5" />
            Passengers ({passengers.length})
          </CardTitle>

          <Badge
            variant="outline"
            className={
              trip.status === 'picked_up'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : trip.status === 'completed'
                ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                : trip.status === 'cancelled'
                ? 'border-rose-200 bg-rose-50 text-rose-700'
                : 'border-slate-200 bg-slate-50 text-slate-700'
            }
          >
            {trip.status}
          </Badge>
        </div>

        {onStartTrip && (
          <div className="flex justify-end">
            <Button
              size="sm"
              className="gap-2"
              disabled={!canStart || isStarting}
              onClick={() => onStartTrip(trip.id)}
            >
              <Play className="w-4 h-4" />
              {isStarting ? 'Starting...' : canStart ? 'Start Trip' : 'Trip Started'}
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {passengers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-600">No passengers found for this trip.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {passengers.map(p => (
              <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border rounded-lg p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900 truncate">{p.name}</p>
                    <Badge
                      variant="outline"
                      className={
                        p.status === 'picked-up'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : p.status === 'dropped-off'
                          ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                          : p.status === 'absent'
                          ? 'border-rose-200 bg-rose-50 text-rose-700'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }
                    >
                      {p.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-600 mt-1">
                    {p.pickup_location ?? trip.pickup_location} → {p.dropoff_location ?? trip.dropoff_location}
                  </p>

                  {(p.checked_in_time || p.checked_out_time) && (
                    <p className="text-xs text-slate-500 mt-1">
                      {p.checked_in_time ? `In: ${p.checked_in_time}` : ''}
                      {p.checked_in_time && p.checked_out_time ? ' • ' : ''}
                      {p.checked_out_time ? `Out: ${p.checked_out_time}` : ''}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={p.status === 'picked-up' || p.status === 'dropped-off'}
                    onClick={() => onMarkPassenger(p.id, 'picked-up')}
                  >
                    Picked up
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={p.status !== 'picked-up'}
                    onClick={() => onMarkPassenger(p.id, 'dropped-off')}
                  >
                    Dropped off
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={p.status === 'dropped-off'}
                    onClick={() => onMarkPassenger(p.id, 'absent')}
                  >
                    Absent
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
