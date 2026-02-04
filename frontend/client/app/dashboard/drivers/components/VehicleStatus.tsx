export default function VehicleStatus() {

interface VehicleStatusProps {
  vehicle: {
    license_plate: string
    model: string
    capacity: number
    current_passengers: number
    fuel_level: number
    status: 'active' | 'maintenance' | 'offline'
    next_service: string
  }
}
export default function VehicleStatus({ vehicle }: VehicleStatusProps) {
  const statusColors = {
    active: 'bg-emerald-500',
    maintenance: 'bg-amber-500',
    offline: 'bg-red-500'
  }


{

   return (
    <div>
      Vehicle Status
    </div>
  )
}
}