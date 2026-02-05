'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiFetch } from '@/lib/api'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Armchair,
  Bus,
  MapPinned,
  CalendarDays,
  Users,
  Sparkles,
  Info
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert'

type Route = {
  id: number
  name: string
  starting_point: string
  ending_point: string
}

type PickupLocation = {
  id: number
  route_id: number
  name: string
  gps_coordinates: string
}

type SchoolLocation = {
  id: number
  route_id: number
  name: string
  gps_coordinates: string
}

type Vehicle = {
  id: number
  route_id: number
  capacity: number
  license_plate: string
}

type Booking = {
  id: number
  route_id: number
  status: string
  start_date: string
  end_date: string
  seats_booked: number
  selected_seats?: number[]
}

type BookingForm = {
  route_id: string
  pickup_location_id: string
  dropoff_location_id: string
  start_date: string
  end_date: string
  days_of_week: string[]
  service_type: string
  seats_booked: number
  selected_seats: number[]
}

const DAYS_MAP = {
  'Mon': '1',
  'Tue': '2',
  'Wed': '3',
  'Thu': '4',
  'Fri': '5',
  'Sat': '6',
  'Sun': '7'
}

const SERVICE_TYPES = [
  { value: 'morning', label: '🌅 Morning Only', desc: 'Home to school' },
  { value: 'evening', label: '🌆 Evening Only', desc: 'School to home' },
  { value: 'both', label: '🔄 Both Ways', desc: 'Morning & evening' }
]

export default function BookingFlow() {
  const [step, setStep] = useState(1)
  const [routes, setRoutes] = useState<Route[]>([])
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([])
  const [schoolLocations, setSchoolLocations] = useState<SchoolLocation[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [bookedSeats, setBookedSeats] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingSeats, setLoadingSeats] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState<BookingForm>({
    route_id: '',
    pickup_location_id: '',
    dropoff_location_id: '',
    start_date: '',
    end_date: '',
    days_of_week: [],
    service_type: '',
    seats_booked: 0,
    selected_seats: []
  })

  useEffect(() => {
    fetchRoutes()
  }, [])

  useEffect(() => {
    if (form.route_id) {
      fetchLocationsForRoute(parseInt(form.route_id))
      fetchVehiclesForRoute(parseInt(form.route_id))
    } else {
      setPickupLocations([])
      setSchoolLocations([])
      setVehicles([])
      setSelectedVehicle(null)
    }
  }, [form.route_id])

  useEffect(() => {
    if (selectedVehicle && form.start_date && form.end_date) {
      fetchBookedSeats()
    }
  }, [selectedVehicle, form.start_date, form.end_date])

  const fetchRoutes = async () => {
    try {
      const res = await apiFetch('/routes')
      const data = await res.json()
      setRoutes(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch routes', err)
      setError('Failed to load routes')
    }
  }

  const fetchLocationsForRoute = async (routeId: number) => {
    try {
      const pickupRes = await apiFetch(`/pickup_locations?route_id=${routeId}`)
      const pickupData = await pickupRes.json()
      
      const pickups = Array.isArray(pickupData) 
        ? pickupData 
        : Array.isArray(pickupData?.pickup_locations)
        ? pickupData.pickup_locations
        : []
      
      setPickupLocations(pickups)

      const schoolRes = await apiFetch('/school-locations/all')
      const schoolData = await schoolRes.json()
      
      const schools = Array.isArray(schoolData)
        ? schoolData.filter((s: SchoolLocation) => s.route_id === routeId)
        : []
      
      setSchoolLocations(schools)
    } catch (err) {
      console.error('Failed to fetch locations', err)
    }
  }

  const fetchVehiclesForRoute = async (routeId: number) => {
    try {
      const res = await apiFetch(`/vehicles?route_id=${routeId}`)
      const data = await res.json()
      
      const vehicleList = Array.isArray(data) ? data : Array.isArray(data?.vehicles) ? data.vehicles : []
      setVehicles(vehicleList)
      
      if (vehicleList.length > 0) {
        setSelectedVehicle(vehicleList[0])
      }
    } catch (err) {
      console.error('Failed to fetch vehicles', err)
    }
  }

  const fetchBookedSeats = async () => {
    if (!selectedVehicle || !form.start_date || !form.end_date) return

    setLoadingSeats(true)
    try {
      const res = await apiFetch(`/bookings?route_id=${form.route_id}`)
      const data = await res.json()
      
      const bookings: Booking[] = Array.isArray(data) ? data : []
      
      const bookedSeatNumbers = new Set<number>()
      
      const requestStart = new Date(form.start_date)
      const requestEnd = new Date(form.end_date)
      
      bookings.forEach((booking: Booking) => {
        if (booking.status !== 'active') return
        
        const bookingStart = new Date(booking.start_date)
        const bookingEnd = new Date(booking.end_date)
        
        const hasOverlap = requestStart <= bookingEnd && requestEnd >= bookingStart
        
        if (hasOverlap && booking.selected_seats && Array.isArray(booking.selected_seats)) {
          booking.selected_seats.forEach(seat => bookedSeatNumbers.add(seat))
        }
      })
      
      setBookedSeats(Array.from(bookedSeatNumbers))
      console.log('Booked seats:', Array.from(bookedSeatNumbers))
    } catch (err) {
      console.error('Failed to fetch booked seats', err)
      setBookedSeats([])
    } finally {
      setLoadingSeats(false)
    }
  }

  const toggleDay = (dayKey: string) => {
    const dayValue = DAYS_MAP[dayKey as keyof typeof DAYS_MAP]
    setForm(prev => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(dayValue)
        ? prev.days_of_week.filter(d => d !== dayValue)
        : [...prev.days_of_week, dayValue]
    }))
  }

  const toggleSeat = (seatNumber: number) => {
    if (bookedSeats.includes(seatNumber)) return

    setForm(prev => {
      const isSelected = prev.selected_seats.includes(seatNumber)
      const newSelectedSeats = isSelected
        ? prev.selected_seats.filter(s => s !== seatNumber)
        : [...prev.selected_seats, seatNumber]
      
      return {
        ...prev,
        selected_seats: newSelectedSeats,
        seats_booked: newSelectedSeats.length
      }
    })
  }

  const getSeatStatus = (seatNumber: number) => {
    if (bookedSeats.includes(seatNumber)) return 'booked'
    if (form.selected_seats.includes(seatNumber)) return 'selected'
    return 'available'
  }

  const renderSeatLayout = () => {
    if (!selectedVehicle) return null

    const totalSeats = selectedVehicle.capacity
    const rows = Math.ceil(totalSeats / 4)

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-[2rem] border-2 border-primary/20 shadow-lg">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="text-xs font-medium text-muted-foreground">Driver Section</div>
              <div className="text-sm font-bold text-foreground">{selectedVehicle.license_plate}</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-muted/10 rounded-2xl blur-sm" />
          <div className="relative border-4 border-border/50 rounded-2xl p-6 bg-gradient-to-br from-background to-muted/20 shadow-xl">
            {loadingSeats && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading seat availability...</p>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {Array.from({ length: rows }).map((_, rowIndex) => {
                const rowStart = rowIndex * 4 + 1
                
                return (
                  <div key={rowIndex} className="flex items-center justify-center gap-4">
                    <div className="flex gap-3">
                      {Array.from({ length: 2 }).map((_, seatIndex) => {
                        const seatNumber = rowStart + seatIndex
                        if (seatNumber > totalSeats) return <div key={seatIndex} className="w-14 h-14" />
                        
                        const status = getSeatStatus(seatNumber)
                        
                        return (
                          <button
                            key={seatNumber}
                            onClick={() => toggleSeat(seatNumber)}
                            disabled={status === 'booked'}
                            className={cn(
                              'relative w-14 h-14 rounded-xl border-2 transition-all duration-200',
                              'flex items-center justify-center group',
                              'focus:outline-none focus:ring-2 focus:ring-offset-2',
                              status === 'available' && [
                                'bg-white border-border shadow-sm',
                                'hover:border-primary hover:shadow-md hover:scale-105',
                                'focus:ring-primary'
                              ],
                              status === 'selected' && [
                                'bg-gradient-to-br from-primary to-primary/80',
                                'border-primary shadow-lg scale-105',
                                'text-primary-foreground',
                                'focus:ring-primary'
                              ],
                              status === 'booked' && [
                                'bg-gradient-to-br from-red-50 to-red-100',
                                'border-red-200 cursor-not-allowed opacity-60',
                                'shadow-inner'
                              ]
                            )}
                          >
                            <Armchair className={cn(
                              'w-7 h-7 transition-transform group-hover:scale-110',
                              status === 'selected' && 'text-white',
                              status === 'available' && 'text-muted-foreground',
                              status === 'booked' && 'text-red-400'
                            )} />
                            <span className={cn(
                              'absolute -top-2 -right-2 text-[10px] font-bold',
                              'w-5 h-5 rounded-full flex items-center justify-center',
                              'shadow-sm border',
                              status === 'selected' && 'bg-white text-primary border-primary',
                              status === 'available' && 'bg-muted text-foreground border-border',
                              status === 'booked' && 'bg-red-100 text-red-600 border-red-200'
                            )}>
                              {seatNumber}
                            </span>
                          </button>
                        )
                      })}
                    </div>

                    <div className="w-12 h-14 flex items-center justify-center">
                      <div className="w-1 h-full bg-gradient-to-b from-border/50 via-border to-border/50 rounded-full" />
                    </div>

                    <div className="flex gap-3">
                      {Array.from({ length: 2 }).map((_, seatIndex) => {
                        const seatNumber = rowStart + 2 + seatIndex
                        if (seatNumber > totalSeats) return <div key={seatIndex} className="w-14 h-14" />
                        
                        const status = getSeatStatus(seatNumber)
                        
                        return (
                          <button
                            key={seatNumber}
                            onClick={() => toggleSeat(seatNumber)}
                            disabled={status === 'booked'}
                            className={cn(
                              'relative w-14 h-14 rounded-xl border-2 transition-all duration-200',
                              'flex items-center justify-center group',
                              'focus:outline-none focus:ring-2 focus:ring-offset-2',
                              status === 'available' && [
                                'bg-white border-border shadow-sm',
                                'hover:border-primary hover:shadow-md hover:scale-105',
                                'focus:ring-primary'
                              ],
                              status === 'selected' && [
                                'bg-gradient-to-br from-primary to-primary/80',
                                'border-primary shadow-lg scale-105',
                                'text-primary-foreground',
                                'focus:ring-primary'
                              ],
                              status === 'booked' && [
                                'bg-gradient-to-br from-red-50 to-red-100',
                                'border-red-200 cursor-not-allowed opacity-60',
                                'shadow-inner'
                              ]
                            )}
                          >
                            <Armchair className={cn(
                              'w-7 h-7 transition-transform group-hover:scale-110',
                              status === 'selected' && 'text-white',
                              status === 'available' && 'text-muted-foreground',
                              status === 'booked' && 'text-red-400'
                            )} />
                            <span className={cn(
                              'absolute -top-2 -right-2 text-[10px] font-bold',
                              'w-5 h-5 rounded-full flex items-center justify-center',
                              'shadow-sm border',
                              status === 'selected' && 'bg-white text-primary border-primary',
                              status === 'available' && 'bg-muted text-foreground border-border',
                              status === 'booked' && 'bg-red-100 text-red-600 border-red-200'
                            )}>
                              {seatNumber}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border shadow-sm">
            <div className="w-5 h-5 bg-white border-2 border-border rounded-md" />
            <span className="font-medium">Available</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20 shadow-sm">
            <div className="w-5 h-5 bg-gradient-to-br from-primary to-primary/80 rounded-md shadow" />
            <span className="font-medium">Selected</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200 shadow-sm">
            <div className="w-5 h-5 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-md" />
            <span className="font-medium">Booked</span>
          </div>
        </div>

        {form.selected_seats.length > 0 && (
          <Alert className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/30">
            <Sparkles className="h-4 w-4 text-primary" />
            <AlertDescription className="flex items-center justify-between ml-2">
              <span className="font-semibold text-foreground">Your Selected Seats:</span>
              <div className="flex gap-2">
                {form.selected_seats.sort((a, b) => a - b).map(seat => (
                  <Badge key={seat} className="bg-primary text-white shadow-sm">{seat}</Badge>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="ml-2">
            {bookedSeats.length > 0 
              ? `${bookedSeats.length} seat${bookedSeats.length > 1 ? 's' : ''} already booked for this period. ${selectedVehicle.capacity - bookedSeats.length} seats available.`
              : `All ${selectedVehicle.capacity} seats are available for your selected dates!`
            }
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const user = localStorage.getItem('user')
      const userId = user ? JSON.parse(user).id : 1

      const payload = {
        user_id: userId,
        route_id: parseInt(form.route_id),
        pickup_location_id: parseInt(form.pickup_location_id),
        dropoff_location_id: parseInt(form.dropoff_location_id),
        start_date: form.start_date,
        end_date: form.end_date,
        days_of_week: form.days_of_week.sort().join(','),
        service_type: form.service_type,
        seats_booked: form.seats_booked,
        selected_seats: form.selected_seats
      }

      console.log('Submitting booking:', payload)

      const res = await apiFetch('/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Booking failed')
      }

      console.log('Booking created:', data)
      setSuccess(true)
      setStep(5)
    } catch (err: any) {
      console.error('Booking error:', err)
      setError(err.message || 'Failed to create booking')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setLoading(false)
    }
  }

  const canProceedStep1 = form.route_id && form.pickup_location_id && form.dropoff_location_id
  const canProceedStep2 = form.start_date && form.end_date && form.days_of_week.length > 0
  const canProceedStep3 = form.service_type
  const canProceedStep4 = form.selected_seats.length > 0

  const resetForm = () => {
    setForm({
      route_id: '',
      pickup_location_id: '',
      dropoff_location_id: '',
      start_date: '',
      end_date: '',
      days_of_week: [],
      service_type: '',
      seats_booked: 0,
      selected_seats: []
    })
    setStep(1)
    setSuccess(false)
    setError(null)
  }

  if (success) {
    return (
      <div className="min-h-[600px] flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full shadow-2xl border-0 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="pt-16 pb-16 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-20 animate-pulse" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
                  <CheckCircle2 className="w-14 h-14 text-white" />
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Booking Confirmed!
            </h2>
            <p className="text-muted-foreground mb-2 text-lg">
              Your school bus booking has been created successfully.
            </p>
            <p className="text-sm text-muted-foreground mb-8 flex items-center justify-center gap-2">
              <Armchair className="w-4 h-4" />
              Seats Reserved: {form.selected_seats.sort((a, b) => a - b).join(', ')}
            </p>

            <div className="space-y-3 max-w-xs mx-auto">
              <Button onClick={resetForm} className="w-full shadow-lg">
                Make Another Booking
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/dashboard/parent'}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map(num => (
              <div key={num} className="flex items-center flex-1">
                <div className="relative">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300',
                      'shadow-md',
                      step >= num
                        ? 'bg-gradient-to-br from-primary to-primary/80 text-white scale-110'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {step > num ? <CheckCircle2 className="w-6 h-6" /> : num}
                  </div>
                  {step === num && (
                    <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-30 animate-pulse" />
                  )}
                </div>
                {num < 4 && (
                  <div className="flex-1 h-1 mx-3 rounded-full overflow-hidden bg-muted">
                    <div 
                      className={cn(
                        'h-full transition-all duration-500 bg-gradient-to-r from-primary to-primary/80',
                        step > num ? 'w-full' : 'w-0'
                      )}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between text-sm mt-4">
            <span className={cn('font-medium transition-colors', step >= 1 ? 'text-foreground' : 'text-muted-foreground')}>
              Route & Locations
            </span>
            <span className={cn('font-medium transition-colors', step >= 2 ? 'text-foreground' : 'text-muted-foreground')}>
              Schedule
            </span>
            <span className={cn('font-medium transition-colors', step >= 3 ? 'text-foreground' : 'text-muted-foreground')}>
              Service Type
            </span>
            <span className={cn('font-medium transition-colors', step >= 4 ? 'text-foreground' : 'text-muted-foreground')}>
              Select Seats
            </span>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="shadow-lg">
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {step === 1 && (
        <Card className="shadow-xl border-0 bg-gradient-to-br from-background to-primary/5">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              Select Route & Locations
            </CardTitle>
            <CardDescription>Choose your route and pickup/dropoff points</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Bus className="w-4 h-4" />
                Select Route
              </Label>
              <Select value={form.route_id} onValueChange={(val) => {
                setForm({ ...form, route_id: val, pickup_location_id: '', dropoff_location_id: '' })
              }}>
                <SelectTrigger className="h-12 shadow-sm">
                  <SelectValue placeholder="Choose a route" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map(route => (
                    <SelectItem key={route.id} value={String(route.id)}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{route.name}</Badge>
                        <span className="text-muted-foreground text-sm">
                          {route.starting_point} → {route.ending_point}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {form.route_id && (
              <div className="space-y-2 animate-in slide-in-from-top duration-300">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <MapPinned className="w-4 h-4" />
                  Pickup Location
                </Label>
                <Select 
                  value={form.pickup_location_id} 
                  onValueChange={(val) => setForm({ ...form, pickup_location_id: val })}
                >
                  <SelectTrigger className="h-12 shadow-sm">
                    <SelectValue placeholder="Choose pickup point" />
                  </SelectTrigger>
                  <SelectContent>
                    {pickupLocations.map(loc => (
                      <SelectItem key={loc.id} value={String(loc.id)}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{loc.name}</span>
                          <span className="text-xs text-muted-foreground">{loc.gps_coordinates}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {form.route_id && (
              <div className="space-y-2 animate-in slide-in-from-top duration-300">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <MapPinned className="w-4 h-4 text-primary" />
                  School Destination
                </Label>
                <Select 
                  value={form.dropoff_location_id} 
                  onValueChange={(val) => setForm({ ...form, dropoff_location_id: val })}
                >
                  <SelectTrigger className="h-12 shadow-sm">
                    <SelectValue placeholder="Choose school" />
                  </SelectTrigger>
                  <SelectContent>
                    {schoolLocations.map(loc => (
                      <SelectItem key={loc.id} value={String(loc.id)}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{loc.name}</span>
                          <span className="text-xs text-muted-foreground">{loc.gps_coordinates}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button 
              className="w-full h-12 shadow-lg text-base" 
              disabled={!canProceedStep1}
              onClick={() => setStep(2)}
            >
              Continue <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="shadow-xl border-0 bg-gradient-to-br from-background to-primary/5">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              Set Schedule
            </CardTitle>
            <CardDescription>Choose your booking dates and days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-base font-semibold">Start Date</Label>
                <Input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="h-12 shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base font-semibold">End Date</Label>
                <Input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  min={form.start_date || new Date().toISOString().split('T')[0]}
                  className="h-12 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                Select Days of Week
              </Label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(DAYS_MAP).map(day => {
                  const dayValue = DAYS_MAP[day as keyof typeof DAYS_MAP]
                  const isSelected = form.days_of_week.includes(dayValue)
                  
                  return (
                    <Button
                      key={day}
                      type="button"
                      variant={isSelected ? 'default' : 'outline'}
                      onClick={() => toggleDay(day)}
                      className={cn('w-20 h-12 font-semibold transition-all', isSelected && 'shadow-lg scale-105')}
                    >
                      {day}
                    </Button>
                  )
                })}
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Info className="w-4 h-4" />
                Selected: {form.days_of_week.length} day(s) per week
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-12">
                Back
              </Button>
              <Button 
                className="flex-1 h-12 shadow-lg" 
                disabled={!canProceedStep2}
                onClick={() => setStep(3)}
              >
                Continue <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="shadow-xl border-0 bg-gradient-to-br from-background to-primary/5">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              Service Type
            </CardTitle>
            <CardDescription>Choose when you need the bus service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Select Service Time</Label>
              <div className="grid gap-3">
                {SERVICE_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setForm({ ...form, service_type: type.value })}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all hover:shadow-md',
                      form.service_type === type.value
                        ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]'
                        : 'border-border bg-white hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-lg">{type.label}</div>
                        <div className="text-sm text-muted-foreground mt-1">{type.desc}</div>
                      </div>
                      {form.service_type === type.value && (
                        <CheckCircle2 className="w-6 h-6 text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-12">
                Back
              </Button>
              <Button 
                className="flex-1 h-12 shadow-lg" 
                disabled={!canProceedStep3}
                onClick={() => setStep(4)}
              >
                Continue <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card className="shadow-xl border-0 bg-gradient-to-br from-background to-primary/5">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Armchair className="w-6 h-6 text-primary" />
              </div>
              Select Your Seats
            </CardTitle>
            {selectedVehicle && (
              <CardDescription className="flex items-center gap-4 pt-2">
                <Badge variant="outline" className="text-sm py-1">
                  {selectedVehicle.license_plate}
                </Badge>
                <span className="text-sm">
                  <Users className="w-4 h-4 inline mr-1" />
                  {selectedVehicle.capacity} total seats
                </span>
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {renderSeatLayout()}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(3)} className="flex-1 h-12">
                Back
              </Button>
              <Button 
                className="flex-1 h-12 shadow-lg" 
                disabled={!canProceedStep4 || loading}
                onClick={handleSubmit}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    Confirm Booking ({form.seats_booked} seat{form.seats_booked > 1 ? 's' : ''})
                    <CheckCircle2 className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}