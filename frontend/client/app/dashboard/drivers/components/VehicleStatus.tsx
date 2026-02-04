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

export default function VehicleStatus({ status }: VehicleStatusProps) {

   return (
    <div>
      Vehicle Status
    </div>
  )
}
}