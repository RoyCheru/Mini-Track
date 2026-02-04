'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Truck, MapPin, TrendingUp, Clock, AlertCircle } from 'lucide-react'
import { apiFetch } from '@/lib/api'

type Driver = {
  id: number
  name: string
  email: string
  phone_number: string
  status: 'Active' | 'Inactive' | string
}

type Route = {
  id: number
  name: string
  starting_point: string
  ending_point: string
  status: 'Active' | 'Inactive' | string
}

type Vehicle = {
  id: number
  route_id: number | string
  user_id: number | string
  license_plate: string
  model: string
  capacity: number
  status: 'Active' | 'Inactive' | string
}

// Optional (only used if your backend exposes /bookings/recent)
type Booking = {
  id: string
  parent: string
  route: string
  seats: number
  amount: number
  status: string
  time: string
}

const isActive = (status: any) => String(status ?? '').toLowerCase() === 'active'

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

export default function OverviewSection() {
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

        const headers: HeadersInit = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }

        const [driversRes, routesRes, vehiclesRes] = await Promise.all([
          apiFetch('/drivers', { headers }),
          apiFetch('/routes', { headers }),
          apiFetch('/vehicles', { headers }),
        ])

        // Helpful debug (leave for now; remove later)
        console.log('drivers status:', driversRes.status)
        console.log('routes status:', routesRes.status)
        console.log('vehicles status:', vehiclesRes.status)

        if (!driversRes.ok) throw new Error(`Drivers fetch failed (${driversRes.status})`)
        if (!routesRes.ok) throw new Error(`Routes fetch failed (${routesRes.status})`)
        if (!vehiclesRes.ok) throw new Error(`Vehicles fetch failed (${vehiclesRes.status})`)

        const [driversJson, routesJson, vehiclesJson] = await Promise.all([
          driversRes.json(),
          routesRes.json(),
          vehiclesRes.json(),
        ])

        console.log('drivers json:', driversJson)
        console.log('routes json:', routesJson)
        console.log('vehicles json:', vehiclesJson)

        setDrivers(toArray(driversJson))
        setRoutes(toArray(routesJson))
        setVehicles(toArray(vehiclesJson))

        // Optional: recent bookings (only if endpoint exists)
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
        setError(e?.message || 'Failed to load overview data')
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

  const activeDrivers = useMemo(() => drivers.filter(d => isActive(d.status)).length, [drivers])
  const activeRoutes = useMemo(() => routes.filter(r => isActive(r.status)).length, [routes])
  const activeVehicles = useMemo(() => vehicles.filter(v => isActive(v.status)).length, [vehicles])

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Loading dashboard data…</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Please wait.</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Failed to load overview
            </CardTitle>
            <CardDescription>Check your API server, token, and endpoints.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-red-600 whitespace-pre-wrap">{error}</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Vehicles</p>
                <p className="text-3xl font-bold text-foreground mt-2">{activeVehicles}</p>
                <p className="text-xs text-muted-foreground mt-1">Fleet online</p>
              </div>
              <Truck className="w-10 h-10 text-muted-foreground/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Drivers</p>
                <p className="text-3xl font-bold text-foreground mt-2">{activeDrivers}</p>
                <p className="text-xs text-muted-foreground mt-1">On duty</p>
              </div>
              <Users className="w-10 h-10 text-muted-foreground/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Routes Operational</p>
                <p className="text-3xl font-bold text-foreground mt-2">{activeRoutes}</p>
                <p className="text-xs text-muted-foreground mt-1">Configured</p>
              </div>
              <MapPin className="w-10 h-10 text-muted-foreground/20" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today’s Bookings</p>
                <p className="text-3xl font-bold text-foreground mt-2">{recentBookings.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
              </div>
              <TrendingUp className="w-10 h-10 text-muted-foreground/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent bookings + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Bookings
              </CardTitle>
              <CardDescription>
                {recentBookings.length ? 'Loaded from database' : 'No recent bookings endpoint / no data'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentBookings.length === 0 ? (
                <div className="text-sm text-muted-foreground">No recent bookings.</div>
              ) : (
                <div className="space-y-3">
                  {recentBookings.map(b => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between p-3 bg-card border border-border/50 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-foreground">{b.id}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {b.parent} • {b.route} • {b.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-semibold text-sm text-foreground">KES {b.amount}</p>
                          <p className="text-xs text-muted-foreground">{b.seats} seats</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            String(b.status).toLowerCase() === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                              : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
                          }
                        >
                          {b.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* System Status */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Vehicles</p>
                <Badge className="bg-emerald-600">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Drivers</p>
                <Badge className="bg-emerald-600">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Routes</p>
                <Badge className="bg-emerald-600">Configured</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Fleet Snapshot */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Fleet Snapshot</CardTitle>
              <CardDescription>Showing up to 5 vehicles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {vehicles.length === 0 ? (
                <div className="text-sm text-muted-foreground">No vehicles found.</div>
              ) : (
                vehicles.slice(0, 5).map(v => (
                  <div key={v.id} className="p-3 rounded-lg bg-muted/30">
                    <p className="font-semibold text-foreground">{v.license_plate}</p>
                    <p className="text-xs text-muted-foreground">
                      Model: {v.model} • Capacity: {v.capacity} • route_id: {String(v.route_id)} • user_id:{' '}
                      {String(v.user_id)}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
