'use client'
import TrackingSection from './components/tracking-section'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, MapPin, Navigation, History, BarChart3, Clock, Phone, AlertTriangle, CheckCircle, XCircle, MapIcon, Users, DollarSign, User } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { userAgent } from 'next/server'

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [bookingStep, setBookingStep] = useState(1)
  const [selectedRoute, setSelectedRoute] = useState('')
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Mock data
  const mockBookings = [
    { id: 1, route: 'Route A - Downtown', date: '2024-02-15', time: '08:00 AM', status: 'completed'},
    { id: 2, route: 'Route B - Westside', date: '2024-02-14', time: '03:30 PM', status: 'completed'},
    { id: 3, route: 'Route A - Downtown', date: '2024-02-13', time: '08:00 AM', status: 'completed' },
  ]

  const routes = [
    { id: 1, name: 'Route A - Downtown', pickUp: 'Main Street', dropOff: 'School Main Gate', seats: 15},
    { id: 2, name: 'Route B - Westside', pickUp: 'West Plaza', dropOff: 'School West Gate', seats: 12},
    { id: 3, name: 'Route C - Eastside', pickUp: 'East Mall', dropOff: 'School East Gate', seats: 18 },
  ]

  const handleBooking = () => {
    setShowConfirmation(true)
    setTimeout(() => {
      setBookingStep(1)
      setSelectedRoute('')
      setSelectedSeats([])
      setShowConfirmation(false)
    }, 2000)
  }
  const username= localStorage.getItem("username")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome, {username}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage bookings, track your child, and view transport history
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-2">
                <AlertCircle className="w-3 h-3" />
                All systems active
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto bg-card border border-border/50">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="book" className="gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Book Ride</span>
            </TabsTrigger>
            <TabsTrigger value="track" className="gap-2">
              <Navigation className="w-4 h-4" />
              <span className="hidden sm:inline">Track</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground mt-1">This week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">In Transit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground mt-1">Currently on route</p>
                </CardContent>
              </Card>
              {/* <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45.00</div>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card> */}
            </div>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Your last 3 bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:bg-muted/50 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{booking.route}</p>
                          <p className="text-xs text-muted-foreground">{booking.date} at {booking.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {/* <p className="font-semibold text-sm">{booking.cost}</p> */}
                        <Badge variant="outline" className="text-xs mt-1">Completed</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BOOK RIDE TAB */}
          <TabsContent value="book" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Book a Ride</CardTitle>
                <CardDescription>Step {bookingStep} of 3 - Select route, seats, and confirm</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {showConfirmation && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">Booking Confirmed!</p>
                      <p className="text-sm text-green-800">Your ride has been booked successfully.</p>
                    </div>
                  </div>
                )}

                {/* Step 1: Select Route */}
                {bookingStep === 1 && (
                  <div className="space-y-4">
                    <Label>Select a Route</Label>
                    <div className="grid grid-cols-1 gap-3">
                      {routes.map((route) => (
                        <div
                          key={route.id}
                          onClick={() => setSelectedRoute(route.name)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                            selectedRoute === route.name
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold">{route.name}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-2">
                                <MapIcon className="w-4 h-4" /> {route.pickUp} → {route.dropOff}
                              </p>
                              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                <Users className="w-4 h-4" /> {route.seats} seats available
                              </p>
                            </div>
                            <div className="text-right">
                              {/* <p className="font-bold text-lg">{route.cost}</p> */}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => setBookingStep(2)}
                      disabled={!selectedRoute}
                      className="w-full"
                    >
                      Continue to Seats
                    </Button>
                  </div>
                )}

                {/* Step 2: Select Seats */}
                {bookingStep === 2 && (
                  <div className="space-y-4">
                    <Label>Select Seats</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((seat) => (
                        <button
                          key={seat}
                          onClick={() => {
                            if (selectedSeats.includes(seat.toString())) {
                              setSelectedSeats(selectedSeats.filter(s => s !== seat.toString()))
                            } else {
                              setSelectedSeats([...selectedSeats, seat.toString()])
                            }
                          }}
                          className={`p-3 border-2 rounded transition ${
                            selectedSeats.includes(seat.toString())
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {seat}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setBookingStep(1)}
                        className="w-full"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={() => setBookingStep(3)}
                        disabled={selectedSeats.length === 0}
                        className="w-full"
                      >
                        Review Booking
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Confirm */}
                {bookingStep === 3 && (
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Route:</span>
                        <span className="font-semibold">{selectedRoute}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Seats:</span>
                        <span className="font-semibold">{selectedSeats.join(', ')}</span>
                      </div>
                      <div className="flex justify-between border-t border-border pt-3">
                        <span className="font-semibold">Total:</span>
                        <span className="font-bold text-lg text-primary">${selectedSeats.length * 5}.00</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setBookingStep(2)}
                        className="w-full"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleBooking}
                        className="w-full"
                      >
                        Confirm Booking
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TRACK TAB */}
          <TabsContent value="track" className="space-y-6">
              <TrackingSection />
            <Card>
              <CardHeader>
                <CardTitle>Track Your Child</CardTitle>
                <CardDescription>Real-time bus and child location</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-8 rounded-lg flex items-center justify-center min-h-[300px] border-2 border-dashed border-border">
                  <div className="text-center">
                    <Navigation className="w-12 h-12 text-primary/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">Map view would display here</p>
                    <p className="text-sm text-muted-foreground">Real-time tracking in progress...</p>
                  </div>
                </div>

                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Bus Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge className="bg-green-500">In Transit</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current Speed</span>
                      <span className="font-semibold">32 km/h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">ETA</span>
                      <span className="font-semibold">8:15 AM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Passengers</span>
                      <span className="font-semibold">18/25</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Driver Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">John Smith</p>
                        <p className="text-xs text-muted-foreground">Driver ID: DRV-001</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-3 border-t border-border">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <a href="tel:+1234567890" className="text-primary hover:underline text-sm">
                        +1 (234) 567-8900
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* HISTORY TAB */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking History</CardTitle>
                <CardDescription>View all your past bookings and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Route</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockBookings.map((booking) => (
                        <TableRow key={booking.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{booking.route}</TableCell>
                          <TableCell>{booking.date}</TableCell>
                          <TableCell>{booking.time}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50">
                              {booking.status}
                            </Badge>
                          </TableCell>
                          {/* <TableCell className="text-right font-semibold">{booking.cost}</TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
