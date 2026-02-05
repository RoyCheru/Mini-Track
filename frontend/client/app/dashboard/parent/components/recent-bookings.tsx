'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, ArrowRight } from 'lucide-react'

const BASE_URL = 'http://127.0.0.1:5555'

type BookingStatus = 'active' | 'cancelled' | 'completed'

interface Booking {
  booking_id: number
  route_name: string
  pickup_location: string
  dropoff_location: string
  seats_booked: number
  service_type: string
  status: BookingStatus
  start_date: string
  end_date: string
}

// ---------------- COMPONENT ----------------
export default function RecentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentBookings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/bookings?user_id=1`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
          },
        })
        if (!res.ok) throw new Error('Failed to fetch bookings')

        const data: Booking[] = await res.json()
        const activeBookings = data.filter(b => b.status === 'active')
        const recent = activeBookings
          .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
          .slice(0, 5)

        setBookings(recent)
      } catch (err) {
        console.error('Recent bookings error:', err)
        setBookings([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecentBookings()
  }, [])

  const getStatusColor = (status: BookingStatus) => {
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

  return (
    <Card className="border-border/50 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="w-5 h-5 text-primary" />
              Recent Bookings
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Your upcoming confirmed bookings
            </CardDescription>
          </div>
          <Button size="sm" variant="ghost" className="hover:text-primary transition-colors">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading && (
          <p className="text-sm text-muted-foreground text-center py-6">
            Loading recent bookings…
          </p>
        )}

        {!loading && bookings.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">
            No upcoming bookings found
          </p>
        )}

        {!loading && bookings.length > 0 && (
          <div className="space-y-3">
            {bookings.map((b, i) => (
              <div
                key={b.booking_id}
                className={`flex flex-col md:flex-row items-start md:items-center justify-between p-5 border border-border/50 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 ${getCardColor(i)}`}
              >
                {/* Left: Booking info */}
                <div className="flex-1 space-y-1">
                  <p className="font-semibold text-sm md:text-base text-gray-800 dark:text-gray-900">
                    {b.route_name}
                  </p>

                  {/* Calendar badge for start date */}
                  <div className="inline-flex items-center gap-2 mt-1">
                    <div className="px-2 py-1 bg-primary text-white rounded-lg text-xs font-medium">
                      {new Date(b.start_date).toLocaleDateString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      → {new Date(b.end_date).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {b.pickup_location} → {b.dropoff_location}
                  </p>
                </div>

                {/* Right: Seats & status */}
                <div className="flex items-center gap-4 mt-3 md:mt-0">
                  <p className="font-semibold text-sm md:text-base text-gray-800 dark:text-gray-900">
                    {b.seats_booked} seats
                  </p>
                  <Badge variant="outline" className={getStatusColor(b.status)}>
                    {b.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
