'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Clock } from 'lucide-react'

export default function AnalyticsSection() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Revenue This Month</CardTitle>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold text-foreground">KES 124,560</p>
            <p className="text-sm text-emerald-600">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Total Trips</CardTitle>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold text-foreground">842</p>
            <p className="text-sm text-muted-foreground">Completed this month</p>
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
            <p className="text-3xl font-bold text-foreground">127</p>
            <p className="text-sm text-muted-foreground">Parent accounts</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Avg Occupancy</CardTitle>
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold text-foreground">68%</p>
            <p className="text-sm text-muted-foreground">Across all vehicles</p>
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
            <p className="text-3xl font-bold text-foreground">94.2%</p>
            <p className="text-sm text-emerald-600">+2% improvement</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Customer Satisfaction</CardTitle>
              <BarChart3 className="w-5 h-5 text-pink-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold text-foreground">4.6/5.0</p>
            <p className="text-sm text-muted-foreground">Based on 127 reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Daily Revenue Trend
            </CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { day: 'Mon', amount: 12000, percentage: 60 },
              { day: 'Tue', amount: 15000, percentage: 75 },
              { day: 'Wed', amount: 14500, percentage: 72 },
              { day: 'Thu', amount: 16200, percentage: 81 },
              { day: 'Fri', amount: 18000, percentage: 90 },
              { day: 'Sat', amount: 19500, percentage: 97 },
              { day: 'Sun', amount: 17800, percentage: 89 },
            ].map((d, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{d.day}</span>
                  <span className="text-muted-foreground">KES {d.amount}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${d.percentage}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Route Performance</CardTitle>
            <CardDescription>Bookings by route</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { route: 'RouteA', bookings: 120, occupancy: 85 },
              { route: 'RouteB', bookings: 98, occupancy: 78 },
              { route: 'RouteC', bookings: 110, occupancy: 82 },
              { route: 'RouteD', bookings: 45, occupancy: 60 },
            ].map((r, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{r.route}</span>
                  <Badge variant="outline">{r.bookings} bookings</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${r.occupancy}%` }} />
                  </div>
                  <span className="text-sm font-medium w-10 text-right">{r.occupancy}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
