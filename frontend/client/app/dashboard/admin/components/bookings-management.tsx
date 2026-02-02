'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Calendar, Download } from 'lucide-react'

const BOOKINGS = [
  {
    id: 'BK-2401',
    parent: 'Jane Kipchoge',
    phone: '+254 712 345 678',
    route: 'Route A',
    seats: 2,
    amount: 400,
    status: 'Confirmed',
    date: '2025-01-30',
    time: '7:30 AM',
    children: 'Sarah, Michael',
  },
  {
    id: 'BK-2402',
    parent: 'John Kiprotich',
    phone: '+254 723 456 789',
    route: 'Route B',
    seats: 1,
    amount: 180,
    status: 'Confirmed',
    date: '2025-01-30',
    time: '7:35 AM',
    children: 'David',
  },
  {
    id: 'BK-2403',
    parent: 'Mary Kipkosgei',
    phone: '+254 734 567 890',
    route: 'Route C',
    seats: 3,
    amount: 660,
    status: 'Pending',
    date: '2025-01-30',
    time: '7:40 AM',
    children: 'Emma, Grace, Leo',
  },
  {
    id: 'BK-2404',
    parent: 'Peter Kipchoge',
    phone: '+254 745 678 901',
    route: 'Route A',
    seats: 1,
    amount: 200,
    status: 'Cancelled',
    date: '2025-01-30',
    time: '7:45 AM',
    children: 'James',
  },
  {
    id: 'BK-2405',
    parent: 'Susan Kiplagat',
    phone: '+254 756 789 012',
    route: 'Route B',
    seats: 2,
    amount: 360,
    status: 'Confirmed',
    date: '2025-01-29',
    time: '7:30 AM',
    children: 'Tom, Jerry',
  },
]

export default function BookingsManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const filteredBookings = BOOKINGS.filter(booking => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.parent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.includes(searchTerm)

    if (activeTab === 'confirmed') return booking.status === 'Confirmed' && matchesSearch
    if (activeTab === 'pending') return booking.status === 'Pending' && matchesSearch
    if (activeTab === 'cancelled') return booking.status === 'Cancelled' && matchesSearch
    return matchesSearch
  })

  const totalRevenue = BOOKINGS.filter(b => b.status === 'Confirmed').reduce(
    (sum, b) => sum + b.amount,
    0
  )
  const totalBookings = BOOKINGS.length
  const confirmedBookings = BOOKINGS.filter(b => b.status === 'Confirmed').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
      case 'Pending':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
      case 'Cancelled':
        return 'bg-red-500/10 text-red-600 border-red-500/30'
      default:
        return 'bg-gray-500/10 text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-border/50">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
            <p className="text-3xl font-bold text-foreground mt-2">{totalBookings}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-border/50">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Confirmed</p>
            <p className="text-3xl font-bold text-foreground mt-2">{confirmedBookings}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-border/50">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
            <p className="text-3xl font-bold text-foreground mt-2">KES {totalRevenue}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Export */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by booking ID, parent name, or phone..."
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

      {/* Bookings Table */}
      <Card className="border-border/50 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Bookings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full rounded-none border-b border-border/50 bg-transparent p-0">
              <TabsTrigger
                value="all"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="confirmed"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Confirmed
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Pending
              </TabsTrigger>
              <TabsTrigger
                value="cancelled"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                Cancelled
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="p-0 m-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b border-border/50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">
                        Booking ID
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">
                        Parent Info
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">
                        Route & Seats
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">
                        Children
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">
                        Amount
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">
                        Date & Time
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(booking => (
                      <tr
                        key={booking.id}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <p className="font-semibold text-foreground">{booking.id}</p>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-foreground">{booking.parent}</p>
                            <p className="text-xs text-muted-foreground">{booking.phone}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-foreground">{booking.route}</p>
                            <p className="text-xs text-muted-foreground">{booking.seats} seats</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm text-foreground">{booking.children}</p>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-bold text-primary">KES {booking.amount}</p>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant="outline" className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">
                            <p className="text-foreground">{booking.date}</p>
                            <p className="text-xs text-muted-foreground">{booking.time}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                            {booking.status === 'Pending' && (
                              <Button size="sm" variant="outline">
                                Approve
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
