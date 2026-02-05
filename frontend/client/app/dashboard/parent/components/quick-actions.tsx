'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarCheck, Map, Truck } from 'lucide-react'

const BASE_URL = 'http://localhost:5555'

interface Summary {
  totalBookings: number
  activeRoutes: number
  upcomingTrips: number
}

export default function QuickActions() {
  const [summary, setSummary] = useState<Summary>({
    totalBookings: 0,
    activeRoutes: 0,
    upcomingTrips: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // ---------------- FETCH SUMMARY ----------------
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const resBookings = await fetch(`${BASE_URL}/bookings?user_id=1`, {
          credentials: 'include',
        })
        const bookingsData = await resBookings.json()

        const totalBookings = Array.isArray(bookingsData) ? bookingsData.length : 0
        const activeRoutes = Array.isArray(bookingsData)
          ? bookingsData.filter(b => b.status === 'active').length
          : 0
        const upcomingTrips = Array.isArray(bookingsData)
          ? bookingsData.filter(b => new Date(b.start_date) >= new Date()).length
          : 0

        setSummary({ totalBookings, activeRoutes, upcomingTrips })
      } catch (err) {
        console.error('Failed to fetch quick actions summary:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [])

  if (loading) {
    return <p className="text-center text-muted-foreground">Loading quick actions…</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* TOTAL BOOKINGS */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 hover:shadow-xl hover:-translate-y-1 transition-all">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-emerald-700">
              Total Bookings
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <CalendarCheck className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold text-emerald-900">
            {summary.totalBookings}
          </p>
          <p className="text-xs text-emerald-700 mt-1">
            All bookings made so far
          </p>
        </CardContent>
      </Card>

      {/* ACTIVE ROUTES */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500/10 to-blue-600/20 hover:shadow-xl hover:-translate-y-1 transition-all">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-blue-700">
              Active Trips
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Map className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold text-blue-900">
            {summary.activeRoutes}
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Trips currently running
          </p>
        </CardContent>
      </Card>

      {/* UPCOMING TRIPS */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-500/10 to-amber-600/20 hover:shadow-xl hover:-translate-y-1 transition-all">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-amber-700">
              Upcoming Trips
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-500/20">
              <Truck className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold text-amber-900">
            {summary.upcomingTrips}
          </p>
          <p className="text-xs text-amber-700 mt-1">
            Scheduled future rides
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
