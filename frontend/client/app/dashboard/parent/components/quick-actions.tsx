'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Zap, Plus, AlertCircle, HelpCircle } from 'lucide-react'

export default function QuickActionSection() {
  return (
    <div className="space-y-4">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="w-4 h-4 text-yellow-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button className="w-full justify-start bg-transparent" variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Booking
          </Button>
          <Button className="w-full justify-start bg-transparent" variant="outline" size="sm">
            <AlertCircle className="w-4 h-4 mr-2" />
            Emergency Contact
          </Button>
          <Button className="w-full justify-start bg-transparent" variant="outline" size="sm">
            <HelpCircle className="w-4 h-4 mr-2" />
            Support
          </Button>
        </CardContent>
      </Card>

      {/* Emergency Alert */}
      <Card className="border-red-500/30 bg-red-500/5">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <p className="font-semibold text-red-600">Emergency Alert System</p>
            <p className="text-xs text-muted-foreground">
              In case of emergency, you can immediately alert the driver and receive real-time
              assistance.
            </p>
            <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">
              Send Emergency Alert
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
