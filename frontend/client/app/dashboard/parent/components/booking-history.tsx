'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { History, Search, Download, MapPin, Calendar, Users } from 'lucide-react'
import { useState } from 'react'

const BOOKING_HISTORY = [
  {
    id: 'BK-001',
    date: '2025-01-30',
    route: 'Route A - Downtown',
    pickup: 'Home - Westlands',
    dropoff: 'School - Parklands',
    seats: 2,
    cost: 400,
    status: 'Completed',
    children: 'Sarah, Michael',
    time: '7:30 AM',
  },
  {
    id: 'BK-002',
    date: '2025-01-29',
    route: 'Route B - Westside',
    pickup: 'Home - Westlands',
    dropoff: 'School - Parklands',
    seats: 2,
    cost: 360,
    status: 'Completed',
    children: 'Sarah, Michael',
    time: '7:30 AM',
  },
  {
    id: 'BK-003',
    date: '2025-01-28',
    route: 'Route A - Downtown',
    pickup: 'Home - Westlands',
    dropoff: 'School - Parklands',
    seats: 1,
    cost: 200,
    status: 'Completed',
    children: 'Sarah',
    time: '7:30 AM',
  },
  {
    id: 'BK-004',
    date: '2025-01-27',
    route: 'Route C - Eastside',
    pickup: 'Home - Westlands',
    dropoff: 'School - Parklands',
    seats: 2,
    cost: 440,
    status: 'Cancelled',
    children: 'Sarah, Michael',
    time: '7:30 AM',
  },
  {
    id: 'BK-005',
    date: '2025-01-26',
    route: 'Route A - Downtown',
    pickup: 'Home - Westlands',
    dropoff: 'School - Parklands',
    seats: 2,
    cost: 400,
    status: 'Completed',
    children: 'Sarah, Michael',
    time: '7:30 AM',
  },
]

export default function BookingHistory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const filteredBookings = BOOKING_HISTORY.filter(booking => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.children.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === 'completed') return booking.status === 'Completed' && matchesSearch
    if (activeTab === 'cancelled') return booking.status === 'Cancelled' && matchesSearch
    return matchesSearch
  })

  const totalSpent = BOOKING_HISTORY.filter(b => b.status === 'Completed').reduce(
    (sum, b) => sum + b.cost,
    0
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
      case 'Cancelled':
        return 'bg-red-500/10 text-red-600 border-red-500/30'
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/30'
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-border/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
              <p className="text-3xl font-bold text-foreground">{BOOKING_HISTORY.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-border/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Completed Trips</p>
              <p className="text-3xl font-bold text-foreground">
                {BOOKING_HISTORY.filter(b => b.status === 'Completed').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-border/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Amount Spent</p>
              <p className="text-3xl font-bold text-foreground">KES {totalSpent}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by booking ID, route, or child name..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs and History */}
      <Card className="border-border/50 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Booking History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full rounded-none border-b border-border/50 bg-transparent p-0">
              <TabsTrigger
                value="all"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                All Bookings
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Completed
              </TabsTrigger>
              <TabsTrigger
                value="cancelled"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Cancelled
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="p-0 m-0">
              <div className="divide-y divide-border/50">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map(booking => (
                    <div
                      key={booking.id}
                      className="p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          {/* Booking ID and Status */}
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-foreground">{booking.id}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {booking.date} • {booking.time}
                              </p>
                            </div>
                            <Badge variant="outline" className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>

                          {/* Route Details */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs text-muted-foreground">Route</p>
                                <p className="font-medium text-foreground">{booking.route}</p>
                              </div>
                            </div>

                            <div>
                              <p className="text-xs text-muted-foreground">Pickup</p>
                              <p className="font-medium text-foreground">{booking.pickup}</p>
                            </div>

                            <div>
                              <p className="text-xs text-muted-foreground">Children</p>
                              <p className="font-medium text-foreground">{booking.children}</p>
                            </div>

                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Cost</p>
                              <p className="font-bold text-primary">KES {booking.cost}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 sm:flex-col">
                          <Button size="sm" variant="outline">
                            Details
                          </Button>
                          {booking.status === 'Completed' && (
                            <Button size="sm" variant="outline">
                              Rebook
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <History className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No bookings found</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
