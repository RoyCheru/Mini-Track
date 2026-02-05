'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LayoutDashboard, Bus, History, Navigation } from 'lucide-react'

import QuickActions from './components/quick-actions'
import RecentBookings from './components/recent-bookings'
import BookingFlow from './components/booking-flow'
import BookingHistory, { Booking } from './components/booking-history'
import TrackingSection from './components/tracking-section'

export default function ParentDashboardPage() {
  // ---------------- STATE ----------------
  const [summary, setSummary] = useState({
    total_bookings: 0,
    active_routes: 0,
    upcoming_trips: 0,
  })

  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [historyTrips, setHistoryTrips] = useState<Booking[]>([])

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    // TODO: Replace with real API calls
    // fetch('/api/parent/dashboard/summary')
    //   .then(res => res.json())
    //   .then(data => setSummary(data))
    //   .catch(console.error)

    // Safe fallback for now
    setSummary({
      total_bookings: 0,
      active_routes: 0,
      upcoming_trips: 0,
    })

    // Fetch recent bookings
    // TODO: Replace with JWT fetch
    // fetch('/api/bookings/recent')
    //   .then(res => res.json())
    //   .then(data => setRecentBookings(data))
    //   .catch(console.error)

    setRecentBookings([]) // default safe empty array

    // Fetch booking history
    // TODO: Replace with JWT fetch
    // fetch('/api/bookings/history')
    //   .then(res => res.json())
    //   .then(data => setHistoryTrips(data))
    //   .catch(console.error)

    setHistoryTrips([]) // default safe empty array
  }, [])

  return (
    <div className="space-y-6">
      {/* ---------------- TABS ---------------- */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview" className="gap-2">
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </TabsTrigger>

          <TabsTrigger value="book" className="gap-2">
            <Bus className="w-4 h-4" />
            Book Ride
          </TabsTrigger>

          <TabsTrigger value="track" className="gap-2">
            <Navigation className="w-4 h-4" />
            Track
          </TabsTrigger>

          <TabsTrigger value="history" className="gap-2">
            <History className="w-4 h-4" />
            History
          </TabsTrigger>
        </TabsList>

        {/* ---------------- OVERVIEW ---------------- */}
        <TabsContent value="overview" className="space-y-6">
          <QuickActions
            summary={{
              totalBookings: summary.total_bookings,
              activeRoutes: summary.active_routes,
              upcomingTrips: summary.upcoming_trips,
            }}
          />

          <RecentBookings bookings={recentBookings} />
        </TabsContent>

        {/* ---------------- BOOKING ---------------- */}
        <TabsContent value="book">
          <BookingFlow />
        </TabsContent>

        {/* ---------------- TRACKING ---------------- */}
        <TabsContent value="track">
          <TrackingSection />
        </TabsContent>

        {/* ---------------- HISTORY ---------------- */}
        <TabsContent value="history">
          <BookingHistory trips={historyTrips} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

