'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calendar, MapPin, Car, DollarSign, Users, Clock, Navigation, Bell } from 'lucide-react'
import ProfileCard from './components/ProfileCard'
import ScheduleView from './components/ScheduleView'
import BookingRequests from './components/BookingRequests'
import VehicleStatus from './components/VehicleStatus'
import RouteMap from './components/RouteMap'
import Earnings from './components/Earnings'
import { fetchDriverSchedule } from './utils/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface DriverSchedule {
  user_id: number;
  vehicle_id: number;
  pickup_location: string;
  dropoff_location: string;
  start_date: string;
  end_date: string;
  days_of_week: string;
  service_type: 'morning' | 'evening' | 'both';
  seats_booked: number;
  status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

interface VehicleInfo {
  id: number;
  license_plate: string;
  model: string;
  capacity: number;
  current_passengers: number;
  fuel_level: number;
  status: 'active' | 'maintenance' | 'offline';
  next_service: string;
}

interface EarningsData {
  today: number;
  thisWeek: number;
  thisMonth: number;
  totalTrips: number;
  avgRating: number;
}

interface AlertMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

const MOCK_VEHICLE: VehicleInfo = {
  id: 1,
  license_plate: 'KDC 123X',
  model: 'Scania',
  capacity: 42,
  current_passengers: 12,
  fuel_level: 85,
  status: 'active',
  next_service: '2024-03-15'
};

const MOCK_EARNINGS: EarningsData = {
  today: 8500,
  thisWeek: 42500,
  thisMonth: 124560,
  totalTrips: 156,
  avgRating: 4.8
};

export default function DriverDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [schedule, setSchedule] = useState<DriverSchedule[]>([])
  const [vehicle, setVehicle] = useState<VehicleInfo>(MOCK_VEHICLE)
  const [earnings, setEarnings] = useState<EarningsData>(MOCK_EARNINGS)
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState<AlertMessage | null>(null)
  const username = typeof window !== 'undefined' ? localStorage.getItem("username") || 'Driver' : 'Driver'

  // Fetch driver data
  const fetchDriverData = async () => {
    try {
      setLoading(true)
      const driverId = localStorage.getItem("user_id") || "1"
      const scheduleData = await fetchDriverSchedule(parseInt(driverId))
      setSchedule(scheduleData)
      
      setAlert({
        type: 'success',
        message: 'Schedule loaded successfully'
      })
      
      // Clear alert after 3 seconds
      setTimeout(() => setAlert(null), 3000)
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to load driver data'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDriverData()
  }, [])

  const handleStartTrip = (trip: DriverSchedule) => {
    setSchedule(schedule.map(s => 
      s === trip ? { ...s, status: 'in-progress' } : s
    ))
    setAlert({
      type: 'success',
      message: 'Trip started successfully'
    })
    setTimeout(() => setAlert(null), 3000)
  }

  const handleCompleteTrip = (trip: DriverSchedule) => {
    setSchedule(schedule.map(s => 
      s === trip ? { ...s, status: 'completed' } : s
    ))
    setAlert({
      type: 'success',
      message: 'Trip completed successfully'
    })
    setTimeout(() => setAlert(null), 3000)
  }

  const currentTrip = schedule.find(s => s.status === 'in-progress')

  // Filter today's schedule
  const today = new Date().toISOString().split('T')[0]
  const todaySchedule = schedule.filter(s => {
    const scheduleDate = new Date(s.start_date)
    return scheduleDate.toISOString().split('T')[0] === today
  })

  // Calculate stats
  const passengersToday = todaySchedule.reduce((sum, trip) => sum + trip.seats_booked, 0)
  const tripsToday = todaySchedule.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Alert Banner */}
      {alert && (
        <div className="sticky top-0 z-50">
          <Alert className={`
            ${alert.type === 'success' ? 'bg-green-50 border-green-200' : ''}
            ${alert.type === 'error' ? 'bg-red-50 border-red-200' : ''}
            ${alert.type === 'info' ? 'bg-blue-50 border-blue-200' : ''}
            border-b
          `}>
            <AlertDescription className={`
              ${alert.type === 'success' ? 'text-green-800' : ''}
              ${alert.type === 'error' ? 'text-red-800' : ''}
              ${alert.type === 'info' ? 'text-blue-800' : ''}
            `}>
              {alert.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome, {username}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Driver Dashboard • {vehicle.license_plate}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {currentTrip && (
                <Badge className="bg-emerald-500 gap-2">
                  <Navigation className="w-3 h-3" />
                  On Route: {currentTrip.pickup_location} → {currentTrip.dropoff_location}
                </Badge>
              )}
              <Button size="sm" variant="outline" className="gap-2">
                <Bell className="w-4 h-4" />
                Alerts
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading schedule...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Profile & Stats */}
            <div className="lg:col-span-1 space-y-6">
              <ProfileCard 
                name={username}
                license="DL-001234"
                phone="+254 712 345 678"
                rating={earnings.avgRating}
                totalTrips={earnings.totalTrips}
              />
              
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Today's Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
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
                <TabsList className="grid w-full grid-cols-5 lg:w-auto bg-card border border-border/50">
                  <TabsTrigger value="dashboard" className="gap-2">
                    <Navigation className="w-4 h-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </TabsTrigger>
                  <TabsTrigger value="schedule" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="hidden sm:inline">Schedule</span>
                  </TabsTrigger>
                  <TabsTrigger value="route" className="gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="hidden sm:inline">Route</span>
                  </TabsTrigger>
                  <TabsTrigger value="earnings" className="gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="hidden sm:inline">Earnings</span>
                  </TabsTrigger>
                </TabsList>

                {/* DASHBOARD TAB */}
                <TabsContent value="dashboard" className="space-y-6">
                  {/* Current Trip Alert */}
                  {currentTrip && (
                    <Card className="border-emerald-500/30 bg-emerald-500/5 border-border/50">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-emerald-600">Current Trip in Progress</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {currentTrip.pickup_location} → {currentTrip.dropoff_location} • {currentTrip.seats_booked} passengers
                            </p>
                            <div className="flex items-center gap-4 mt-3">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-foreground">
                                  {currentTrip.service_type === 'morning' ? 'Morning Service' : 
                                   currentTrip.service_type === 'evening' ? 'Evening Service' : 'Full Day'}
                                </span>
                              </div>
                              <Button 
                                size="sm" 
                                onClick={() => handleCompleteTrip(currentTrip)}
                                className="bg-emerald-600 hover:bg-emerald-700"
                              >
                                Complete Trip
                              </Button>
                            </div>
                          </div>
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
                      <CardDescription>Your trips for {today}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {todaySchedule.length > 0 ? (
                        <div className="space-y-4">
                          {todaySchedule.map((trip, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{trip.pickup_location} → {trip.dropoff_location}</h4>
                                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Users className="w-4 h-4" />
                                      {trip.seats_booked} passengers
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Car className="w-4 h-4" />
                                      {trip.service_type}
                                    </span>
                                  </div>
                                </div>
                                {trip.status !== 'completed' && (
                                  <Button 
                                    size="sm"
                                    onClick={() => 
                                      trip.status === 'in-progress' 
                                        ? handleCompleteTrip(trip)
                                        : handleStartTrip(trip)
                                    }
                                  >
                                    {trip.status === 'in-progress' ? 'Complete Trip' : 'Start Trip'}
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-8">No trips scheduled for today</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-border/50">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Users className="w-6 h-6 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Passengers Today</p>
                            <p className="text-2xl font-bold text-foreground">{passengersToday}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-border/50">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <Navigation className="w-6 h-6 text-emerald-500" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Trips Today</p>
                            <p className="text-2xl font-bold text-foreground">{tripsToday}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-border/50">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-500/10 rounded-lg">
                            <Clock className="w-6 h-6 text-orange-500" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">On-time Rate</p>
                            <p className="text-2xl font-bold text-foreground">94%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* SCHEDULE TAB */}
                <TabsContent value="schedule">
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle>My Schedule</CardTitle>
                      <CardDescription>Your route assignments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {schedule.length > 0 ? (
                        <div className="space-y-4">
                          {schedule.map((trip, index) => (
                            <Card key={index} className="border-border">
                              <CardContent className="pt-6">
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold">Route</h4>
                                      <p className="text-muted-foreground">{trip.pickup_location} → {trip.dropoff_location}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">Service Type</h4>
                                      <Badge variant="outline" className="capitalize">
                                        {trip.service_type}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <h4 className="font-semibold">Date Range</h4>
                                      <p className="text-muted-foreground">{trip.start_date} to {trip.end_date}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">Days</h4>
                                      <p className="text-muted-foreground">
                                        {trip.days_of_week.split(',').map(day => {
                                          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                                          return days[parseInt(day) - 1]
                                        }).join(', ')}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold">Passengers</h4>
                                      <p className="text-muted-foreground">{trip.seats_booked} booked</p>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground py-8">No schedule available</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ROUTE TAB */}
                <TabsContent value="route">
                  <RouteMap schedule={schedule} />
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