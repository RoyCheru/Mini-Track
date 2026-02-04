import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, BarChart3, Target } from 'lucide-react'

interface EarningsProps {
  earnings: {
    today: number
    thisWeek: number
    thisMonth: number
    totalTrips: number
    avgRating: number
  }
}

export default function Earnings({ earnings }: EarningsProps) {
  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Earnings Overview
          </CardTitle>
          <CardDescription>Your earnings breakdown and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border/50 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Today</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(earnings.today)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-gradient-to-br from-emerald-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">This Week</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(earnings.thisWeek)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-gradient-to-br from-violet-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(earnings.thisMonth)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-semibold">Performance Metrics</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Trips</span>
                      <span className="font-bold text-foreground">{earnings.totalTrips.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Average Rating</span>
                      <span className="font-bold text-foreground">{earnings.avgRating.toFixed(1)}/5.0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">On-time Rate</span>
                      <span className="font-bold text-foreground">94%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-muted-foreground" />
                    <h3 className="font-semibold">Recent Activity</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span>Morning Route</span>
                      <span className="font-medium text-emerald-600">KES 4,250</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Evening Route</span>
                      <span className="font-medium text-emerald-600">KES 4,250</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Special Trip</span>
                      <span className="font-medium text-emerald-600">KES 2,800</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}