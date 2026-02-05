'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CheckCircle2, CalendarDays, Clock, Bus } from 'lucide-react'

const DAYS = [
  { id: '1', name: 'Mon' },
  { id: '2', name: 'Tue' },
  { id: '3', name: 'Wed' },
  { id: '4', name: 'Thu' },
  { id: '5', name: 'Fri' },
  { id: '6', name: 'Sat' },
  { id: '7', name: 'Sun' },
]

const BUS_SEATS = Array.from({ length: 24 }, (_, i) => i + 1)
const BASE_URL = 'http://127.0.0.1:5555'

async function apiFetch(path: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        ...(options.headers || {}),
      },
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(text || 'Network response was not ok')
    }

    return await response.json()
  } catch (err) {
    console.error('API fetch error:', err)
    throw err
  }
}

export default function BookingFlow() {
  const [step, setStep] = useState(1)
  const [routes, setRoutes] = useState<{ id: number; name: string; vehicle_id: number }[]>([])
  const [routeId, setRouteId] = useState('')
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [serviceType, setServiceType] = useState('morning')
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>(['1','2','3','4','5'])
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const data = await apiFetch('/routes')
        setRoutes(data)
      } catch (err) {
        console.error('Failed to fetch routes:', err)
      }
    }
    fetchRoutes()
  }, [])

  const toggleDay = (id: string) => {
    setDaysOfWeek(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    )
  }

  const toggleSeat = (seat: number) => {
    setSelectedSeats(prev =>
      prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]
    )
  }

  const submitBooking = async () => {
    setLoading(true)
    setError('')
    const userId = 1
    const selectedRoute = routes.find(r => r.id.toString() === routeId)
    const vehicleId = selectedRoute?.vehicle_id || 1

    const payload = {
      user_id: userId,
      vehicle_id: vehicleId,
      pickup_location: pickup,
      dropoff_location: dropoff,
      start_date: startDate,
      end_date: endDate,
      service_type: serviceType,
      days_of_week: daysOfWeek.join(','),
      seats_booked: selectedSeats.length,
    }

    try {
      const data = await apiFetch('/bookings', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      console.log('Booking created:', data)
      setConfirmed(true)
      setStep(3)
    } catch (err: any) {
      setError(err.message || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* STEP INDICATOR */}
      <div className="flex justify-between items-center mb-4">
        {[1,2,3].map(n => (
          <div key={n} className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
              ${step > n ? 'bg-emerald-500 text-white' : step === n ? 'bg-primary text-white' : 'bg-muted text-gray-500'} transition-colors`}>
              {step > n ? <CheckCircle2 className="w-5 h-5" /> : n}
            </div>
            {n < 3 && <div className="w-14 h-1 bg-muted rounded-full" />}
          </div>
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle>Select Route & Schedule</CardTitle>
            <CardDescription>Choose transport details</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">

            <div>
              <Label>Route</Label>
              <Select value={routeId} onValueChange={setRouteId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map(r => (
                    <SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Pickup Location</Label>
                <Input value={pickup} onChange={e => setPickup(e.target.value)} />
              </div>
              <div>
                <Label>Dropoff Location</Label>
                <Input value={dropoff} onChange={e => setDropoff(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Start Date</Label>
                <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div>
                <Label className="flex items-center gap-2"><CalendarDays className="w-4 h-4" /> End Date</Label>
                <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            </div>

            <div>
              <Label className="flex items-center gap-2"><Clock className="w-4 h-4" /> Service Type</Label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                  <SelectItem value="both">Morning & Evening</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Days of the Week</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {DAYS.map(d => (
                  <button key={d.id} onClick={() => toggleDay(d.id)}
                    className={`px-3 py-1 rounded-full border transition
                      ${daysOfWeek.includes(d.id) ? 'bg-primary text-white border-primary' : 'text-muted-foreground border-muted hover:bg-muted/20'}`}>
                    {d.name}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <Button className="w-full" onClick={() => setStep(2)}
              disabled={!routeId || !pickup || !dropoff || !startDate || !endDate}>
              Continue to Seat Selection
            </Button>

          </CardContent>
        </Card>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bus className="w-5 h-5" /> Select Seats</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
              {BUS_SEATS.map(seat => (
                <button key={seat} onClick={() => toggleSeat(seat)}
                  className={`h-12 rounded-lg border font-semibold transition
                    ${selectedSeats.includes(seat) ? 'bg-primary text-white border-primary' : 'bg-muted border-muted hover:bg-muted/50'}`}>
                  {seat}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={submitBooking} disabled={selectedSeats.length === 0 || loading}>
                {loading ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3 */}
      {step === 3 && confirmed && (
        <Card className="border-emerald-500/40 bg-emerald-500/5 shadow-md">
          <CardHeader>
            <CardTitle className="text-emerald-600">Booking Confirmed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><b>Route:</b> {routes.find(r => r.id.toString() === routeId)?.name}</p>
            <p><b>Seats:</b> {selectedSeats.join(', ')}</p>
            <p><b>Days:</b> {daysOfWeek.map(d => DAYS.find(x => x.id === d)?.name).join(', ')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
