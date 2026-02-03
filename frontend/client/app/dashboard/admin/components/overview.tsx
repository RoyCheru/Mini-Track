'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Truck, MapPin, TrendingUp, Clock, AlertCircle } from 'lucide-react'

type Driver = {
  id: number
  name: string
  email: string
  phone_number: string
  status: 'Active' | 'Inactive'
}

type Route = {
  id: number
  name: string
  starting_point: string
  ending_point: string
  status: 'Active' | 'Inactive'
}

type Vehicle = {
  id: number
  route_id: string
  user_id: string
  license_plate: string
  model: string
  capacity: number
  status: 'Active' | 'Inactive'
}

const SEED_DRIVERS: Driver[] = [
  { id: 1, name: 'Titus Kiptoo', email: 'tituskiptoo@email.com', phone_number: '0700000000', status: 'Active' },
]

const SEED_ROUTES: Route[] = [
  { id: 1, name: 'RouteA', starting_point: 'Langatta womens prison', ending_point: 'CBD', status: 'Active' },
]

const SEED_VEHICLES: Vehicle[] = [
  { id: 1, route_id: '1', user_id: '2', license_plate: 'KDC 123X', model: 'Scania', capacity: 42, status: 'Active' },
]

const RECENT_BOOKINGS = [
  { id: 'BK-2401', parent: 'Jane Kipchoge', route: 'RouteA', seats: 2, amount: 400, status: 'Confirmed', time: '7:30 AM' },
  { id: 'BK-2402', parent: 'John Kiprotich', route: 'RouteA', seats: 1, amount: 200, status: 'Pending', time: '7:35 AM' },
]

export default function OverviewSection() {
  const activeDrivers = SEED_DRIVERS.filter(d => d.status === 'Active').length
  const activeRoutes = SEED_ROUTES.filter(r => r.status === 'Active').length
  const activeVehicles = SEED_VEHICLES.filter(v => v.status === 'Active').length

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
                <p className="text-3xl font-bold text-foreground mt-2">{RECENT_BOOKINGS.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
              </div>
              <TrendingUp className="w-10 h-10 text-muted-foreground/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Bookings
              </CardTitle>
              <CardDescription>Sample UI data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {RECENT_BOOKINGS.map(b => (
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
                          b.status === 'Confirmed'
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
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <div className="space-y-4">
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

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Fleet Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {SEED_VEHICLES.map(v => (
                <div key={v.id} className="p-3 rounded-lg bg-muted/30">
                  <p className="font-semibold text-foreground">{v.license_plate}</p>
                  <p className="text-xs text-muted-foreground">
                    Model: {v.model} • Capacity: {v.capacity} • route_id: {v.route_id} • user_id: {v.user_id}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
