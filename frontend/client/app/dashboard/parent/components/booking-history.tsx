'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { History, Search, MapPin, Navigation } from 'lucide-react'

const BASE_URL = 'http://127.0.0.1:5555'

export type Booking = {
  booking_id: number
  pickup_location: string
  dropoff_location: string
  start_date: string
  end_date: string
  seats_booked: number
  service_type: string
  status: 'active' | 'cancelled' | 'completed'
}

interface Props {
  onTrack: (bookingId: number) => void
}

export default function BookingHistory({ onTrack }: Props) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] =
    useState<'all' | 'active' | 'cancelled'>('all')
  const [loading, setLoading] = useState(true)

  // ---------------- FETCH BOOKINGS ----------------
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/bookings?user_id=1`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
          },
        })

        if (!res.ok) throw new Error('Failed to fetch booking history')

        const data: Booking[] = await res.json()
        setBookings(data)
      } catch (err) {
        console.error('Booking history error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  // ---------------- CANCEL BOOKING ----------------
  const cancelBooking = async (bookingId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
      })
      if (!res.ok) throw new Error('Failed to cancel booking')

      // Update local state
      setBookings(prev =>
        prev.map(b =>
          b.booking_id === bookingId ? { ...b, status: 'cancelled' } : b
        )
      )
    } catch (err) {
      console.error('Cancel booking error:', err)
      alert('Failed to cancel booking')
    }
  }

  // ---------------- FILTER ----------------
  const filteredBookings = bookings.filter(b => {
    const matchesSearch =
      b.pickup_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.dropoff_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.booking_id.toString().includes(searchTerm)

    if (activeTab === 'active') return b.status === 'active' && matchesSearch
    if (activeTab === 'cancelled') return b.status === 'cancelled' && matchesSearch
    return matchesSearch
  })

  // ---------------- STATUS STYLES ----------------
  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-700 border-emerald-500/50'
      case 'cancelled':
        return 'bg-red-500/20 text-red-700 border-red-500/50'
      case 'completed':
        return 'bg-gray-500/20 text-gray-700 border-gray-500/50'
      default:
        return ''
    }
  }

  const getCardColor = (index: number) => {
    const colors = ['bg-blue-50', 'bg-purple-50', 'bg-pink-50', 'bg-green-50', 'bg-yellow-50']
    return colors[index % colors.length]
  }

  if (loading) {
    return <p className="text-muted-foreground text-center py-6">Loading booking history…</p>
  }

  return (
    <div className="space-y-6">
      {/* SEARCH */}
      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by booking ID or location…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
      </Card>

      {/* HISTORY */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <History className="w-5 h-5 text-primary" />
            Booking History
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={v => setActiveTab(v as any)}>
            <TabsList className="w-full rounded-none border-b">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {filteredBookings.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  No bookings found
                </div>
              ) : (
                filteredBookings.map((b, i) => (
                  <div
                    key={b.booking_id}
                    className={`flex flex-col md:flex-row justify-between p-5 border border-border/50 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 ${getCardColor(i)}`}
                  >
                    {/* Left: Booking info */}
                    <div className="flex-1 space-y-1">
                      <p className="font-semibold text-sm md:text-base text-gray-800 dark:text-gray-900">
                        BK-{b.booking_id} • {b.service_type}
                      </p>

                      <div className="inline-flex items-center gap-2 mt-1">
                        <div className="px-2 py-1 bg-primary text-white rounded-lg text-xs font-medium">
                          {new Date(b.start_date).toLocaleDateString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          → {new Date(b.end_date).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-start gap-2 text-sm mt-1">
                        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <p>{b.pickup_location}</p>
                          <p className="text-muted-foreground">→ {b.dropoff_location}</p>
                        </div>
                      </div>

                      <p className="text-sm mt-1">
                        Seats: <b>{b.seats_booked}</b>
                      </p>
                    </div>

                    {/* Right: Status & Track/Cancel */}
                    <div className="flex flex-col items-end gap-2 mt-3 md:mt-0">
                      <Badge variant="outline" className={getStatusColor(b.status)}>
                        {b.status}
                      </Badge>

                      {b.status === 'active' && (
                        <div className="flex flex-col gap-2 mt-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={() => onTrack(b.booking_id)}
                          >
                            <Navigation className="w-4 h-4" />
                            Track
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1"
                            onClick={() => cancelBooking(b.booking_id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
