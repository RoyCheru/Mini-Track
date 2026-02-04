'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Car, Users, Clock, Navigation, Bell, CheckCircle, AlertCircle, UserCheck, Sun, Moon, Menu, X } from 'lucide-react'
import ScheduleView from './components/ScheduleView'
import PassengerTracking from './components/PassengerTracking'
import RouteMap from './components/RouteMap'
import TripManagement from './components/TripManagement'

interface DriverSchedule {
  id: number
  user_id: number
  vehicle_id: number
  pickup_location: string
  dropoff_location: string
  start_date: string
  end_date: string
  days_of_week: string
  service_type: 'morning' | 'evening' | 'both'
  seats_booked: number
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  trip_time?: string
  passengers?: Passenger[]
}

interface Passenger {
  id: number
  name: string
  parent_name: string
  parent_phone: string
  pickup_location: string
  dropoff_location: string
  status: 'pending' | 'picked-up' | 'dropped-off' | 'absent'
  checked_in_time?: string
  checked_out_time?: string
  trip_type: 'morning' | 'evening'
}

interface VehicleInfo {
  id: number
  license_plate: string
  model: string
  capacity: number
  current_passengers: number
  fuel_level: number
  status: 'active' | 'maintenance' | 'offline'
  next_service: string
}

interface AlertMessage {
  type: 'success' | 'error' | 'info'
  message: string
  id: number
}

// Mock data with morning and evening trips
const MOCK_SCHEDULE: DriverSchedule[] = [
  {
    id: 1,
    user_id: 1,
    vehicle_id: 1,
    pickup_location: "Freedom Heights Mall, Langatta, Nairobi",
    dropoff_location: "Nairobi School",
    start_date: "2024-02-15",
    end_date: "2024-02-20",
    days_of_week: "1,2,3,4,5",
    service_type: "morning",
    seats_booked: 4,
    status: 'in-progress',
    trip_time: "07:00 AM",
    passengers: [
      { id: 1, name: "Heeba Hassan", parent_name: "Hassan", parent_phone: "+254 712 345 678", pickup_location: "Freedom Heights Mall", dropoff_location: "Nairobi School", status: 'picked-up', checked_in_time: "07:30", trip_type: 'morning' },
      { id: 2, name: "Kamau Joseph", parent_name: "Micheal Njeri", parent_phone: "+254 723 456 789", pickup_location: "Freedom Heights Mall", dropoff_location: "Nairobi School", status: 'picked-up', checked_in_time: "07:32", trip_type: 'morning' },
      { id: 3, name: "Dan Rotich", parent_name: "Michael Doe", parent_phone: "+254 734 567 890", pickup_location: "Freedom Heights Mall", dropoff_location: "Nairobi School", status: 'pending', trip_type: 'morning' },
      { id: 4, name: "Fourtune", parent_name: "James Kamau", parent_phone: "+254 745 678 901", pickup_location: "Freedom Heights Mall", dropoff_location: "Nairobi School", status: 'pending', trip_type: 'morning' },
    ]
  },
  {
    id: 2,
    user_id: 1,
    vehicle_id: 1,
    pickup_location: "Nairobi School",
    dropoff_location: "Freedom Heights Mall, Langatta, Nairobi",
    start_date: "2024-02-15",
    end_date: "2024-02-20",
    days_of_week: "1,2,3,4,5",
    service_type: "evening",
    seats_booked: 4,
    status: 'scheduled',
    trip_time: "03:30 PM",
    passengers: [
      { id: 5, name: "Heeba Hassan", parent_name: "Hassan", parent_phone: "+254 712 345 678", pickup_location: "Nairobi School", dropoff_location: "Freedom Heights Mall", status: 'pending', trip_type: 'evening' },
      { id: 6, name: "Kamau Joseph", parent_name: "Micheal Njeri", parent_phone: "+254 723 456 789", pickup_location: "Nairobi School", dropoff_location: "Freedom Heights Mall", status: 'pending', trip_type: 'evening' },
      { id: 7, name: "Dan Rotich", parent_name: "Michael Doe", parent_phone: "+254 734 567 890", pickup_location: "Nairobi School", dropoff_location: "Freedom Heights Mall", status: 'pending', trip_type: 'evening' },
      { id: 8, name: "Fourtune", parent_name: "James Kamau", parent_phone: "+254 745 678 901", pickup_location: "Nairobi School", dropoff_location: "Freedom Heights Mall", status: 'pending', trip_type: 'evening' },
    ]
  },
  {
    id: 3,
    user_id: 1,
    vehicle_id: 1,
    pickup_location: "Westgate Mall, Nairobi",
    dropoff_location: "St. Mary's School",
    start_date: "2024-02-15",
    end_date: "2024-02-20",
    days_of_week: "1,3,5",
    service_type: "morning",
    seats_booked: 3,
    status: 'scheduled',
    trip_time: "07:15 AM",
    passengers: [
      { id: 9, name: "Sophia Benard", parent_name: "Robert Njoroge", parent_phone: "+254 756 789 012", pickup_location: "Westgate Mall", dropoff_location: "St. Mary's School", status: 'pending', trip_type: 'morning' },
      { id: 10, name: "Mason Otieno", parent_name: "Lisa Awino", parent_phone: "+254 767 890 123", pickup_location: "Westgate Mall", dropoff_location: "St. Mary's School", status: 'pending', trip_type: 'morning' },
      { id: 11, name: "Abdul Abdi", parent_name: "Samira said", parent_phone: "+254 778 901 234", pickup_location: "Westgate Mall", dropoff_location: "St. Mary's School", status: 'pending', trip_type: 'morning' },
    ]
  },
  {
    id: 4,
    user_id: 1,
    vehicle_id: 1,
    pickup_location: "St. Mary's School",
    dropoff_location: "Westgate Mall, Nairobi",
    start_date: "2024-02-15",
    end_date: "2024-02-20",
    days_of_week: "1,3,5",
    service_type: "evening",
    seats_booked: 3,
    status: 'scheduled',
    trip_time: "04:00 PM",
    passengers: [
      { id: 12, name: "Sophia Benard", parent_name: "Robert Njoroge", parent_phone: "+254 756 789 012", pickup_location: "St. Mary's School", dropoff_location: "Westgate Mall", status: 'pending', trip_type: 'evening' },
      { id: 13, name: "Mason Otieno", parent_name: "Lisa Awino", parent_phone: "+254 767 890 123", pickup_location: "St. Mary's School", dropoff_location: "Westgate Mall", status: 'pending', trip_type: 'evening' },
      { id: 14, name: "Abdul Abdi", parent_name: "Samira said", parent_phone: "+254 778 901 234", pickup_location: "St. Mary's School", dropoff_location: "Westgate Mall", status: 'pending', trip_type: 'evening' },
    ]
  }
]

const MOCK_VEHICLE: VehicleInfo = {
  id: 1,
  license_plate: 'KDC 123X',
  model: 'Scania Coach',
  capacity: 42,
  current_passengers: 2,
  fuel_level: 85,
  status: 'active',
  next_service: '2024-03-15'
}

export default function DriverDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [schedule, setSchedule] = useState<DriverSchedule[]>(MOCK_SCHEDULE)
  const [vehicle, setVehicle] = useState<VehicleInfo>(MOCK_VEHICLE)
  const [loading, setLoading] = useState(false)
  const [alerts, setAlerts] = useState<AlertMessage[]>([])
  const [showProfile, setShowProfile] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // ✅ read after mount to avoid hydration mismatch
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    setUsername(localStorage.getItem('username'))
  }, [])

  const addAlert = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now()
    setAlerts(prev => [...prev, { type, message, id }])
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id))
    }, 4000)
  }

  const fetchDriverData = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      addAlert('success', 'Schedule loaded successfully')
    } catch (error) {
      addAlert('error', 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleStartTrip = (tripId: number) => {
    setSchedule(prev => prev.map(trip => 
      trip.id === tripId ? { ...trip, status: 'in-progress' } : trip
    ))
    const trip = schedule.find(t => t.id === tripId)
    addAlert('success', `${trip?.service_type} trip started successfully`)
  }

  const handleCompleteTrip = (tripId: number) => {
    setSchedule(prev => prev.map(trip => 
      trip.id === tripId ? { ...trip, status: 'completed' } : trip
    ))
    const trip = schedule.find(t => t.id === tripId)
    addAlert('success', `${trip?.service_type} trip completed successfully`)
    
    // If morning trip completed, check if there's an evening trip to auto-start
    if (trip?.service_type === 'morning') {
      const eveningTrip = schedule.find(t => 
        t.status === 'scheduled' && 
        t.service_type === 'evening' &&
        t.start_date === trip.start_date
      )
      if (eveningTrip) {
        setTimeout(() => {
          addAlert('info', `Evening trip to ${eveningTrip.dropoff_location} is ready to start`)
        }, 2000)
      }
    }
  }

  const handleMarkPassenger = (tripId: number, passengerId: number, status: 'picked-up' | 'dropped-off' | 'absent') => {
    setSchedule(prev => prev.map(trip => {
      if (trip.id === tripId && trip.passengers) {
        const updatedPassengers = trip.passengers.map(passenger => {
          if (passenger.id === passengerId) {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            return {
              ...passenger,
              status,
              ...(status === 'picked-up' ? { checked_in_time: time } : {}),
              ...(status === 'dropped-off' ? { checked_out_time: time } : {})
            }
          }
          return passenger
        })
        
        // Update vehicle passenger count
        if (status === 'picked-up') {
          setVehicle(prev => ({ ...prev, current_passengers: prev.current_passengers + 1 }))
        } else if (status === 'dropped-off') {
          setVehicle(prev => ({ ...prev, current_passengers: Math.max(0, prev.current_passengers - 1) }))
        }
        
        return { ...trip, passengers: updatedPassengers }
      }
      return trip
    }))
    
    const action = status === 'picked-up' ? 'picked up' : status === 'dropped-off' ? 'dropped off' : 'marked absent'
    addAlert('success', `Passenger ${action} successfully`)
  }

  const currentTrip = schedule.find(trip => trip.status === 'in-progress')
  const today = new Date().toISOString().split('T')[0]
  const todaySchedule = schedule.filter(trip => trip.start_date === today)
  
  // Separate morning and evening trips
  const morningTrips = todaySchedule.filter(trip => trip.service_type === 'morning')
  const eveningTrips = todaySchedule.filter(trip => trip.service_type === 'evening')
  const completedTrips = todaySchedule.filter(trip => trip.status === 'completed')

  // Days mapping
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // Get upcoming trips
  const getUpcomingTrip = () => {
    if (currentTrip) return null
    return todaySchedule.find(trip => trip.status === 'scheduled')
  }

  const upcomingTrip = getUpcomingTrip()

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      {/* Alert Banner */}
      {alerts.length > 0 && (
        <div className="sticky top-0 z-50 px-4 py-2 space-y-2">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`rounded-lg border p-4 animate-in slide-in-from-top duration-300 ${
                alert.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : alert.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {alert.type === 'success' && <CheckCircle className="w-4 h-4" />}
                {alert.type === 'error' && <AlertCircle className="w-4 h-4" />}
                <p className="text-sm font-medium">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              
               <div className="relative">
  <div className="absolute -left-3 top-0 h-full w-1 bg-gradient-to-b from-blue-400 to-blue-300 rounded-full"></div>
  <div className="pl-2">
    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
      Driver Dashboard
    </h1>
    <p className="text-sm text-blue-700/70 mt-0.5">
      Welcome back, <span className="font-medium text-blue-800">{username || 'Driver'}</span>
    </p>
  </div>
</div>
            </div>
            
            <div className="flex items-center gap-3">
              {currentTrip && (
                <Badge className={`gap-2 px-3 py-1.5 ${
                  currentTrip.service_type === 'morning' 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                }`}>
                  {currentTrip.service_type === 'morning' ? (
                    <Sun className="w-3 h-3" />
                  ) : (
                    <Moon className="w-3 h-3" />
                  )}
                  {currentTrip.service_type.toUpperCase()} TRIP
                </Badge>
              )}
              
              {/* Profile Avatar Button */}
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full h-10 w-10 hover:bg-blue-50 transition-colors"
                onClick={() => setShowProfile(true)}
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {(username || 'D').charAt(0)}
                  </span>
                </div>
              </Button>
              
              <Button 
                size="icon" 
                variant="ghost" 
                className="gap-2 hover:bg-blue-50 transition-colors"
              >
                <Bell className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute right-0 top-16 h-full w-64 bg-card border-l shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {(username || 'D').charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{username || 'Driver'}</h3>
                  <p className="text-sm text-slate-600">Professional Driver</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition-colors"
                  onClick={() => {
                    setActiveTab('dashboard')
                    setMobileMenuOpen(false)
                  }}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition-colors"
                  onClick={() => {
                    setActiveTab('passengers')
                    setMobileMenuOpen(false)
                  }}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Passengers
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition-colors"
                  onClick={() => {
                    setActiveTab('schedule')
                    setMobileMenuOpen(false)
                  }}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content  */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-slate-600">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Today's Summary */}
            <div className="mb-8">
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Today's Overview</h2>
                      <p className="text-sm text-slate-600 mt-1">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center bg-amber-50 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-amber-700">{morningTrips.length}</div>
                        <div className="text-sm text-amber-600">Morning</div>
                      </div>
                      <div className="text-center bg-indigo-50 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-indigo-700">{eveningTrips.length}</div>
                        <div className="text-sm text-indigo-600">Evening</div>
                      </div>
                      <div className="text-center bg-emerald-50 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-700">{completedTrips.length}</div>
                        <div className="text-sm text-emerald-600">Completed</div>
                      </div>
                      <div className="text-center bg-blue-50 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-blue-700">{vehicle.current_passengers}</div>
                        <div className="text-sm text-blue-600">On Board</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs Navigation */}
            <div className="mb-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-3 bg-slate-50 border border-slate-200 rounded-xl p-1">
                  <TabsTrigger 
                    value="dashboard" 
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm data-[state=active]:border-slate-300 data-[state=active]:border hover:text-slate-700 transition-all duration-200"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger 
                    value="passengers" 
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm data-[state=active]:border-slate-300 data-[state=active]:border hover:text-slate-700 transition-all duration-200"
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Passengers
                  </TabsTrigger>
                  <TabsTrigger 
                    value="schedule" 
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm data-[state=active]:border-slate-300 data-[state=active]:border hover:text-slate-700 transition-all duration-200"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Tab Content */}
            <div>
              {/* DASHBOARD TAB */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  {/* Current Trip Management OR Upcoming Trip */}
                  {currentTrip ? (
                    <TripManagement 
                      trip={currentTrip}
                      onCompleteTrip={() => handleCompleteTrip(currentTrip.id)}
                      onMarkPassenger={(passengerId, status) => 
                        handleMarkPassenger(currentTrip.id, passengerId, status)
                      }
                    />
                  ) : upcomingTrip ? (
                    <Card className="border-slate-200 bg-white shadow-sm">
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                          <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-full ${
                              upcomingTrip.service_type === 'morning' 
                                ? 'bg-amber-100 text-amber-600' 
                                : 'bg-indigo-100 text-indigo-600'
                            }`}>
                              {upcomingTrip.service_type === 'morning' ? (
                                <Sun className="w-8 h-8" />
                              ) : (
                                <Moon className="w-8 h-8" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-slate-900">
                                Next {upcomingTrip.service_type} Trip Ready
                              </h3>
                              <p className="text-slate-600">
                                {upcomingTrip.pickup_location.split(',')[0]} → {upcomingTrip.dropoff_location.split(',')[0]}
                              </p>
                              <p className="text-sm text-slate-500 mt-1">
                                {upcomingTrip.seats_booked} passengers • {upcomingTrip.trip_time}
                              </p>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleStartTrip(upcomingTrip.id)}
                            className={`px-6 ${
                              upcomingTrip.service_type === 'morning' 
                                ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            }`}
                          >
                            Start {upcomingTrip.service_type} Trip
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border-slate-200 bg-white shadow-sm">
                      <CardContent className="pt-6">
                        <div className="text-center py-6">
                          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                          <h3 className="font-semibold text-slate-900 mb-2">All Trips Completed</h3>
                          <p className="text-slate-600">Great job! All scheduled trips for today are completed.</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Today's Trips Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Morning Trips */}
                    <Card className="border-slate-200 bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-900">
                          <div className="p-2 bg-amber-100 rounded-lg">
                            <Sun className="w-5 h-5 text-amber-600" />
                          </div>
                          Morning Trips
                          <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                            {morningTrips.length}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-slate-600">Pickup from home to school</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {morningTrips.length > 0 ? (
                          <ScheduleView 
                            schedule={morningTrips}
                            onStartTrip={handleStartTrip}
                            onCompleteTrip={handleCompleteTrip}
                          />
                        ) : (
                          <div className="text-center py-6">
                            <p className="text-slate-500">No morning trips scheduled</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Evening Trips */}
                    <Card className="border-slate-200 bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-900">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <Moon className="w-5 h-5 text-indigo-600" />
                          </div>
                          Evening Trips
                          <Badge variant="outline" className="ml-2 bg-indigo-50 text-indigo-700 border-indigo-200">
                            {eveningTrips.length}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-slate-600">Dropoff from school to home</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {eveningTrips.length > 0 ? (
                          <ScheduleView 
                            schedule={eveningTrips}
                            onStartTrip={handleStartTrip}
                            onCompleteTrip={handleCompleteTrip}
                          />
                        ) : (
                          <div className="text-center py-6">
                            <p className="text-slate-500">No evening trips scheduled</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Vehicle & Route Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Vehicle Status */}
                    <Card className="border-slate-200 bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-900">
                          <Car className="w-5 h-5" />
                          Vehicle Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-slate-600 mb-1">License Plate</p>
                              <p className="font-bold text-lg text-slate-900">{vehicle.license_plate}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600 mb-1">Model</p>
                              <p className="font-medium text-slate-900">{vehicle.model}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-slate-600">Passenger Occupancy</span>
                                <span className="text-sm font-medium text-slate-900">{vehicle.current_passengers}/{vehicle.capacity}</span>
                              </div>
                              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${(vehicle.current_passengers / vehicle.capacity) * 100}%` }}
                                />
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-slate-600">Fuel Level</span>
                                <span className="text-sm font-medium text-slate-900">{vehicle.fuel_level}%</span>
                              </div>
                              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    vehicle.fuel_level > 60 ? 'bg-emerald-500' : 
                                    vehicle.fuel_level > 30 ? 'bg-amber-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${vehicle.fuel_level}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">Next Service</span>
                            <span className="font-medium text-slate-900">{vehicle.next_service}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Route Map */}
                    <Card className="border-slate-200 bg-white shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-900">
                          <MapPin className="w-5 h-5" />
                          Today's Routes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RouteMap schedule={todaySchedule} />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* PASSENGERS TAB */}
              {activeTab === 'passengers' && (
                <div>
                  {currentTrip ? (
                    <PassengerTracking 
                      trip={currentTrip}
                      onMarkPassenger={(passengerId, status) => 
                        handleMarkPassenger(currentTrip.id, passengerId, status)
                      }
                    />
                  ) : (
                    <Card className="border-slate-200 bg-white shadow-sm">
                      <CardContent className="pt-6">
                        <div className="text-center py-8">
                          <UserCheck className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                          <h3 className="font-semibold text-slate-900 mb-2">No Active Trip</h3>
                          <p className="text-slate-600 mb-4">Start a trip to begin passenger tracking</p>
                          <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            {upcomingTrip && (
                              <Button 
                                onClick={() => handleStartTrip(upcomingTrip.id)}
                                className={upcomingTrip.service_type === 'morning' 
                                  ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                }
                              >
                                Start {upcomingTrip.service_type} Trip
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              className="border-slate-300 text-slate-700 hover:bg-slate-50"
                              onClick={() => setActiveTab('schedule')}
                            >
                              View Schedule
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* SCHEDULE TAB */}
              {activeTab === 'schedule' && (
                <div className="space-y-6">
                  <Card className="border-slate-200 bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-slate-900">My Schedule</CardTitle>
                      <CardDescription className="text-slate-600">All your scheduled morning and evening trips</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        {/* Morning Trips Section */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <Sun className="w-5 h-5 text-amber-600" />
                            <h3 className="font-semibold text-lg text-slate-900">Morning Trips</h3>
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              {morningTrips.length} scheduled
                            </Badge>
                          </div>
                          {morningTrips.length > 0 ? (
                            <ScheduleView 
                              schedule={morningTrips}
                              onStartTrip={handleStartTrip}
                              onCompleteTrip={handleCompleteTrip}
                              showAll={true}
                            />
                          ) : (
                            <div className="text-center py-6 border border-slate-200 rounded-lg bg-slate-50">
                              <p className="text-slate-500">No morning trips scheduled</p>
                            </div>
                          )}
                        </div>

                        {/* Evening Trips Section */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <Moon className="w-5 h-5 text-indigo-600" />
                            <h3 className="font-semibold text-lg text-slate-900">Evening Trips</h3>
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                              {eveningTrips.length} scheduled
                            </Badge>
                          </div>
                          {eveningTrips.length > 0 ? (
                            <ScheduleView 
                              schedule={eveningTrips}
                              onStartTrip={handleStartTrip}
                              onCompleteTrip={handleCompleteTrip}
                              showAll={true}
                            />
                          ) : (
                            <div className="text-center py-6 border border-slate-200 rounded-lg bg-slate-50">
                              <p className="text-slate-500">No evening trips scheduled</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">Driver Profile</h2>
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-slate-100 text-slate-600"
                  onClick={() => setShowProfile(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-white font-medium text-2xl">
                      {(username || 'D').charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{username || 'Driver'}</h3>
                  <p className="text-sm text-slate-600">Professional Driver</p>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-sm text-slate-500 mb-1">License Number</p>
                      <p className="font-medium text-slate-900">DL-001234</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-sm text-slate-500 mb-1">Phone</p>
                      <p className="font-medium text-slate-900">+254 712 345 678</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Email</p>
                    <p className="font-medium text-slate-900">driver@example.com</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                    <div className="text-center bg-amber-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-amber-700">4.8</div>
                      <div className="text-xs text-amber-600">Rating</div>
                    </div>
                    <div className="text-center bg-blue-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700">156</div>
                      <div className="text-xs text-blue-600">Total Trips</div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6"
                  onClick={() => setShowProfile(false)}
                >
                  Close Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}