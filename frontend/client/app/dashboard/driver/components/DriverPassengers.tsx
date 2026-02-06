'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UserCheck, Phone, MapPin, RefreshCw, Play } from 'lucide-react'

type TripStatus = 'scheduled' | 'picked_up' | 'completed' | 'cancelled'
type ServiceType = 'morning' | 'evening'

type DriverTrip = {
  id: number
  booking_id?: number
  child_name?: string
  pickup_location: string
  dropoff_location: string
  start_date: string
  service_type: ServiceType
  seats_booked: number
  status: TripStatus
}

function statusBadge(status: TripStatus) {
  switch (status) {
    case 'picked_up':
      return <Badge className="bg-blue-600 text-white">Picked Up</Badge>
    case 'completed':
      return <Badge className="bg-emerald-600 text-white">Completed</Badge>
    case 'cancelled':
      return <Badge className="bg-red-600 text-white">Cancelled</Badge>
    default:
      return <Badge variant="outline">Scheduled</Badge>
  }
}

function displayLeg(trip: Pick<DriverTrip, 'pickup_location' | 'dropoff_location' | 'service_type'>) {
  const pickup = String(trip.pickup_location || '').trim()
  const dropoff = String(trip.dropoff_location || '').trim()
  if (trip.service_type === 'evening') return { from: dropoff || '—', to: pickup || '—' }
  return { from: pickup || '—', to: dropoff || '—' }
}

export default function DriverPassengers({
  trips,
  onRefresh,
  onStartTrip,
  startingTripId,
}: {
  trips: DriverTrip[]
  onRefresh: () => void
  onStartTrip: (tripId: number) => void
  startingTripId: number | null
}) {
  if (!trips || trips.length === 0) {
    return (
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="pt-6">
          <div className="text-center py-10">
            <UserCheck className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="font-semibold text-slate-900 mb-2">No Bookings Assigned Today</h3>
            <p className="text-slate-600 mb-4">If you expect trips, confirm bookings exist and trips were generated for today.</p>
            <Button variant="outline" onClick={onRefresh} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-slate-900">Assigned Bookings (Today)</CardTitle>
          <Button variant="outline" onClick={onRefresh} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </CardHeader>

        <CardContent className="space-y-3">
          {trips.map(t => {
            const canStart = t.status === 'scheduled'
            const isStarting = startingTripId === t.id
            const leg = displayLeg(t)

            return (
              <div key={t.id} className="rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900">{t.child_name || 'Student'}</span>
                      {statusBadge(t.status)}
                      <Badge variant="outline" className="border-slate-200 text-slate-700">
                        {t.service_type.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="text-sm text-slate-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {leg.from} → {leg.to}
                    </div>

                    <div className="text-sm text-slate-600 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Seats booked: <span className="font-medium text-slate-900">{t.seats_booked}</span>
                    </div>

                    {t.booking_id && (
                      <div className="text-xs text-slate-500">Booking #{t.booking_id} • Trip #{t.id}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-600">
                      {t.status === 'scheduled' ? 'Pending pickup' : t.status === 'picked_up' ? 'On route' : 'Trip closed'}
                    </div>

                    {canStart && (
                      <Button size="sm" className="gap-2" disabled={isStarting} onClick={() => onStartTrip(t.id)}>
                        <Play className="w-4 h-4" />
                        {isStarting ? 'Starting...' : 'Start Trip'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
