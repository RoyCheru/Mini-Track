import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Fuel, Users, Wrench, Car } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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

  return (
    <Card className="border-border/50 bg-card shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Car className="w-4 h-4" />
            Vehicle Status
          </CardTitle>
          <Badge className={`${statusColors[vehicle.status]} text-white`}>
            {vehicle.status}
          </Badge>
        </div>
        <CardDescription>{vehicle.license_plate} • {vehicle.model}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>Occupancy</span>
            </div>
            <span className="font-medium">
              {vehicle.current_passengers}/{vehicle.capacity}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Fuel className="w-4 h-4 text-muted-foreground" />
              <span>Fuel Level</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    vehicle.fuel_level > 60 ? 'bg-emerald-500' : 
                    vehicle.fuel_level > 30 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${vehicle.fuel_level}%` }}
                />
              </div>
              <span className="font-medium text-sm w-8">{vehicle.fuel_level}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Wrench className="w-4 h-4 text-muted-foreground" />
              <span>Next Service</span>
            </div>
            <span className="font-medium text-sm">{vehicle.next_service}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}