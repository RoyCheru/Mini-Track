'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Car, Users, Clock, Navigation, Bell, CheckCircle, AlertCircle, UserCheck } from 'lucide-react'
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

// Mock data with passengers
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
    passengers: [
      { id: 1, name: "Emma Wilson", parent_name: "Sarah Wilson", parent_phone: "+254 712 345 678", pickup_location: "Freedom Heights Mall", dropoff_location: "Nairobi School", status: 'picked-up', checked_in_time: "07:30" },
      { id: 2, name: "Liam Davis", parent_name: "Michael Davis", parent_phone: "+254 723 456 789", pickup_location: "Freedom Heights Mall", dropoff_location: "Nairobi School", status: 'picked-up', checked_in_time: "07:32" },
      { id: 3, name: "Olivia Martinez", parent_name: "Maria Martinez", parent_phone: "+254 734 567 890", pickup_location: "Freedom Heights Mall", dropoff_location: "Nairobi School", status: 'pending' },
      { id: 4, name: "Noah Taylor", parent_name: "James Taylor", parent_phone: "+254 745 678 901", pickup_location: "Freedom Heights Mall", dropoff_location: "Nairobi School", status: 'pending' },
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
    passengers: [
      { id: 1, name: "Emma Wilson", parent_name: "Sarah Wilson", parent_phone: "+254 712 345 678", pickup_location: "Nairobi School", dropoff_location: "Freedom Heights Mall", status: 'pending' },
      { id: 2, name: "Liam Davis", parent_name: "Michael Davis", parent_phone: "+254 723 456 789", pickup_location: "Nairobi School", dropoff_location: "Freedom Heights Mall", status: 'pending' },
      { id: 3, name: "Olivia Martinez", parent_name: "Maria Martinez", parent_phone: "+254 734 567 890", pickup_location: "Nairobi School", dropoff_location: "Freedom Heights Mall", status: 'pending' },
      { id: 4, name: "Noah Taylor", parent_name: "James Taylor", parent_phone: "+254 745 678 901", pickup_location: "Nairobi School", dropoff_location: "Freedom Heights Mall", status: 'pending' },
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
  
  // read after mount to avoid hydration mismatch
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
      addAlert('success', 'Data loaded successfully')
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
    addAlert('success', 'Trip started successfully')
  }

  const handleCompleteTrip = (tripId: number) => {
    setSchedule(prev => prev.map(trip => 
      trip.id === tripId ? { ...trip, status: 'completed' } : trip
    ))
    addAlert('success', 'Trip completed successfully')
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

  // Days mapping
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

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
                Manage trips, track passengers, and update vehicle status
              </p>
            </div>
            <div className="flex items-center gap-3">
              {currentTrip && (
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 px-3 py-1.5">
                  <Navigation className="w-3 h-3" />
                  On Route • {currentTrip.service_type.toUpperCase()} TRIP
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
              
              {/* Current Trip Stats */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    Current Trip Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentTrip ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Passengers</span>
                        <span className="font-bold text-foreground">
                          {currentTrip.passengers?.filter(p => p.status === 'picked-up').length || 0}/{currentTrip.seats_booked}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge className="bg-emerald-500 text-white">
                          {currentTrip.service_type}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Route</span>
                        <span className="text-sm font-medium text-right">
                          {currentTrip.pickup_location.split(',')[0]} → {currentTrip.dropoff_location.split(',')[0]}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-sm text-muted-foreground">No active trip</p>
                    </div>
                  )}
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
                  ) : (
                    <Card className="border-border/50">
                      <CardContent className="pt-6">
                        <div className="text-center py-8">
                          <Navigation className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="font-semibold text-foreground mb-2">No Active Trip</h3>
                          <p className="text-muted-foreground mb-4">Start a trip from your schedule to begin passenger tracking</p>
                          <Button onClick={() => setActiveTab('schedule')}>
                            View Schedule
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Today's Schedule */}
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Today's Schedule
                      </CardTitle>
                      <CardDescription>Your trips for today ({todaySchedule.length} scheduled)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScheduleView 
                        schedule={todaySchedule}
                        onStartTrip={handleStartTrip}
                        onCompleteTrip={handleCompleteTrip}
                      />
                    </CardContent>
                  </Card>

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
                          Route Overview
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
                            <Button onClick={() => setActiveTab('schedule')}>
                              View Schedule
                            </Button>
                            {todaySchedule.length > 0 && (
                              <Button 
                                variant="outline"
                                onClick={() => handleStartTrip(todaySchedule[0].id)}
                              >
                                Start Next Trip
                              </Button>
                            )}
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
                      <CardDescription>All your scheduled routes and assignments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScheduleView 
                        schedule={schedule}
                        onStartTrip={handleStartTrip}
                        onCompleteTrip={handleCompleteTrip}
                        showAll={true}
                      />
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