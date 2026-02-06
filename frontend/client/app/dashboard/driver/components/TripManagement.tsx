'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Users, CheckCircle, XCircle, RefreshCw, Clock } from 'lucide-react'

type TripStatus = 'scheduled' | 'picked_up' | 'completed' | 'cancelled'
type ServiceType = 'morning' | 'evening'
type PassengerStatus = 'pending' | 'picked-up' | 'dropped-off' | 'absent'

type Passenger = {
  id: number
  name: string
  status: PassengerStatus
  checked_in_time?: string
  checked_out_time?: string
  pickup_location?: string
  dropoff_location?: string
}

type Trip = {
  id: number
  booking_id?: number
  pickup_location: string
  dropoff_location: string
  service_type: ServiceType
  seats_booked: number
  status: TripStatus
}

function safe(v: any, fallback = '') {
  if (v === null || v === undefined) return fallback
  return String(v)
}

function displayLeg(trip: Pick<Trip, 'pickup_location' | 'dropoff_location' | 'service_type'>) {
  const pickup = safe(trip.pickup_location, '—')
  const dropoff = safe(trip.dropoff_location, '—')
  return trip.service_type === 'evening' ? { from: dropoff, to: pickup } : { from: pickup, to: dropoff }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export default function TripManagement({
  trip,
  passengers,
  loadingPassengers,
  onRefreshPassengers,
  onCompleteTrip,
  onMarkPassenger,
  onMarkAllAbsent,
}: {
  trip: Trip
  passengers?: Passenger[] // ✅ allow undefined
  loadingPassengers: boolean
  onRefreshPassengers: () => void
  onCompleteTrip: () => void
  onMarkPassenger: (passengerId: number, status: PassengerStatus) => void
  onMarkAllAbsent: () => void
}) {
  // ✅ normalize to safe array
  const passengerList = Array.isArray(passengers) ? passengers : []
  const hasPassengerList = passengerList.length > 0

  const leg = displayLeg(trip)

  const total = useMemo(() => {
    if (hasPassengerList) return passengerList.length
    return Number.isFinite(trip.seats_booked) && trip.seats_booked > 0 ? trip.seats_booked : 0
  }, [hasPassengerList, passengerList, trip.seats_booked])

  const pickedUp = useMemo(() => {
    if (!hasPassengerList) return 0
    return passengerList.filter(p => p.status === 'picked-up').length
  }, [hasPassengerList, passengerList])

  const droppedOff = useMemo(() => {
    if (!hasPassengerList) return 0
    return passengerList.filter(p => p.status === 'dropped-off').length
  }, [hasPassengerList, passengerList])

  const absent = useMemo(() => {
    if (!hasPassengerList) return 0
    return passengerList.filter(p => p.status === 'absent').length
  }, [hasPassengerList, passengerList])

  const pending = useMemo(() => clamp(total - pickedUp - droppedOff - absent, 0, total), [total, pickedUp, droppedOff, absent])

  const pct = useMemo(() => {
    if (total <= 0) return 0
    return Math.round((pickedUp / total) * 100)
  }, [pickedUp, total])

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-slate-900">Passenger Progress</CardTitle>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4" />
              <span className="truncate">
                {leg.from} → {leg.to}
              </span>
              <Badge variant="outline" className="ml-2">
                {trip.service_type === 'evening' ? 'Evening Service' : 'Morning Service'}
              </Badge>
            </div>
          </div>

          <div className="text-sm text-slate-600 whitespace-nowrap">
            {pickedUp} of {total} picked up
          </div>
        </div>

        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Pending: {pending}</span>
          <span className="text-emerald-700">Picked up: {pickedUp}</span>
        </div>

        {!hasPassengerList && total > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800 text-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Passenger list not loaded yet. Showing totals using seats booked ({total}).
            </div>
            <Button size="sm" variant="outline" className="gap-2" onClick={onRefreshPassengers} disabled={loadingPassengers}>
              <RefreshCw className={`w-4 h-4 ${loadingPassengers ? 'animate-spin' : ''}`} />
              {loadingPassengers ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="font-semibold text-slate-900">Quick Actions</p>
          <p className="text-sm text-slate-600">Manage passenger boarding quickly</p>

          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="justify-start gap-2"
              onClick={onMarkAllAbsent}
              disabled={!hasPassengerList || pending === 0}
            >
              <XCircle className="w-4 h-4" />
              Mark All Absent
              <span className="ml-auto text-slate-500">Remaining: {pending}</span>
            </Button>

            <Button
              className="sm:ml-auto gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={onCompleteTrip}
              disabled={trip.status !== 'picked_up'}
            >
              <CheckCircle className="w-4 h-4" />
              Complete Trip
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="rounded-lg bg-slate-50 p-4 text-center">
            <div className="text-3xl font-bold text-slate-900">{total}</div>
            <div className="text-sm text-slate-600">Total</div>
          </div>
          <div className="rounded-lg bg-emerald-50 p-4 text-center">
            <div className="text-3xl font-bold text-emerald-700">{pickedUp}</div>
            <div className="text-sm text-emerald-700">Picked Up</div>
          </div>
          <div className="rounded-lg bg-amber-50 p-4 text-center">
            <div className="text-3xl font-bold text-amber-700">{pending}</div>
            <div className="text-sm text-amber-700">Pending</div>
          </div>
          <div className="rounded-lg bg-indigo-50 p-4 text-center">
            <div className="text-3xl font-bold text-indigo-700">{droppedOff}</div>
            <div className="text-sm text-indigo-700">Dropped Off</div>
          </div>
        </div>

        {hasPassengerList && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <Users className="w-4 h-4" /> Passengers
            </div>

            {passengerList.map(p => (
              <div key={p.id} className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 truncate">{p.name}</span>
                    <Badge variant="outline" className="capitalize">
                      {p.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    {p.pickup_location ?? leg.from} → {p.dropoff_location ?? leg.to}
                  </p>
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
                  <Button size="sm" variant="outline" disabled={p.status !== 'picked-up'} onClick={() => onMarkPassenger(p.id, 'dropped-off')}>
                    Dropped off
                  </Button>
                  <Button size="sm" variant="outline" disabled={p.status === 'dropped-off'} onClick={() => onMarkPassenger(p.id, 'absent')}>
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
