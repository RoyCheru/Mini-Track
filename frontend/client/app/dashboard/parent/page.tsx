'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Bus,
  History,
  Navigation,
  Sparkles,
  LogOut,
} from 'lucide-react'

import QuickActions from './components/quick-actions'
import RecentBookings from './components/recent-bookings'
import BookingFlow from './components/booking-flow'
import BookingHistory, { Booking } from './components/booking-history'
import TrackingSection from './components/tracking-section'

const BASE_URL = 'http://127.0.0.1:5555'

// Helper function to get current user ID
function getCurrentUserId(): number | null {
  if (typeof window === 'undefined') return null
  
  const userId = localStorage.getItem('user_id')
  return userId ? parseInt(userId, 10) : null
}

export default function ParentDashboardPage() {
  // ---------------- STATE ----------------
  const [summary, setSummary] = useState({
    total_bookings: 0,
    active_bookings: 0,
    upcoming_trips: 0,
  })

  const [userName, setUserName] = useState('Guest')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [trackingBookingId, setTrackingBookingId] = useState<number | null>(null)

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    fetchUserData()
    fetchDashboardSummary()
  }, [])

  const fetchUserData = () => {
    try {
      const fullName = localStorage.getItem('username') || 'Guest'
      const firstName = fullName.split(' ')[0]
      setUserName(firstName)
    } catch (err) {
      console.error('User data error:', err)
      setUserName('Guest')
    }
  }

  const fetchDashboardSummary = async () => {
    try {
      const userId = getCurrentUserId()
      
      // If no user ID found, redirect to login
      if (!userId) {
        console.error('No user ID found - redirecting to login')
        window.location.href = '/auth/signin'
        return
      }

      const res = await fetch(`${BASE_URL}/bookings?user_id=${userId}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      })

      if (!res.ok) throw new Error('Failed to fetch bookings')

      const data: Booking[] = await res.json()

      setSummary({
        total_bookings: data.length,
        active_bookings: data.filter(b => b.status === 'active').length,
        upcoming_trips: data.filter(b => {
          const startDate = new Date(b.start_date)
          const today = new Date()
          return b.status === 'active' && startDate >= today
        }).length,
      })
    } catch (err) {
      console.error('Dashboard summary error:', err)
    } finally {
      setLoading(false)
    }
  }

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/logout`, {
        method: 'DELETE',
        credentials: 'include',
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear all user data from localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('user_id')
      localStorage.removeItem('access_token')
      
      // Redirect to signin
      window.location.href = '/auth/signin'
    }
  }

  // ---------------- TRACKING ----------------
  const handleTrackBooking = (bookingId: number) => {
    setTrackingBookingId(bookingId)
    setActiveTab('track')
  }

  // ---------------- GREETING ----------------
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-8">

        {/* ---------------- HEADER ---------------- */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">
                Parent Dashboard
              </h1>
            </div>

            <p className="text-2xl font-semibold text-muted-foreground">
              {getGreeting()}, <span className="text-primary">{userName}</span>! 👋
            </p>
          </div>

          {/* LOGOUT BUTTON */}
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* ---------------- TABS ---------------- */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full h-14 bg-muted/50 p-1 rounded-xl">

            <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>

            <TabsTrigger value="book" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg">
              <Bus className="w-4 h-4" />
              <span className="hidden sm:inline">Book Ride</span>
            </TabsTrigger>

            <TabsTrigger value="track" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg">
              <Navigation className="w-4 h-4" />
              <span className="hidden sm:inline">Track</span>
            </TabsTrigger>

            <TabsTrigger value="history" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
          </TabsList>

          {/* ---------------- OVERVIEW ---------------- */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <QuickActions
              summary={{
                totalBookings: summary.total_bookings,
                activeRoutes: summary.active_bookings,
                upcomingTrips: summary.upcoming_trips,
              }}
            />
            <RecentBookings />
          </TabsContent>

          {/* ---------------- BOOK ---------------- */}
          <TabsContent value="book" className="mt-6">
            <BookingFlow />
          </TabsContent>

          {/* ---------------- TRACK ---------------- */}
          <TabsContent value="track" className="mt-6">
            <TrackingSection initialBookingId={trackingBookingId} />
          </TabsContent>

          {/* ---------------- HISTORY ---------------- */}
          <TabsContent value="history" className="mt-6">
            <BookingHistory onTrack={handleTrackBooking} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}