'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Car, DollarSign, Users, Clock, Navigation, Bell, CheckCircle, AlertCircle } from 'lucide-react'
import ProfileCard from './components/ProfileCard'
import VehicleStatus from './components/VehicleStatus'
import RouteMap from './components/RouteMap'
import Earnings from './components/Earnings'

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

interface EarningsData {
  today: number
  thisWeek: number
  thisMonth: number
  totalTrips: number
  avgRating: number
}

interface AlertMessage {
  type: 'success' | 'error' | 'info'
  message: string
  id: number
}

const MOCK_SCHEDULE: DriverSchedule[] = [
  {
    id: 1,
    user_id: 1,
    vehicle_id: 1,
    pickup_location: "Freedom Heights Mall, Langatta, Nairobi",
    dropoff_location: "Nairobi School",
    start_date: "2026-02-05",
    end_date: "2026-02-20",
    days_of_week: "1,2,3,4,5",
    service_type: "both",
    seats_booked: 4,
    status: 'scheduled'
  },
  {
    id: 2,
    user_id: 1,
    vehicle_id: 1,
    pickup_location: "Westgate Mall, Nairobi",
    dropoff_location: "St. Mary's School",
    start_date: "2026-02-05",
    end_date: "2026-02-20",
    days_of_week: "1,3,5",
    service_type: "morning",
    seats_booked: 3,
    status: 'in-progress'
  }
]

const MOCK_VEHICLE: VehicleInfo = {
  id: 1,
  license_plate: 'KDC 123X',
  model: 'Scania',
  capacity: 42,
  current_passengers: 12,
  fuel_level: 85,
  status: 'active',
  next_service: '2024-03-15'
}

const MOCK_EARNINGS: EarningsData = {
  today: 8500,
  thisWeek: 42500,
  thisMonth: 124560,
  totalTrips: 156,
  avgRating: 4.8
}

export default function DriverDashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [schedule, setSchedule] = useState<DriverSchedule[]>(MOCK_SCHEDULE)
  const [vehicle, setVehicle] = useState<VehicleInfo>(MOCK_VEHICLE)
  const [earnings, setEarnings] = useState<EarningsData>(MOCK_EARNINGS)
  const [loading, setLoading] = useState(false)
  const [alerts, setAlerts] = useState<AlertMessage[]>([])
  
  // ✅ read after mount to avoid hydration mismatch
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    setUsername(localStorage.getItem('username'))
    // In production, fetch data from API
    // fetchDriverData()
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

  const currentTrip = schedule.find(trip => trip.status === 'in-progress')
  const today = new Date().toISOString().split('T')[0]
  const todaySchedule = schedule.filter(trip => trip.start_date === today)

  const passengersToday = todaySchedule.reduce((sum, trip) => sum + trip.seats_booked, 0)
  const tripsToday = todaySchedule.length

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome Driver{username ? `, ${username}` : ''}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your schedule, routes, and vehicle status
              </p>
            </div>
            <div className="flex items-center gap-3">
              {currentTrip && (
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 px-3 py-1.5">
                  <Navigation className="w-3 h-3" />
                  On Route
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
                rating={earnings.avgRating}
                totalTrips={earnings.totalTrips}
              />
              
              <Card className="border-border/50 bg-card shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Earnings Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Today</span>
                      <span className="font-bold text-foreground">KES {earnings.today.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">This Week</span>
                      <span className="font-bold text-foreground">KES {earnings.thisWeek.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">This Month</span>
                      <span className="font-bold text-foreground">KES {earnings.thisMonth.toLocaleString()}</span>
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
                  <TabsTrigger value="schedule" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Schedule</span>
                  </TabsTrigger>
                  <TabsTrigger value="earnings" className="gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Earnings</span>
                  </TabsTrigger>
                </TabsList>

                {/* DASHBOARD TAB */}
                <TabsContent value="dashboard" className="space-y-6">
                  {/* Current Trip Alert */}
                  {currentTrip && (
                    <Card className="border-emerald-500/30 bg-gradient-to-r from-emerald-50 to-white border-border/50 shadow-sm">
                      <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Navigation className="w-5 h-5 text-emerald-600" />
                              <h3 className="font-semibold text-emerald-700">Current Trip in Progress</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {currentTrip.pickup_location} → {currentTrip.dropoff_location}
                            </p>
                            <div className="flex items-center gap-4 mt-3">
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span>{currentTrip.seats_booked} passengers</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Car className="w-4 h-4 text-muted-foreground" />
                                <span className="capitalize">{currentTrip.service_type} service</span>
                              </div>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleCompleteTrip(currentTrip.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Complete Trip
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Today's Schedule */}
                  <Card className="border-border/50 bg-card shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Today's Schedule
                      </CardTitle>
                      <CardDescription>{todaySchedule.length} trips scheduled for today</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {todaySchedule.length > 0 ? (
                        <div className="space-y-4">
                          {todaySchedule.map(trip => (
                            <div key={trip.id} className="p-4 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium">{trip.pickup_location} → {trip.dropoff_location}</h4>
                                    <Badge variant={trip.status === 'in-progress' ? 'default' : 'outline'} className="capitalize">
                                      {trip.status}
                                    </Badge>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Users className="w-4 h-4" />
                                      {trip.seats_booked} passengers
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Car className="w-4 h-4" />
                                      {trip.service_type}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {trip.days_of_week.split(',').map(d => dayNames[parseInt(d) - 1]).join(', ')}
                                    </span>
                                  </div>
                                </div>
                                {trip.status === 'scheduled' && (
                                  <Button 
                                    size="sm"
                                    onClick={() => handleStartTrip(trip.id)}
                                    className="whitespace-nowrap"
                                  >
                                    Start Trip
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No trips scheduled for today</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-border/50 bg-gradient-to-br from-blue-50 to-white shadow-sm">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Passengers Today</p>
                            <p className="text-2xl font-bold text-foreground">{passengersToday}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-gradient-to-br from-emerald-50 to-white shadow-sm">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <Navigation className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Trips Today</p>
                            <p className="text-2xl font-bold text-foreground">{tripsToday}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-gradient-to-br from-amber-50 to-white shadow-sm">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-100 rounded-lg">
                            <Clock className="w-6 h-6 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">On-time Rate</p>
                            <p className="text-2xl font-bold text-foreground">94%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Route Map Preview */}
                  <Card className="border-border/50 bg-card shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Route Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RouteMap schedule={schedule} />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* SCHEDULE TAB */}
                <TabsContent value="schedule" className="space-y-6">
                  <Card className="border-border/50 bg-card shadow-sm">
                    <CardHeader>
                      <CardTitle>My Schedule</CardTitle>
                      <CardDescription>All your scheduled routes and assignments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {schedule.length > 0 ? (
                        <div className="space-y-4">
                          {schedule.map(trip => (
                            <Card key={trip.id} className="border-border/50">
                              <CardContent className="pt-6">
                                <div className="space-y-4">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="font-semibold text-lg mb-2">
                                        {trip.pickup_location} → {trip.dropoff_location}
                                      </h4>
                                      <div className="flex flex-wrap items-center gap-3">
                                        <Badge variant="outline" className="capitalize">
                                          {trip.service_type}
                                        </Badge>
                                        <Badge variant={trip.status === 'in-progress' ? 'default' : 'outline'}>
                                          {trip.status}
                                        </Badge>
                                      </div>
                                    </div>
                                    {trip.status === 'scheduled' && (
                                      <Button 
                                        size="sm"
                                        onClick={() => handleStartTrip(trip.id)}
                                      >
                                        Start Trip
                                      </Button>
                                    )}
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                                    <div>
                                      <p className="text-sm text-muted-foreground mb-1">Date Range</p>
                                      <p className="font-medium">{trip.start_date} to {trip.end_date}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground mb-1">Operating Days</p>
                                      <p className="font-medium">
                                        {trip.days_of_week.split(',').map(d => dayNames[parseInt(d) - 1]).join(', ')}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground mb-1">Passengers</p>
                                      <p className="font-medium">{trip.seats_booked} booked</p>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">No schedule available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* EARNINGS TAB */}
                <TabsContent value="earnings">
                  <Earnings earnings={earnings} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}