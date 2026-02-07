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
  Info,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Home,
  School,
  Route
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

// Helper function to get current user ID
function getCurrentUserId(): number | null {
  if (typeof window === 'undefined') return null
  
  const userId = localStorage.getItem('user_id')
  return userId ? parseInt(userId, 10) : null
}

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
  selected_dates: string[]
  service_type: string
  seats_booked: number
}

const SERVICE_TYPES = [
  { 
    value: 'morning', 
    label: 'Morning Only', 
    desc: 'Home to school',
    icon: '🌅',
    gradient: 'from-amber-400 via-orange-400 to-rose-400'
  },
  { 
    value: 'evening', 
    label: 'Evening Only', 
    desc: 'School to home',
    icon: '🌆',
    gradient: 'from-purple-400 via-pink-400 to-rose-400'
  },
  { 
    value: 'both', 
    label: 'Both Ways', 
    desc: 'Morning & evening',
    icon: '🔄',
    gradient: 'from-blue-400 via-cyan-400 to-teal-400'
  }
]

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// Vibrant gradient backgrounds for calendar dates
const DATE_GRADIENTS = [
  'from-violet-400 to-purple-500',
  'from-blue-400 to-indigo-500',
  'from-cyan-400 to-blue-500',
  'from-teal-400 to-emerald-500',
  'from-green-400 to-teal-500',
  'from-amber-400 to-orange-500',
  'from-rose-400 to-pink-500',
]

export default function BookingFlow() {
  const [step, setStep] = useState(1)
  const [routes, setRoutes] = useState<Route[]>([])
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([])
  const [schoolLocations, setSchoolLocations] = useState<SchoolLocation[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [availableSeats, setAvailableSeats] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [loadingSeats, setLoadingSeats] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [redirectCountdown, setRedirectCountdown] = useState(5)

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const [form, setForm] = useState<BookingForm>({
    route_id: '',
    pickup_location_id: '',
    dropoff_location_id: '',
    start_date: '',
    end_date: '',
    selected_dates: [],
    service_type: '',
    seats_booked: 1
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
    if (selectedVehicle && form.selected_dates.length > 0) {
      fetchAvailableSeats()
    }
  }, [selectedVehicle, form.selected_dates])

  // Auto-redirect countdown after successful booking
  useEffect(() => {
    if (success && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (success && redirectCountdown === 0) {
      window.location.href = '/dashboard/parent'
    }
  }, [success, redirectCountdown])

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
        setAvailableSeats(vehicleList[0].capacity)
      }
    } catch (err) {
      console.error('Failed to fetch vehicles', err)
    }
  }

  const fetchAvailableSeats = async () => {
    if (!selectedVehicle || form.selected_dates.length === 0) return

    setLoadingSeats(true)
    try {
      const res = await apiFetch(`/bookings?route_id=${form.route_id}`)
      const data = await res.json()
      
      const bookings: Booking[] = Array.isArray(data) ? data : []
      
      let maxBookedSeats = 0
      
      form.selected_dates.forEach(selectedDate => {
        const dateBookings = bookings.filter((booking: Booking) => {
          if (booking.status !== 'active') return false
          
          const bookingStart = new Date(booking.start_date)
          const bookingEnd = new Date(booking.end_date)
          const checkDate = new Date(selectedDate)
          
          return checkDate >= bookingStart && checkDate <= bookingEnd
        })
        
        const totalSeatsOnDate = dateBookings.reduce((sum, b) => sum + b.seats_booked, 0)
        maxBookedSeats = Math.max(maxBookedSeats, totalSeatsOnDate)
      })
      
      const available = selectedVehicle.capacity - maxBookedSeats
      setAvailableSeats(Math.max(0, available))
      
      if (form.seats_booked > available) {
        setForm(prev => ({ ...prev, seats_booked: Math.max(1, available) }))
      }
    } catch (err) {
      console.error('Failed to fetch available seats', err)
      setAvailableSeats(selectedVehicle.capacity)
    } finally {
      setLoadingSeats(false)
    }
  }

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const isDateSelected = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return form.selected_dates.includes(dateStr)
  }

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const toggleDate = (date: Date) => {
    if (isDateDisabled(date)) return
    
    const dateStr = date.toISOString().split('T')[0]
    
    setForm(prev => {
      const isSelected = prev.selected_dates.includes(dateStr)
      const newDates = isSelected
        ? prev.selected_dates.filter(d => d !== dateStr)
        : [...prev.selected_dates, dateStr].sort()
      
      const startDate = newDates.length > 0 ? newDates[0] : ''
      const endDate = newDates.length > 0 ? newDates[newDates.length - 1] : ''
      
      return {
        ...prev,
        selected_dates: newDates,
        start_date: startDate,
        end_date: endDate
      }
    })
  }

  const getDateGradient = (day: number) => {
    return DATE_GRADIENTS[day % DATE_GRADIENTS.length]
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    
    const days = []
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />)
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const isSelected = isDateSelected(date)
      const isDisabled = isDateDisabled(date)
      const isToday = date.toDateString() === new Date().toDateString()
      const gradient = getDateGradient(day)
      
      days.push(
        <button
          key={day}
          onClick={() => toggleDate(date)}
          disabled={isDisabled}
          className={cn(
            'aspect-square rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300',
            'hover:scale-110 focus:outline-none focus:ring-4 focus:ring-offset-2 relative group',
            isSelected && [
              `bg-gradient-to-br ${gradient}`,
              'text-white shadow-2xl scale-110 ring-4 ring-white/50',
              'animate-in zoom-in duration-200'
            ],
            !isSelected && !isDisabled && [
              'bg-gradient-to-br from-white to-gray-50',
              'border-2 border-gray-200',
              'hover:border-transparent',
              `hover:bg-gradient-to-br hover:${gradient}`,
              'hover:text-white hover:shadow-xl'
            ],
            isDisabled && 'bg-gray-100 text-gray-300 cursor-not-allowed opacity-40',
            isToday && !isSelected && 'ring-2 ring-blue-400 ring-offset-2',
          )}
        >
          {isSelected && (
            <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse" />
          )}
          <span className="relative z-10">{day}</span>
          {isSelected && (
            <div className={cn(
              "absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white shadow-lg flex items-center justify-center",
              "animate-in zoom-in duration-300"
            )}>
              <CheckCircle2 className="w-3 h-3 text-green-500" />
            </div>
          )}
        </button>
      )
    }
    
    return days
  }

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const incrementSeats = () => {
    if (form.seats_booked < availableSeats) {
      setForm(prev => ({ ...prev, seats_booked: prev.seats_booked + 1 }))
    }
  }

  const decrementSeats = () => {
    if (form.seats_booked > 1) {
      setForm(prev => ({ ...prev, seats_booked: prev.seats_booked - 1 }))
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const userId = getCurrentUserId()
      
      if (!userId) {
        setError('User not authenticated. Please log in again.')
        setLoading(false)
        return
      }

      const daysOfWeek = new Set<number>()
      form.selected_dates.forEach(dateStr => {
        const date = new Date(dateStr)
        const dayOfWeek = date.getDay()
        daysOfWeek.add(dayOfWeek === 0 ? 7 : dayOfWeek)
      })

      const payload = {
        user_id: userId,
        route_id: parseInt(form.route_id),
        pickup_location_id: parseInt(form.pickup_location_id),
        dropoff_location_id: parseInt(form.dropoff_location_id),
        start_date: form.start_date,
        end_date: form.end_date,
        days_of_week: Array.from(daysOfWeek).sort().join(','),
        service_type: form.service_type,
        seats_booked: form.seats_booked,
        selected_seats: []
      }

      const res = await apiFetch('/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Booking failed')
      }

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
  const canProceedStep2 = form.selected_dates.length > 0
  const canProceedStep3 = form.service_type
  const canProceedStep4 = form.seats_booked > 0 && form.seats_booked <= availableSeats

  const resetForm = () => {
    setForm({
      route_id: '',
      pickup_location_id: '',
      dropoff_location_id: '',
      start_date: '',
      end_date: '',
      selected_dates: [],
      service_type: '',
      seats_booked: 1
    })
    setStep(1)
    setSuccess(false)
    setRedirectCountdown(5)
    setError(null)
    setCurrentMonth(new Date().getMonth())
    setCurrentYear(new Date().getFullYear())
  }

  if (success) {
    return (
      <div className="min-h-[600px] flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Card className="max-w-2xl w-full shadow-2xl border-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-emerald-400/10 to-teal-400/10" />
          <CardContent className="pt-16 pb-16 text-center relative z-10">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-3xl opacity-30 animate-pulse" />
                <div className="relative w-28 h-28 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl animate-in zoom-in duration-500">
                  <CheckCircle2 className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Booking Confirmed! 🎉
            </h2>
            <p className="text-muted-foreground mb-3 text-lg">
              Your school bus booking has been created successfully.
            </p>
            
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full border-2 border-blue-200">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-blue-900">{form.seats_booked} Seats</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full border-2 border-purple-200">
                <CalendarDays className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-purple-900">{form.selected_dates.length} Days</span>
              </div>
            </div>

            {/* Countdown Message */}
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-700 font-medium">
                Redirecting to dashboard in <span className="font-bold text-xl text-blue-900">{redirectCountdown}</span> seconds...
              </p>
            </div>

            <div className="space-y-3 max-w-xs mx-auto">
              <Button 
                onClick={() => window.location.href = '/dashboard/parent'}
                className="w-full shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-12 text-base"
              >
                Go to Dashboard Now
              </Button>
              <Button 
                variant="outline"
                onClick={resetForm}
                className="w-full h-12 border-2"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Make Another Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-5xl mx-auto space-y-6 p-4">
        {/* Progress Steps */}
        <Card className="shadow-xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
          <CardContent className="pt-8 pb-8 relative z-10">
            <div className="flex items-center justify-between mb-6">
              {[1, 2, 3, 4].map(num => (
                <div key={num} className="flex items-center flex-1">
                  <div className="relative">
                    <div
                      className={cn(
                        'w-14 h-14 rounded-2xl flex items-center justify-center font-bold transition-all duration-500',
                        'shadow-lg transform',
                        step >= num
                          ? 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white scale-110 rotate-3'
                          : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500'
                      )}
                    >
                      {step > num ? <CheckCircle2 className="w-7 h-7" /> : num}
                    </div>
                    {step === num && (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur-2xl opacity-40 animate-pulse" />
                    )}
                  </div>
                  {num < 4 && (
                    <div className="flex-1 h-2 mx-4 rounded-full overflow-hidden bg-gradient-to-r from-gray-200 to-gray-300">
                      <div 
                        className={cn(
                          'h-full transition-all duration-700 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
                          step > num ? 'w-full' : 'w-0'
                        )}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-between text-sm mt-4 px-2">
              <span className={cn('font-semibold transition-colors', step >= 1 ? 'text-purple-600' : 'text-gray-400')}>
                📍 Route
              </span>
              <span className={cn('font-semibold transition-colors', step >= 2 ? 'text-purple-600' : 'text-gray-400')}>
                📅 Schedule
              </span>
              <span className={cn('font-semibold transition-colors', step >= 3 ? 'text-purple-600' : 'text-gray-400')}>
                🕒 Service
              </span>
              <span className={cn('font-semibold transition-colors', step >= 4 ? 'text-purple-600' : 'text-gray-400')}>
                💺 Seats
              </span>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="shadow-xl border-2 animate-in slide-in-from-top duration-300">
            <AlertDescription className="font-medium text-base">{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Route & Locations */}
        {step === 1 && (
          <Card className="shadow-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-sm animate-in fade-in slide-in-from-bottom duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-red-400/10 to-pink-400/10" />
            <CardHeader className="space-y-2 relative z-10">
              <CardTitle className="flex items-center gap-3 text-3xl">
                <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl shadow-lg">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Select Route & Locations
                </span>
              </CardTitle>
              <CardDescription className="text-base">Choose your journey details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="space-y-3">
                <Label className="text-lg font-bold flex items-center gap-2 text-gray-700">
                  <Route className="w-5 h-5 text-orange-500" />
                  Select Route
                </Label>
                <Select value={form.route_id} onValueChange={(val) => {
                  setForm({ ...form, route_id: val, pickup_location_id: '', dropoff_location_id: '' })
                }}>
                  <SelectTrigger className="h-14 shadow-lg border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 hover:border-orange-400 transition-all">
                    <SelectValue placeholder="🚌 Choose your route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map(route => (
                      <SelectItem key={route.id} value={String(route.id)}>
                        <div className="flex items-center gap-3 py-1">
                          <Badge className="bg-gradient-to-r from-orange-500 to-red-500">{route.name}</Badge>
                          <span className="text-muted-foreground">
                            {route.starting_point} → {route.ending_point}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {form.route_id && (
                <div className="space-y-3 animate-in slide-in-from-top duration-500">
                  <Label className="text-lg font-bold flex items-center gap-2 text-gray-700">
                    <Home className="w-5 h-5 text-blue-500" />
                    Pickup Location
                  </Label>
                  <Select 
                    value={form.pickup_location_id} 
                    onValueChange={(val) => setForm({ ...form, pickup_location_id: val })}
                  >
                    <SelectTrigger className="h-14 shadow-lg border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 hover:border-blue-400 transition-all">
                      <SelectValue placeholder="🏠 Choose pickup point" />
                    </SelectTrigger>
                    <SelectContent>
                      {pickupLocations.map(loc => (
                        <SelectItem key={loc.id} value={String(loc.id)}>
                          <div className="flex flex-col items-start py-1">
                            <span className="font-semibold">{loc.name}</span>
                            <span className="text-xs text-muted-foreground">{loc.gps_coordinates}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {form.route_id && (
                <div className="space-y-3 animate-in slide-in-from-top duration-500 delay-100">
                  <Label className="text-lg font-bold flex items-center gap-2 text-gray-700">
                    <School className="w-5 h-5 text-purple-500" />
                    School Destination
                  </Label>
                  <Select 
                    value={form.dropoff_location_id} 
                    onValueChange={(val) => setForm({ ...form, dropoff_location_id: val })}
                  >
                    <SelectTrigger className="h-14 shadow-lg border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 hover:border-purple-400 transition-all">
                      <SelectValue placeholder="🏫 Choose school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolLocations.map(loc => (
                        <SelectItem key={loc.id} value={String(loc.id)}>
                          <div className="flex flex-col items-start py-1">
                            <span className="font-semibold">{loc.name}</span>
                            <span className="text-xs text-muted-foreground">{loc.gps_coordinates}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button 
                className="w-full h-14 shadow-xl text-lg font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 transform hover:scale-105 transition-all" 
                disabled={!canProceedStep1}
                onClick={() => setStep(2)}
              >
                Continue to Schedule <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Calendar Schedule */}
        {step === 2 && (
          <Card className="shadow-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-sm animate-in fade-in slide-in-from-bottom duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-pink-400/10" />
            <CardHeader className="space-y-2 relative z-10">
              <CardTitle className="flex items-center gap-3 text-3xl">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Select Your Dates
                </span>
              </CardTitle>
              <CardDescription className="text-base">Pick the days you need the bus service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              {/* Calendar Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={previousMonth}
                  className="h-12 w-12 rounded-xl bg-white/20 hover:bg-white/30 text-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                    {MONTHS[currentMonth]} {currentYear}
                  </h3>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextMonth}
                  className="h-12 w-12 rounded-xl bg-white/20 hover:bg-white/30 text-white"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-3xl shadow-2xl p-6 border-4 border-white">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-3 mb-4">
                  {DAYS_OF_WEEK.map((day, idx) => (
                    <div
                      key={day}
                      className={cn(
                        "text-center text-sm font-bold py-3 rounded-xl",
                        idx === 0 || idx === 6 
                          ? "bg-gradient-to-br from-pink-100 to-rose-100 text-rose-600" 
                          : "bg-gradient-to-br from-blue-100 to-purple-100 text-purple-600"
                      )}
                    >
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-3">
                  {renderCalendar()}
                </div>
              </div>

              {/* Selected Dates Info */}
              {form.selected_dates.length > 0 && (
                <Alert className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg animate-in slide-in-from-bottom duration-300">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <AlertDescription className="ml-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-lg text-purple-900">
                          {form.selected_dates.length} Day{form.selected_dates.length > 1 ? 's' : ''} Selected
                        </span>
                        <div className="text-sm text-purple-600 mt-1">
                          {new Date(form.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(form.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setForm(prev => ({ ...prev, selected_dates: [], start_date: '', end_date: '' }))}
                        className="text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                      >
                        Clear all
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)} 
                  className="flex-1 h-14 border-2 text-base font-semibold"
                >
                  Back
                </Button>
                <Button 
                  className="flex-1 h-14 shadow-xl text-lg font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all" 
                  disabled={!canProceedStep2}
                  onClick={() => setStep(3)}
                >
                  Continue <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Service Type */}
        {step === 3 && (
          <Card className="shadow-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-sm animate-in fade-in slide-in-from-bottom duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-orange-400/10 to-rose-400/10" />
            <CardHeader className="space-y-2 relative z-10">
              <CardTitle className="flex items-center gap-3 text-3xl">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Service Type
                </span>
              </CardTitle>
              <CardDescription className="text-base">Choose when you need the bus service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="grid gap-4">
                {SERVICE_TYPES.map((type, idx) => (
                  <button
                    key={type.value}
                    onClick={() => setForm({ ...form, service_type: type.value })}
                    className={cn(
                      'p-6 rounded-2xl border-3 text-left transition-all duration-300 transform hover:scale-105',
                      'relative overflow-hidden group',
                      form.service_type === type.value
                        ? 'border-transparent shadow-2xl scale-105'
                        : 'border-gray-200 bg-white hover:border-transparent hover:shadow-xl'
                    )}
                  >
                    <div className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300",
                      type.gradient,
                      form.service_type === type.value ? 'opacity-100' : 'group-hover:opacity-10'
                    )} />
                    
                    {form.service_type === type.value && (
                      <div className={cn(
                        "absolute inset-0 bg-gradient-to-br animate-pulse",
                        type.gradient
                      )} />
                    )}
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "text-5xl p-4 rounded-2xl",
                          form.service_type === type.value 
                            ? 'bg-white/20 shadow-lg' 
                            : 'bg-gradient-to-br from-gray-100 to-gray-200'
                        )}>
                          {type.icon}
                        </div>
                        <div>
                          <div className={cn(
                            "font-bold text-2xl mb-1",
                            form.service_type === type.value ? 'text-white' : 'text-gray-900'
                          )}>
                            {type.label}
                          </div>
                          <div className={cn(
                            "text-base",
                            form.service_type === type.value ? 'text-white/90' : 'text-gray-600'
                          )}>
                            {type.desc}
                          </div>
                        </div>
                      </div>
                      {form.service_type === type.value && (
                        <CheckCircle2 className="w-10 h-10 text-white animate-in zoom-in duration-300" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(2)} 
                  className="flex-1 h-14 border-2 text-base font-semibold"
                >
                  Back
                </Button>
                <Button 
                  className="flex-1 h-14 shadow-xl text-lg font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 transform hover:scale-105 transition-all" 
                  disabled={!canProceedStep3}
                  onClick={() => setStep(4)}
                >
                  Continue <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Number of Seats */}
        {step === 4 && (
          <Card className="shadow-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-sm animate-in fade-in slide-in-from-bottom duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-400/10 to-purple-400/10" />
            <CardHeader className="space-y-2 relative z-10">
              <CardTitle className="flex items-center gap-3 text-3xl">
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Number of Seats
                </span>
              </CardTitle>
              {selectedVehicle && (
                <CardDescription className="flex items-center gap-4 pt-2">
                  <Badge className="text-base py-1.5 px-3 bg-gradient-to-r from-cyan-500 to-blue-600">
                    {selectedVehicle.license_plate}
                  </Badge>
                  <span className="text-base font-semibold">
                    <Bus className="w-5 h-5 inline mr-2" />
                    {selectedVehicle.capacity} Total Capacity
                  </span>
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-8 relative z-10">
              {loadingSeats ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground font-semibold">Checking availability...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Available Seats Display */}
                  <div className="relative bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-3xl p-10 shadow-2xl overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
                    
                    <div className="text-center mb-8 relative z-10">
                      <div className="inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-white/20 backdrop-blur-sm shadow-2xl mb-6 transform hover:scale-110 transition-transform">
                        <Armchair className="w-14 h-14 text-white" />
                      </div>
                      <h3 className="text-5xl font-black text-white mb-3 drop-shadow-lg">
                        {availableSeats} Seats
                      </h3>
                      <p className="text-xl text-white/90 font-medium">
                        Available out of {selectedVehicle?.capacity} total
                      </p>
                    </div>

                    {/* Seat Counter */}
                    <div className="flex items-center justify-center gap-8 mb-8">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={decrementSeats}
                        disabled={form.seats_booked <= 1}
                        className="h-16 w-16 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-sm shadow-xl disabled:opacity-30"
                      >
                        <Minus className="w-8 h-8 text-white" />
                      </Button>

                      <div className="text-center min-w-[160px] bg-white/20 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
                        <div className="text-6xl font-black text-white mb-2 drop-shadow-lg">
                          {form.seats_booked}
                        </div>
                        <div className="text-lg text-white/90 font-semibold uppercase tracking-wider">
                          Seat{form.seats_booked > 1 ? 's' : ''}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={incrementSeats}
                        disabled={form.seats_booked >= availableSeats}
                        className="h-16 w-16 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-sm shadow-xl disabled:opacity-30"
                      >
                        <Plus className="w-8 h-8 text-white" />
                      </Button>
                    </div>

                    {/* Quick Select Buttons */}
                    <div className="flex gap-3 justify-center flex-wrap">
                      {[1, 2, 3, 5, 10].filter(num => num <= availableSeats).map(num => (
                        <Button
                          key={num}
                          variant="ghost"
                          onClick={() => setForm(prev => ({ ...prev, seats_booked: num }))}
                          className={cn(
                            "min-w-[70px] h-12 font-bold text-lg rounded-xl transition-all",
                            form.seats_booked === num 
                              ? 'bg-white text-cyan-600 shadow-xl scale-110' 
                              : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
                          )}
                        >
                          {num}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Info Alert */}
                  <Alert className={cn(
                    "border-2 shadow-lg",
                    availableSeats === 0 
                      ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-300"
                      : availableSeats < 5
                      ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-300"
                      : "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300"
                  )}>
                    <Info className={cn(
                      "h-5 w-5",
                      availableSeats === 0 ? "text-red-600" : availableSeats < 5 ? "text-orange-600" : "text-blue-600"
                    )} />
                    <AlertDescription className="ml-2 font-semibold">
                      {availableSeats === 0 ? (
                        <span className="text-red-700">
                          ⚠️ No seats available for the selected dates. Please choose different dates.
                        </span>
                      ) : availableSeats < 5 ? (
                        <span className="text-orange-700">
                          🔥 Only {availableSeats} seat{availableSeats > 1 ? 's' : ''} remaining! Book now before they're gone.
                        </span>
                      ) : (
                        <span className="text-blue-700">
                          ✨ Seats will be reserved for all {form.selected_dates.length} selected day{form.selected_dates.length > 1 ? 's' : ''}.
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>

                  {/* Booking Summary */}
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-2xl p-6 space-y-4 border-2 border-blue-100 shadow-lg">
                    <h4 className="font-bold text-lg text-gray-700 uppercase tracking-wide flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-500" />
                      Booking Summary
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
                        <span className="font-semibold text-gray-700">Number of seats</span>
                        <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-base px-4 py-1.5">
                          {form.seats_booked}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
                        <span className="font-semibold text-gray-700">Number of days</span>
                        <Badge variant="outline" className="border-2 border-purple-300 text-purple-700 text-base px-4 py-1.5">
                          {form.selected_dates.length}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
                        <span className="font-semibold text-gray-700">Service type</span>
                        <Badge className={cn(
                          "text-base px-4 py-1.5 bg-gradient-to-r",
                          SERVICE_TYPES.find(t => t.value === form.service_type)?.gradient
                        )}>
                          {SERVICE_TYPES.find(t => t.value === form.service_type)?.icon} {' '}
                          {SERVICE_TYPES.find(t => t.value === form.service_type)?.label.replace(/🌅|🌆|🔄/g, '')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(3)} 
                  className="flex-1 h-14 border-2 text-base font-semibold"
                >
                  Back
                </Button>
                <Button 
                  className="flex-1 h-14 shadow-xl text-lg font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all" 
                  disabled={!canProceedStep4 || loading || loadingSeats}
                  onClick={handleSubmit}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating Booking...
                    </>
                  ) : (
                    <>
                      Confirm Booking
                      <CheckCircle2 className="w-6 h-6 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}