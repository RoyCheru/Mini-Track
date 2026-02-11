'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { useRouter } from 'next/navigation'
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

// ✅ NEW: Trip type (matches your booking-history.tsx)
type Trip = {
  trip_id: number
  trip_date: string
  service_time: 'morning' | 'evening'
  status: 'scheduled' | 'picked_up' | 'completed' | 'cancelled'
}

// ✅ NEW: normalize to YYYY-MM-DD
function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

// ✅ NEW: fetch trips for a booking via /bookings/:id (backend already returns trips there)
async function fetchBookingTrips(bookingId: number): Promise<Trip[]> {
  try {
    const res = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
      },
    })

    if (!res.ok) return []

    const data = await res.json()
    const trips = Array.isArray(data?.trips) ? data.trips : []
    return trips
  } catch (err) {
    console.error(`Failed to fetch trips for booking ${bookingId}:`, err)
    return []
  }
}

// ✅ NEW: count scheduled trips from today onwards (today + future)
function countUpcomingTrips(bookingsWithTrips: Array<Booking & { trips?: Trip[] }>) {
  const today = todayISO()

  return bookingsWithTrips.reduce((sum, b) => {
    const trips = Array.isArray(b.trips) ? b.trips : []
    const upcoming = trips.filter(t => t.status === 'scheduled' && t.trip_date >= today)
    return sum + upcoming.length
  }, 0)
}

export default function ParentDashboardPage() {
  // ---------------- STATE ----------------
  const [summary, setSummary] = useState({
    total_bookings: 0,
    active_bookings: 0,
    upcoming_trips: 0,
  })

  const [userName, setUserName] = useState('Guest')
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [trackingBookingId, setTrackingBookingId] = useState<number | null>(null)

  // ✅ NEW: auth gate
  const [authChecked, setAuthChecked] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)

  // ---------------- LOAD DATA (PROTECTED) ----------------
  useEffect(() => {
    let cancelled = false

    const init = async () => {
      try {
        // 1) Verify session/token FIRST
        const res = await apiFetch('/me', { credentials: 'include' })

        if (!res.ok) {
          if (!cancelled) {
            setAuthChecked(true)
            setIsAuthed(false)
            router.replace('/auth/signin')
          }
          return
        }

        const data = await res.json()
        const fullName = data?.name || 'Guest'
        const firstName = String(fullName).split(' ')[0]
        if (!cancelled) {
          setUserName(firstName)
          setIsAuthed(true)
          setAuthChecked(true)
        }

        // 2) Only after auth is confirmed, fetch dashboard data
        await fetchDashboardSummary()
      } catch (err) {
        console.error('Auth check error:', err)
        if (!cancelled) {
          setAuthChecked(true)
          setIsAuthed(false)
          router.replace('/auth/signin')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    init()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        },
      })

      if (!res.ok) throw new Error('Failed to fetch bookings')

      const data: Booking[] = await res.json()

      // ✅ NEW: attach trips to each booking so we can count scheduled trips
      const bookingsWithTrips = await Promise.all(
        data.map(async (b) => {
          const trips = await fetchBookingTrips(b.booking_id)
          return { ...b, trips }
        })
      )

      setSummary({
        total_bookings: data.length,
        active_bookings: data.filter(b => b.status === 'active').length,
        upcoming_trips: countUpcomingTrips(bookingsWithTrips),
      })
    } catch (err) {
      console.error('Dashboard summary error:', err)
    }
  }

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('username')
      localStorage.removeItem('user_id')
      localStorage.removeItem('access_token')
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

  // ✅ NEW: don’t render dashboard until auth has been checked
  if (!authChecked || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  // ✅ NEW: if not authed, don’t render anything (redirect already triggered)
  if (!isAuthed) {
    return null
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
