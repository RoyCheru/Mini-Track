import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, Clock, Car, Play, CheckCircle } from 'lucide-react'

interface ScheduleViewProps {
  schedule: Array<{
    id: number
    pickup_location: string
    dropoff_location: string
    start_date: string
    service_type: 'morning' | 'evening' | 'both'
    seats_booked: number
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
    days_of_week: string
  }>
  onStartTrip: (tripId: number) => void
  onCompleteTrip: (tripId: number) => void
  showAll?: boolean
}

export default function ScheduleView({ schedule, onStartTrip, onCompleteTrip, showAll = false }: ScheduleViewProps) {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  if (schedule.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No trips scheduled</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {schedule.map(trip => {
        const days = trip.days_of_week.split(',').map(d => dayNames[parseInt(d) - 1])
        
        return (
          <div key={trip.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">
                    {trip.pickup_location.split(',')[0]} → {trip.dropoff_location.split(',')[0]}
                  </h4>
                  <Badge 
                    variant={trip.status === 'in-progress' ? 'default' : 'outline'} 
                    className="capitalize"
                  >
                    {trip.status}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {trip.service_type}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {trip.seats_booked} passengers
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {trip.start_date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {days.join(', ')}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {trip.pickup_location.split(',')[0]}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                {trip.status === 'scheduled' && (
                  <Button 
                    size="sm" 
                    onClick={() => onStartTrip(trip.id)}
                    className="gap-1"
                  >
                    <Play className="w-4 h-4" />
                    Start Trip
                  </Button>
                )}
                {trip.status === 'in-progress' && (
                  <Button 
                    size="sm" 
                    onClick={() => onCompleteTrip(trip.id)}
                    className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Complete Trip
                  </Button>
                )}
              </div>
            </div>
            
            {/* Passenger Count Preview */}
            {showAll && (
              <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                <span>{trip.seats_booked} children assigned for {trip.service_type} service</span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}