'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Calendar, Download } from 'lucide-react'

type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled'

type Booking = {
  id: string
  parent: string
  phone: string
  route: string
  seats: number
  amount: number
  status: BookingStatus
  date: string
  time: string
  children: string
}

const BOOKINGS: Booking[] = [
  {
    id: 'BK-2401',
    parent: 'Jane Kipchoge',
    phone: '+254 712 345 678',
    route: 'RouteA',
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
    route: 'RouteA',
    seats: 1,
    amount: 200,
    status: 'Pending',
    date: '2025-01-30',
    time: '7:35 AM',
    children: 'David',
  },
  {
    id: 'BK-2403',
    parent: 'Mary Kipkosgei',
    phone: '+254 734 567 890',
    route: 'RouteC',
    seats: 3,
    amount: 660,
    status: 'Cancelled',
    date: '2025-01-29',
    time: '7:40 AM',
    children: 'Emma, Grace, Leo',
  },
]

export default function BookingsManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all')

  const getStatusClass = (status: BookingStatus) => {
    if (status === 'Confirmed') return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
    if (status === 'Pending') return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
    return 'bg-red-500/10 text-red-600 border-red-500/30'
  }

  const filteredBookings = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()

    return BOOKINGS.filter(b => {
      const matchesSearch =
        b.id.toLowerCase().includes(q) ||
        b.parent.toLowerCase().includes(q) ||
        b.phone.includes(searchTerm)

      if (activeTab === 'confirmed') return b.status === 'Confirmed' && matchesSearch
      if (activeTab === 'pending') return b.status === 'Pending' && matchesSearch
      if (activeTab === 'cancelled') return b.status === 'Cancelled' && matchesSearch
      return matchesSearch
    })
  }, [activeTab, searchTerm])

  const totalRevenue = BOOKINGS.filter(b => b.status === 'Confirmed').reduce((sum, b) => sum + b.amount, 0)

  return (
    <div className="space-y-6">
      {/* Search / Export */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by booking ID, parent, or phone..."
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

      {/* Bookings */}
      <Card className="border-border/50 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Bookings (Revenue: KES {totalRevenue})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="w-full rounded-none border-b border-border/50 bg-transparent p-0">
              <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                All
              </TabsTrigger>
              <TabsTrigger value="confirmed" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                Confirmed
              </TabsTrigger>
              <TabsTrigger value="pending" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                Pending
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                Cancelled
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="p-0 m-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b border-border/50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Booking ID</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Parent</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Route</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Children</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Amount</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Date</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBookings.map(b => (
                      <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-6 font-semibold text-foreground">{b.id}</td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-foreground">{b.parent}</p>
                            <p className="text-xs text-muted-foreground">{b.phone}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-medium text-foreground">{b.route}</p>
                          <p className="text-xs text-muted-foreground">{b.seats} seats</p>
                        </td>
                        <td className="py-4 px-6">{b.children}</td>
                        <td className="py-4 px-6 font-bold text-primary">KES {b.amount}</td>
                        <td className="py-4 px-6">
                          <Badge variant="outline" className={getStatusClass(b.status)}>
                            {b.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="text-foreground">{b.date}</p>
                            <p className="text-xs text-muted-foreground">{b.time}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">View</Button>
                            {b.status === 'Pending' && <Button size="sm" variant="outline">Approve</Button>}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredBookings.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-10 px-6 text-center text-muted-foreground">
                          No bookings found.
                        </td>
                      </tr>
                    )}
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
