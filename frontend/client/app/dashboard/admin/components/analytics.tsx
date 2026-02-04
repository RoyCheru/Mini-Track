'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Users, Clock, Truck, AlertCircle, MapPin } from 'lucide-react'
import { apiFetch } from '@/lib/api'

type Driver = {
  id: number
  name: string
  email: string
  phone_number: string
  status?: string
}

type Route = {
  id: number
  name: string
  starting_point: string
  ending_point: string
  status?: string
}

type Vehicle = {
  id: number
  route_id: number | string
  user_id: number | string
  license_plate: string
  model: string
  capacity: number
  status?: string
}

type Booking = {
  id: string
  parent: string
  route: string
  seats: number
  amount: number
  status: string
  time: string
}

const toArray = (x: any) => {
  if (Array.isArray(x)) return x
  if (Array.isArray(x?.data)) return x.data
  if (Array.isArray(x?.results)) return x.results
  if (Array.isArray(x?.drivers)) return x.drivers
  if (Array.isArray(x?.routes)) return x.routes
  if (Array.isArray(x?.vehicles)) return x.vehicles
  if (Array.isArray(x?.items)) return x.items
  return []
}

const s = (v: any) => String(v ?? '')

export default function AnalyticsSection() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Missing token. Please sign in again.')

        const headers: HeadersInit = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }

        const [driversRes, routesRes, vehiclesRes] = await Promise.all([
          apiFetch('/drivers', { headers }),
          apiFetch('/routes', { headers }),
          apiFetch('/vehicles', { headers }),
        ])

        if (!driversRes.ok) throw new Error(`Drivers fetch failed (${driversRes.status})`)
        if (!routesRes.ok) throw new Error(`Routes fetch failed (${routesRes.status})`)
        if (!vehiclesRes.ok) throw new Error(`Vehicles fetch failed (${vehiclesRes.status})`)

        const [driversJson, routesJson, vehiclesJson] = await Promise.all([
          driversRes.json(),
          routesRes.json(),
          vehiclesRes.json(),
        ])

        setDrivers(toArray(driversJson))
        setRoutes(toArray(routesJson))
        setVehicles(toArray(vehiclesJson))

        // Optional: bookings (only if your backend has it)
        try {
          const bookingsRes = await apiFetch('/bookings/recent', { headers })
          if (bookingsRes.ok) {
            const bookingsJson = await bookingsRes.json()
            setRecentBookings(toArray(bookingsJson))
          } else {
            setRecentBookings([])
          }
        } catch {
          setRecentBookings([])
        }
      } catch (e: any) {
        console.error(e)
        setError(e?.message || 'Failed to load analytics data')
        setDrivers([])
        setRoutes([])
        setVehicles([])
        setRecentBookings([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  /**
   * Cards (must be valid backend-derived numbers)
   * - Total Trips: use bookings if available; otherwise fall back to vehicles count (valid + real)
   * - Active Users: drivers count (valid from /drivers)
   * - On-Time Rate: computed proxy KPI = % vehicles assigned a driver (valid from /vehicles)
   */
  const totalTrips = useMemo(() => {
    if (recentBookings.length > 0) return recentBookings.length
    return vehicles.length
  }, [recentBookings, vehicles])

  const activeUsers = useMemo(() => drivers.length, [drivers])

  const onTimeRate = useMemo(() => {
    const total = vehicles.length
    if (!total) return 0
    const assigned = vehicles.filter(v => s(v.user_id).trim() !== '' && s(v.user_id) !== '0').length
    return Math.round((assigned / total) * 1000) / 10 // 1 decimal
  }, [vehicles])

  // Bottom panels (all from backend)
  const routesWithVehicles = useMemo(() => {
    const set = new Set(vehicles.map(v => s(v.route_id)).filter(x => x.trim() !== '' && x !== '0'))
    return set.size
  }, [vehicles])

  const unassignedVehicles = useMemo(() => {
    return vehicles.filter(v => s(v.user_id).trim() === '' || s(v.user_id) === '0').length
  }, [vehicles])

  const totalFleetCapacity = useMemo(() => {
    return vehicles.reduce((sum, v) => sum + (Number(v.capacity) || 0), 0)
  }, [vehicles])

  if (loading) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>Loading data…</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Please wait.</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Analytics error
          </CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Check Network tab for <b>/drivers</b>, <b>/routes</b>, <b>/vehicles</b>.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics (ONLY 3 CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Total Trips</CardTitle>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold text-foreground">{totalTrips}</p>
            <p className="text-sm text-muted-foreground">
              {recentBookings.length > 0 ? 'Recent bookings loaded' : 'Fallback: vehicles in fleet'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Active Users</CardTitle>
              <Users className="w-5 h-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold text-foreground">{activeUsers}</p>
            <p className="text-sm text-muted-foreground">Driver accounts (from database)</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">On-Time Rate</CardTitle>
              <Clock className="w-5 h-5 text-cyan-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold text-foreground">{onTimeRate}%</p>
            <p className="text-sm text-muted-foreground">% of vehicles assigned a driver</p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom replaced with backend-driven panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Operations Summary */}
        <Card className="border-border/50 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Operations Summary</CardTitle>
            <CardDescription>Computed from DB fleet data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Fleet capacity</span>
              <Badge variant="outline">{totalFleetCapacity}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Routes with vehicles</span>
              <Badge variant="outline">{routesWithVehicles}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Unassigned vehicles</span>
              <Badge variant="outline">{unassignedVehicles}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total routes</span>
              <Badge variant="outline">{routes.length}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Latest Vehicles */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Latest Vehicles
            </CardTitle>
            <CardDescription>Top 6 vehicles from the database</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {vehicles.length === 0 ? (
              <div className="text-sm text-muted-foreground">No vehicles found.</div>
            ) : (
              vehicles.slice(0, 6).map(v => (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-3 bg-card border border-border/50 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">{v.license_plate}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {v.model} • capacity {v.capacity} • route {s(v.route_id)} • driver {s(v.user_id) || '—'}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {s((v as any).status) || (s(v.user_id).trim() ? 'Assigned' : 'Unassigned')}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Latest Drivers + Latest Routes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Latest Drivers
            </CardTitle>
            <CardDescription>Top 6 driver accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {drivers.length === 0 ? (
              <div className="text-sm text-muted-foreground">No drivers found.</div>
            ) : (
              drivers.slice(0, 6).map(d => (
                <div key={d.id} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <p className="font-semibold text-foreground">{d.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{d.email}</p>
                  <p className="text-xs text-muted-foreground">{d.phone_number}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Latest Routes
            </CardTitle>
            <CardDescription>Top 5 routes from the database</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {routes.length === 0 ? (
              <div className="text-sm text-muted-foreground">No routes found.</div>
            ) : (
              routes.slice(0, 5).map(r => (
                <div key={r.id} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <p className="font-semibold text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {r.starting_point} → {r.ending_point}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {s((r as any).status) || 'Active'}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
