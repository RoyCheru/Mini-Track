export default function RouteMap() {
  
  interface ScheduleItem {
  pickup_location: string
  dropoff_location: string
  service_type: string
}

interface RouteMapProps {
  schedule: ScheduleItem[]
}

export default function RouteMap({ schedule }: RouteMapProps) {
  return null
}
  
import { Route } from 'lucide-react'

export default function RouteMap({ schedule }: RouteMapProps) {
  if (schedule.length === 0) {
    return (
      <div className="text-center py-8">
        <Route className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No routes scheduled</p>
      </div>
    )
  }

  return null
}



}