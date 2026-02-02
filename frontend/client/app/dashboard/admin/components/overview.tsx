'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, Truck, MapPin, TrendingUp, Clock, AlertCircle } from 'lucide-react'

const STATS = [
  {
    title: 'Active Buses',
    value: '12',
    change: '+2 this week',
    icon: Truck,
    bg: 'from-blue-500/10 to-blue-500/5',
  },
  {
    title: 'Active Drivers',
    value: '18',
    change: '+1 this week',
    icon: Users,
    bg: 'from-emerald-500/10 to-emerald-500/5',
  },
  {
    title: 'Routes Operational',
    value: '8',
    change: 'All active',
    icon: MapPin,
    bg: 'from-orange-500/10 to-orange-500/5',
  },
  {
    title: 'Today\'s Bookings',
    value: '42',
    change: '+8 from yesterday',
    icon: TrendingUp,
    bg: 'from-purple-500/10 to-purple-500/5',
  },
]

const RECENT_BOOKINGS = [
  {
    id: 'BK-2401',
    parent: 'Jane Kipchoge',
    route: 'Route A',
    seats: 2,
    amount: 400,
    status: 'Confirmed',
    time: '7:30 AM',
  },
  {
    id: 'BK-2402',
    parent: 'John Kiprotich',
    route: 'Route B',
    seats: 1,
    amount: 180,
    status: 'Confirmed',
    time: '7:35 AM',
  },
  {
    id: 'BK-2403',
    parent: 'Mary Kipkosgei',
    route: 'Route C',
    seats: 3,
    amount: 660,
    status: 'Pending',
    time: '7:40 AM',
  },
]

const ACTIVE_BUSES = [
  { id: 'BUS-001', route: 'Route A', driver: 'John Kamau', passengers: 8, capacity: 15, status: 'In Transit' },
  { id: 'BUS-002', route: 'Route B', driver: 'Peter Kipchoge', passengers: 12, capacity: 15, status: 'In Transit' },
  { id: 'BUS-003', route: 'Route C', driver: 'Samuel Kipkemboi', passengers: 5, capacity: 15, status: 'In Transit' },
]

export default function OverviewSection() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className={`bg-gradient-to-br ${stat.bg} border-border/50`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <Icon className="w-10 h-10 text-muted-foreground/20" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Bookings
              </CardTitle>
              <CardDescription>Last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {RECENT_BOOKINGS.map(booking => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 bg-card border border-border/50 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">{booking.id}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {booking.parent} • {booking.route} • {booking.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-semibold text-sm text-foreground">KES {booking.amount}</p>
                        <p className="text-xs text-muted-foreground">{booking.seats} seats</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          booking.status === 'Confirmed'
                            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                            : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
                        }
                      >
                        {booking.status}
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
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Buses</p>
                  <Badge className="bg-emerald-600">All Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Drivers</p>
                  <Badge className="bg-emerald-600">All Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Routes</p>
                  <Badge className="bg-emerald-600">All Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Services</p>
                  <Badge className="bg-emerald-600">Operational</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Revenue Today</p>
                <p className="text-2xl font-bold text-foreground mt-1">KES 8,480</p>
              </div>
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Avg. Occupancy</p>
                <p className="text-2xl font-bold text-foreground mt-1">68%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Buses */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Active Buses
          </CardTitle>
          <CardDescription>Real-time bus status and occupancy</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Bus ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Route</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Driver</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Occupancy</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {ACTIVE_BUSES.map(bus => (
                  <tr key={bus.id} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium text-foreground">{bus.id}</td>
                    <td className="py-3 px-4 text-muted-foreground">{bus.route}</td>
                    <td className="py-3 px-4 text-muted-foreground">{bus.driver}</td>
                    <td className="py-3 px-4">
                      <div className="w-20 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{
                            width: `${(bus.passengers / bus.capacity) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {bus.passengers}/{bus.capacity}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className="bg-emerald-600">{bus.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
