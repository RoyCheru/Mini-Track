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
            <p className="text-sm text-muted-foreground">Across all buses</p>
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

      {/* Performance Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Daily Revenue Trend
            </CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { day: 'Mon', amount: 12000, percentage: 60 },
                { day: 'Tue', amount: 15000, percentage: 75 },
                { day: 'Wed', amount: 14500, percentage: 72 },
                { day: 'Thu', amount: 16200, percentage: 81 },
                { day: 'Fri', amount: 18000, percentage: 90 },
                { day: 'Sat', amount: 19500, percentage: 97 },
                { day: 'Sun', amount: 17800, percentage: 89 },
              ].map((day, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{day.day}</span>
                    <span className="text-muted-foreground">KES {day.amount}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${day.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Route Performance */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Route Performance</CardTitle>
            <CardDescription>Bookings by route</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { route: 'Route A - Downtown', bookings: 120, occupancy: 85 },
                { route: 'Route B - Westside', bookings: 98, occupancy: 78 },
                { route: 'Route C - Eastside', bookings: 110, occupancy: 82 },
                { route: 'Route D - Northgate', bookings: 45, occupancy: 60 },
              ].map((route, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{route.route}</span>
                    <Badge variant="outline">{route.bookings} bookings</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{ width: `${route.occupancy}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-10 text-right">
                      {route.occupancy}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Summary */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Monthly Summary</CardTitle>
          <CardDescription>January 2025 statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Bookings</p>
              <p className="text-2xl font-bold text-foreground mt-2">842</p>
              <p className="text-xs text-emerald-600 mt-1">+8% vs last month</p>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Revenue</p>
              <p className="text-2xl font-bold text-foreground mt-2">KES 124.6K</p>
              <p className="text-xs text-emerald-600 mt-1">+12% vs last month</p>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Fare</p>
              <p className="text-2xl font-bold text-foreground mt-2">KES 148</p>
              <p className="text-xs text-muted-foreground mt-1">Per seat booking</p>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Cancellation Rate</p>
              <p className="text-2xl font-bold text-foreground mt-2">3.2%</p>
              <p className="text-xs text-emerald-600 mt-1">Below industry avg</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Top Drivers</CardTitle>
            <CardDescription>By trips completed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'John Kamau', trips: 156, rating: 4.8 },
                { name: 'Peter Kipchoge', trips: 189, rating: 4.9 },
                { name: 'Samuel Kipkemboi', trips: 142, rating: 4.7 },
              ].map((driver, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-card border border-border/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{driver.name}</p>
                    <p className="text-xs text-muted-foreground">{driver.trips} trips</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">⭐ {driver.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Bus Fleet Status</CardTitle>
            <CardDescription>Current operational status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-foreground">Active Buses</span>
                <Badge className="bg-emerald-600">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground">In Transit</span>
                <Badge className="bg-blue-600">10</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground">Maintenance Required</span>
                <Badge className="bg-yellow-600">1</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground">Idle/Parked</span>
                <Badge className="bg-gray-600">1</Badge>
              </div>
              <div className="border-t border-border/50 pt-3 flex justify-between items-center">
                <span className="font-medium text-foreground">Average Utilization</span>
                <span className="font-bold text-primary">78%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
