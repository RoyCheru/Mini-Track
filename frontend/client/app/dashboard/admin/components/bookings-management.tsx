'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { apiFetch } from '@/lib/api'
import { Search, Calendar, Download } from 'lucide-react'

/**
 * Backend booking shape (now including status as you said):
 * {
 *   user_id: 2,
 *   route_id: 1,
 *   pickup_location: "...",
 *   dropoff_location: "...",
 *   start_date: "2026-02-05",
 *   end_date: "2026-02-20",
 *   days_of_week: "1,2,3,4,5",
 *   service_type: "both",
 *   seats_booked: 4,
 *   status: "Active"   // <-- per your message
 * }
 */
type BookingApi = {
  user_id: number | string
  route_id: number | string
  pickup_location: string
  dropoff_location: string
  start_date: string
  end_date: string
  days_of_week: string
  service_type: string
  seats_booked: number
  status?: string
  // if your backend has an id later, it will be used automatically
  id?: number | string
}

type BookingStatus = 'Active' | 'Inactive' | 'Cancelled'

type Booking = {
  id: string
  user_id: string
  route_id: string
  pickup_location: string
  dropoff_location: string
  start_date: string
  end_date: string
  days_of_week: string
  service_type: string
  seats_booked: number
  status: BookingStatus
}

type RouteOption = {
  id: number | string
  name?: string
  starting_point?: string
  ending_point?: string
}

type UserOption = {
  id: number | string
  name?: string
  username?: string
  email?: string
  phone_number?: string
}

const toId = (v: any) => String(v ?? '')

const toArray = (x: any) => {
  if (Array.isArray(x)) return x
  if (Array.isArray(x?.data)) return x.data
  if (Array.isArray(x?.results)) return x.results
  if (Array.isArray(x?.bookings)) return x.bookings
  if (Array.isArray(x?.items)) return x.items
  return []
}

const formatDays = (csv: string) => {
  const map: Record<string, string> = {
    '1': 'Mon',
    '2': 'Tue',
    '3': 'Wed',
    '4': 'Thu',
    '5': 'Fri',
    '6': 'Sat',
    '7': 'Sun',
  }
  const parts = String(csv ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  return parts.length ? parts.map(p => map[p] ?? p).join(', ') : '—'
}

const normalizeStatus = (s: any): BookingStatus => {
  const v = String(s ?? '').trim().toLowerCase()
  if (v === 'active') return 'Active'
  if (v === 'inactive') return 'Inactive'
  if (v === 'cancelled' || v === 'canceled') return 'Cancelled'
  // Default: if backend sends something unexpected, treat as Active-ish
  return 'Active'
}

const routeLabel = (r?: RouteOption) => {
  if (!r) return '—'
  if (r.name) return r.name
  if (r.starting_point && r.ending_point) return `${r.starting_point} → ${r.ending_point}`
  return `Route #${toId(r.id)}`
}

const userLabel = (u?: UserOption, fallbackId?: string) => {
  if (!u) return fallbackId ? `User #${fallbackId}` : '—'
  return u.name ?? u.username ?? u.email ?? (fallbackId ? `User #${fallbackId}` : `User #${toId(u.id)}`)
}

const normalizeBooking = (raw: BookingApi): Booking => {
  const user_id = toId(raw.user_id)
  const route_id = toId(raw.route_id)

  // Prefer real id if backend provides one; otherwise create a stable-ish key
  const id =
    raw.id !== undefined && raw.id !== null
      ? toId(raw.id)
      : `${user_id}-${route_id}-${raw.start_date}-${raw.end_date}-${raw.pickup_location}`

  return {
    id,
    user_id,
    route_id,
    pickup_location: String(raw.pickup_location ?? ''),
    dropoff_location: String(raw.dropoff_location ?? ''),
    start_date: String(raw.start_date ?? ''),
    end_date: String(raw.end_date ?? ''),
    days_of_week: String(raw.days_of_week ?? ''),
    service_type: String(raw.service_type ?? ''),
    seats_booked: Number(raw.seats_booked ?? 0),
    status: normalizeStatus(raw.status),
  }
}

export default function BookingsManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive' | 'cancelled'>('all')

  const [bookings, setBookings] = useState<Booking[]>([])
  const [routes, setRoutes] = useState<RouteOption[]>([])
  const [users, setUsers] = useState<UserOption[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const getStatusClass = (status: BookingStatus) => {
    if (status === 'Active') return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
    if (status === 'Inactive') return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
    return 'bg-red-500/10 text-red-600 border-red-500/30'
  }

  const fetchAll = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      if (token) headers.Authorization = `Bearer ${token}`

      const [bookingsRes, routesRes, usersRes] = await Promise.all([
        apiFetch('/bookings', { headers }),
        apiFetch('/routes', { headers }),
        apiFetch('/users', { headers }), // used only to show user names
      ])

      const [bookingsJson, routesJson, usersJson] = await Promise.all([
        bookingsRes.json().catch(() => null),
        routesRes.json().catch(() => null),
        usersRes.json().catch(() => null),
      ])

      if (!bookingsRes.ok) throw new Error(bookingsJson?.error || bookingsJson?.message || `Bookings fetch failed (${bookingsRes.status})`)
      if (!routesRes.ok) throw new Error(routesJson?.error || routesJson?.message || `Routes fetch failed (${routesRes.status})`)

      // Users is optional (if endpoint is protected / not returning parents). We’ll still work with fallback.
      const bookingsArr: BookingApi[] = toArray(bookingsJson)
      const routesArr: RouteOption[] = toArray(routesJson)
      const usersArr: UserOption[] = usersRes.ok ? toArray(usersJson) : []

      setBookings(bookingsArr.map(normalizeBooking))
      setRoutes(routesArr)
      setUsers(usersArr)
    } catch (e: any) {
      console.error(e)
      setBookings([])
      setRoutes([])
      setUsers([])
      setError(e?.message || 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const routeById = useMemo(() => {
    const m = new Map<string, RouteOption>()
    for (const r of routes) m.set(toId(r.id), r)
    return m
  }, [routes])

  const userById = useMemo(() => {
    const m = new Map<string, UserOption>()
    for (const u of users) m.set(toId(u.id), u)
    return m
  }, [users])

  const filteredBookings = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()

    return bookings.filter(b => {
      const r = routeById.get(b.route_id)
      const u = userById.get(b.user_id)

      const routeName = routeLabel(r).toLowerCase()
      const name = userLabel(u, b.user_id).toLowerCase()

      const matchesSearch =
        b.id.toLowerCase().includes(q) ||
        name.includes(q) ||
        routeName.includes(q) ||
        b.pickup_location.toLowerCase().includes(q) ||
        b.dropoff_location.toLowerCase().includes(q) ||
        b.start_date.toLowerCase().includes(q) ||
        b.end_date.toLowerCase().includes(q) ||
        b.service_type.toLowerCase().includes(q)

      const matchesTab =
        activeTab === 'all'
          ? true
          : activeTab === 'active'
            ? b.status === 'Active'
            : activeTab === 'inactive'
              ? b.status === 'Inactive'
              : b.status === 'Cancelled'

      return matchesSearch && matchesTab
    })
  }, [bookings, searchTerm, activeTab, routeById, userById])

  const exportCsv = async () => {
    if (exporting) return
    setExporting(true)

    try {
      const rows = filteredBookings.map(b => {
        const r = routeById.get(b.route_id)
        const u = userById.get(b.user_id)
        return {
          booking_key: b.id,
          user: userLabel(u, b.user_id),
          route: routeLabel(r),
          pickup_location: b.pickup_location,
          dropoff_location: b.dropoff_location,
          start_date: b.start_date,
          end_date: b.end_date,
          days_of_week: formatDays(b.days_of_week),
          service_type: b.service_type,
          seats_booked: b.seats_booked,
          status: b.status,
        }
      })

      const headers = Object.keys(rows[0] ?? { booking_key: '' })
      const escape = (v: any) => `"${String(v ?? '').replaceAll('"', '""')}"`
      const csv = [headers.join(','), ...rows.map(r => headers.map(h => escape((r as any)[h])).join(','))].join('\n')

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bookings_${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(false)
    }
  }

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
                  placeholder="Search by user, route, pickup/dropoff, dates, service type..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="bg-transparent" onClick={fetchAll} disabled={loading}>
                Refresh
              </Button>

              <Button variant="outline" className="gap-2 bg-transparent" onClick={exportCsv} disabled={exporting || loading}>
                <Download className="w-4 h-4" />
                {exporting ? 'Exporting…' : 'Export'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Bookings */}
      <Card className="border-border/50 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Bookings
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={v => setActiveTab(v as any)} className="w-full">
            <TabsList className="w-full rounded-none border-b border-border/50 bg-transparent p-0">
              <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                All
              </TabsTrigger>
              <TabsTrigger value="active" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                Active
              </TabsTrigger>
              <TabsTrigger value="inactive" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                Inactive
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
                      <th className="text-left py-4 px-6 font-semibold text-foreground">User</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Route</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Pickup → Dropoff</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Dates</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Days</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Service</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Seats</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading && (
                      <tr>
                        <td colSpan={9} className="py-10 px-6 text-center text-muted-foreground">
                          Loading bookings…
                        </td>
                      </tr>
                    )}

                    {!loading &&
                      filteredBookings.map(b => {
                        const r = routeById.get(b.route_id)
                        const u = userById.get(b.user_id)

                        return (
                          <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                            <td className="py-4 px-6">
                              <div>
                                <p className="font-medium text-foreground">{userLabel(u, b.user_id)}</p>
                                <p className="text-xs text-muted-foreground">({b.user_id})</p>
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              <div>
                                <p className="font-medium text-foreground">{routeLabel(r)}</p>
                                <p className="text-xs text-muted-foreground">(route {b.route_id})</p>
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              <p className="font-medium text-foreground">{b.pickup_location}</p>
                              <p className="text-xs text-muted-foreground">{b.dropoff_location}</p>
                            </td>

                            <td className="py-4 px-6">
                              <p className="text-foreground">{b.start_date}</p>
                              <p className="text-xs text-muted-foreground">to {b.end_date}</p>
                            </td>

                            <td className="py-4 px-6">{formatDays(b.days_of_week)}</td>

                            <td className="py-4 px-6">
                              <Badge variant="outline">{b.service_type}</Badge>
                            </td>

                            <td className="py-4 px-6">
                              <Badge variant="outline">{b.seats_booked}</Badge>
                            </td>

                            <td className="py-4 px-6">
                              <Badge variant="outline" className={getStatusClass(b.status)}>
                                {b.status}
                              </Badge>
                            </td>

                            <td className="py-4 px-6">
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}

                    {!loading && filteredBookings.length === 0 && (
                      <tr>
                        <td colSpan={9} className="py-10 px-6 text-center text-muted-foreground">
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
