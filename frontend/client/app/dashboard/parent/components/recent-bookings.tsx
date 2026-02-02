'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, ArrowRight } from 'lucide-react'

const RECENT = [
  {
    date: 'Today',
    route: 'Route A - Downtown',
    time: '7:30 AM',
    status: 'In Transit',
    seats: 2,
    cost: 400,
  },
  {
    date: 'Yesterday',
    route: 'Route B - Westside',
    time: '7:30 AM',
    status: 'Completed',
    seats: 2,
    cost: 360,
  },
  {
    date: 'Jan 28',
    route: 'Route A - Downtown',
    time: '7:30 AM',
    status: 'Completed',
    seats: 1,
    cost: 200,
  },
]

export default function RecentBookings() {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Bookings
            </CardTitle>
            <CardDescription>Your latest transport bookings</CardDescription>
          </div>
          <Button size="sm" variant="ghost">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {RECENT.map((booking, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-card border border-border/50 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">{booking.route}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {booking.date} • {booking.time}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-semibold text-sm text-foreground">KES {booking.cost}</p>
                  <p className="text-xs text-muted-foreground">{booking.seats} seats</p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    booking.status === 'In Transit'
                      ? 'bg-blue-500/10 text-blue-600 border-blue-500/30'
                      : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
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
  )
}
