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
  

}