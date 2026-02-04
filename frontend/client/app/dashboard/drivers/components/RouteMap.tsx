import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Navigation, Route, ChevronRight } from 'lucide-react'

interface ScheduleItem {
  pickup_location: string
  dropoff_location: string
  service_type: string
}

interface RouteMapProps {
  schedule: ScheduleItem[]
}

export default function RouteMap({ schedule }: RouteMapProps) {
  if (schedule.length === 0) {
    return (
      <div className="text-center py-8">
        <Route className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No routes scheduled</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {schedule.map((trip, index) => (
        <div key={index} className="border-l-2 border-blue-500 pl-4 py-2">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg mt-1">
              <Navigation className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium capitalize">{trip.service_type} Route</h4>
                <span className="text-xs px-2 py-1 bg-muted rounded-full">Active</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Pickup</p>
                    <p className="text-sm text-muted-foreground">{trip.pickup_location}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground ml-2" />
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Dropoff</p>
                    <p className="text-sm text-muted-foreground">{trip.dropoff_location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}