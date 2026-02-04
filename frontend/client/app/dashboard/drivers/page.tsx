'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Car, Users, Clock, Navigation, Bell, CheckCircle, AlertCircle, UserCheck, Sun, Moon } from 'lucide-react'
import ProfileCard from './components/ProfileCard'
import ScheduleView from './components/ScheduleView'
import PassengerTracking from './components/PassengerTracking'
import VehicleStatus from './components/VehicleStatus'
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
  trip_time?: string // Added for morning/evening timing
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
  trip_type: 'morning' | 'evening' // Added to track which trip
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
      { id: 1, name: "Emma Wilson", parent_name: "Sarah Wilson", parent_phone: "+254 712 345 678", pickup_location: "Freedom Heights Mall", dropoff_location: "Nairobi School", status: 'picked-up', checked_in_time: "07:30", trip_type: 'morning' },
      { id: 2, name: "Liam Davis", parent_name: "Michael Davis", parent_phone: "+254 723 456 789", pickup_location: "Freedom Heights Mall", dropoff_location: "Nairobi School", status: 'picked-up', checked_in_time: "07:32", trip_type: 'morning' },
      { id: 3, name: "Olivia Martinez", parent_name: "Maria Martinez", parent_phone: "+254 734 567 890", pickup_location: "Freedom Heights Mall", dropoff_location: "Nairobi School", status: 'pending', trip_type: 'morning' },
      { id: 4, name: "Noah Taylor", parent_name: "James Taylor", parent_phone: "+254 745 678 901", pickup_location: "Freedom Heights Mall", dropoff_location: "Nairobi School", status: 'pending', trip_type: 'morning' },
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
      { id: 5, name: "Emma Wilson", parent_name: "Sarah Wilson", parent_phone: "+254 712 345 678", pickup_location: "Nairobi School", dropoff_location: "Freedom Heights Mall", status: 'pending', trip_type: 'evening' },
      { id: 6, name: "Liam Davis", parent_name: "Michael Davis", parent_phone: "+254 723 456 789", pickup_location: "Nairobi School", dropoff_location: "Freedom Heights Mall", status: 'pending', trip_type: 'evening' },
      { id: 7, name: "Olivia Martinez", parent_name: "Maria Martinez", parent_phone: "+254 734 567 890", pickup_location: "Nairobi School", dropoff_location: "Freedom Heights Mall", status: 'pending', trip_type: 'evening' },
      { id: 8, name: "Noah Taylor", parent_name: "James Taylor", parent_phone: "+254 745 678 901", pickup_location: "Nairobi School", dropoff_location: "Freedom Heights Mall", status: 'pending', trip_type: 'evening' },
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
      { id: 9, name: "Sophia Brown", parent_name: "Robert Brown", parent_phone: "+254 756 789 012", pickup_location: "Westgate Mall", dropoff_location: "St. Mary's School", status: 'pending', trip_type: 'morning' },
      { id: 10, name: "Mason Wilson", parent_name: "Lisa Wilson", parent_phone: "+254 767 890 123", pickup_location: "Westgate Mall", dropoff_location: "St. Mary's School", status: 'pending', trip_type: 'morning' },
      { id: 11, name: "Isabella Clark", parent_name: "David Clark", parent_phone: "+254 778 901 234", pickup_location: "Westgate Mall", dropoff_location: "St. Mary's School", status: 'pending', trip_type: 'morning' },
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
      { id: 12, name: "Sophia Brown", parent_name: "Robert Brown", parent_phone: "+254 756 789 012", pickup_location: "St. Mary's School", dropoff_location: "Westgate Mall", status: 'pending', trip_type: 'evening' },
      { id: 13, name: "Mason Wilson", parent_name: "Lisa Wilson", parent_phone: "+254 767 890 123", pickup_location: "St. Mary's School", dropoff_location: "Westgate Mall", status: 'pending', trip_type: 'evening' },
      { id: 14, name: "Isabella Clark", parent_name: "David Clark", parent_phone: "+254 778 901 234", pickup_location: "St. Mary's School", dropoff_location: "Westgate Mall", status: 'pending', trip_type: 'evening' },
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
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome Driver{username ? `, ${username}` : ''}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage morning & evening trips, track passengers, and update vehicle status
              </p>
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
                  {currentTrip.service_type.toUpperCase()} TRIP • On Route
                </Badge>
              )}
              <Button size="sm" variant="ghost" className="gap-2">
                <Bell className="w-4 h-4" />
                Alerts
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Profile & Stats */}
            <div className="lg:col-span-1 space-y-6">
              <ProfileCard 
                name={username || 'Driver'}
                license="DL-001234"
                phone="+254 712 345 678"
                rating={4.8}
                totalTrips={156}
              />
              
              {/* Today's Trip Summary */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Today's Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-amber-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-amber-700">{morningTrips.length}</div>
                      <div className="text-xs text-amber-600">Morning Trips</div>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-indigo-700">{eveningTrips.length}</div>
                      <div className="text-xs text-indigo-600">Evening Trips</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Completed</span>
                      <span className="font-medium">{completedTrips.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Active</span>
                      <span className="font-medium">{currentTrip ? 1 : 0}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Upcoming</span>
                      <span className="font-medium">{upcomingTrip ? 1 : 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <VehicleStatus vehicle={vehicle} />
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-auto bg-card border border-border/50">
                  <TabsTrigger value="dashboard" className="gap-2">
                    <Navigation className="w-4 h-4" />
                    <span>Dashboard</span>
                  </TabsTrigger>
                  <TabsTrigger value="passengers" className="gap-2">
                    <UserCheck className="w-4 h-4" />
                    <span>Passengers</span>
                  </TabsTrigger>
                  <TabsTrigger value="schedule" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Schedule</span>
                  </TabsTrigger>
                </TabsList>

                {/* DASHBOARD TAB */}
                <TabsContent value="dashboard" className="space-y-6">
                  {/* Current Trip Management */}
                  {currentTrip ? (
                    <TripManagement 
                      trip={currentTrip}
                      onCompleteTrip={() => handleCompleteTrip(currentTrip.id)}
                      onMarkPassenger={(passengerId, status) => 
                        handleMarkPassenger(currentTrip.id, passengerId, status)
                      }
                    />
                  ) : upcomingTrip ? (
                    <Card className="border-border/50">
                      <CardContent className="pt-6">
                        <div className="text-center py-6">
                          <div className={`p-3 rounded-full w-16 h-16 mx-auto mb-4 ${
                            upcomingTrip.service_type === 'morning' 
                              ? 'bg-amber-100 text-amber-600' 
                              : 'bg-indigo-100 text-indigo-600'
                          }`}>
                            {upcomingTrip.service_type === 'morning' ? (
                              <Sun className="w-8 h-8 mx-auto" />
                            ) : (
                              <Moon className="w-8 h-8 mx-auto" />
                            )}
                          </div>
                          <h3 className="font-semibold text-foreground mb-2">
                            Next {upcomingTrip.service_type} Trip Ready
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            {upcomingTrip.pickup_location.split(',')[0]} → {upcomingTrip.dropoff_location.split(',')[0]}
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button 
                              onClick={() => handleStartTrip(upcomingTrip.id)}
                              className={upcomingTrip.service_type === 'morning' 
                                ? 'bg-amber-600 hover:bg-amber-700' 
                                : 'bg-indigo-600 hover:bg-indigo-700'
                              }
                            >
                              Start {upcomingTrip.service_type} Trip
                            </Button>
                            <Button variant="outline" onClick={() => setActiveTab('schedule')}>
                              View All Trips
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border-border/50">
                      <CardContent className="pt-6">
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="font-semibold text-foreground mb-2">No Trips Scheduled</h3>
                          <p className="text-muted-foreground">All trips for today are completed</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Today's Schedule Split by Morning/Evening */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Morning Trips */}
                    <Card className="border-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <div className="p-2 bg-amber-100 rounded-lg">
                            <Sun className="w-5 h-5 text-amber-600" />
                          </div>
                          Morning Trips
                          <Badge variant="outline" className="ml-2">
                            {morningTrips.length}
                          </Badge>
                        </CardTitle>
                        <CardDescription>Pickup from home to school</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {morningTrips.length > 0 ? (
                          <ScheduleView 
                            schedule={morningTrips}
                            onStartTrip={handleStartTrip}
                            onCompleteTrip={handleCompleteTrip}
                          />
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-muted-foreground">No morning trips scheduled</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Evening Trips */}
                    <Card className="border-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <Moon className="w-5 h-5 text-indigo-600" />
                          </div>
                          Evening Trips
                          <Badge variant="outline" className="ml-2">
                            {eveningTrips.length}
                          </Badge>
                        </CardTitle>
                        <CardDescription>Dropoff from school to home</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {eveningTrips.length > 0 ? (
                          <ScheduleView 
                            schedule={eveningTrips}
                            onStartTrip={handleStartTrip}
                            onCompleteTrip={handleCompleteTrip}
                          />
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-muted-foreground">No evening trips scheduled</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Vehicle & Route Overview */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Car className="w-5 h-5" />
                          Vehicle Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">License Plate</span>
                            <span className="font-medium">{vehicle.license_plate}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Current Passengers</span>
                            <span className="font-medium">{vehicle.current_passengers}/{vehicle.capacity}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Fuel Level</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    vehicle.fuel_level > 60 ? 'bg-emerald-500' : 
                                    vehicle.fuel_level > 30 ? 'bg-amber-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${vehicle.fuel_level}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{vehicle.fuel_level}%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="w-5 h-5" />
                          Today's Routes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RouteMap schedule={todaySchedule} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* PASSENGERS TAB */}
                <TabsContent value="passengers">
                  {currentTrip ? (
                    <PassengerTracking 
                      trip={currentTrip}
                      onMarkPassenger={(passengerId, status) => 
                        handleMarkPassenger(currentTrip.id, passengerId, status)
                      }
                    />
                  ) : (
                    <Card className="border-border/50">
                      <CardContent className="pt-6">
                        <div className="text-center py-8">
                          <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="font-semibold text-foreground mb-2">No Active Trip</h3>
                          <p className="text-muted-foreground mb-4">Start a trip to begin passenger tracking</p>
                          <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            {upcomingTrip && (
                              <Button 
                                onClick={() => handleStartTrip(upcomingTrip.id)}
                                className={upcomingTrip.service_type === 'morning' 
                                  ? 'bg-amber-600 hover:bg-amber-700' 
                                  : 'bg-indigo-600 hover:bg-indigo-700'
                                }
                              >
                                Start {upcomingTrip.service_type} Trip
                              </Button>
                            )}
                            <Button variant="outline" onClick={() => setActiveTab('schedule')}>
                              View Schedule
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* SCHEDULE TAB */}
                <TabsContent value="schedule" className="space-y-6">
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle>My Schedule</CardTitle>
                      <CardDescription>All your scheduled morning and evening trips</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Morning Trips Section */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <Sun className="w-5 h-5 text-amber-600" />
                            <h3 className="font-semibold">Morning Trips</h3>
                            <Badge variant="outline">{morningTrips.length} scheduled</Badge>
                          </div>
                          {morningTrips.length > 0 ? (
                            <ScheduleView 
                              schedule={morningTrips}
                              onStartTrip={handleStartTrip}
                              onCompleteTrip={handleCompleteTrip}
                              showAll={true}
                            />
                          ) : (
                            <p className="text-muted-foreground text-center py-4">No morning trips</p>
                          )}
                        </div>

                        {/* Evening Trips Section */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <Moon className="w-5 h-5 text-indigo-600" />
                            <h3 className="font-semibold">Evening Trips</h3>
                            <Badge variant="outline">{eveningTrips.length} scheduled</Badge>
                          </div>
                          {eveningTrips.length > 0 ? (
                            <ScheduleView 
                              schedule={eveningTrips}
                              onStartTrip={handleStartTrip}
                              onCompleteTrip={handleCompleteTrip}
                              showAll={true}
                            />
                          ) : (
                            <p className="text-muted-foreground text-center py-4">No evening trips</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}