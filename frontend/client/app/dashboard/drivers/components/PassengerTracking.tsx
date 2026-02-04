import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, CheckCircle, XCircle, Clock, Phone, MapPin, Sun, Moon } from 'lucide-react'

interface Passenger {
  id: number
  name: string
  parent_name: string
  parent_phone: string
  pickup_location: string
  dropoff_location: string
  status: 'pending' | 'picked-up' | 'dropped-off' | 'absent'
  checked_in_time?: string
  checked_out_time?: string
  trip_type: 'morning' | 'evening'
}

interface PassengerTrackingProps {
  trip: {
    id: number
    pickup_location: string
    dropoff_location: string
    service_type: 'morning' | 'evening' | 'both'
    passengers?: Passenger[]
  }
  onMarkPassenger: (passengerId: number, status: 'picked-up' | 'dropped-off' | 'absent') => void
}

export default function PassengerTracking({ trip, onMarkPassenger }: PassengerTrackingProps) {
  const passengers = trip.passengers || []
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'picked-up': return 'bg-emerald-500 text-white'
      case 'dropped-off': return 'bg-blue-500 text-white'
      case 'absent': return 'bg-red-500 text-white'
      default: return 'bg-gray-200 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'picked-up': return 'Picked Up'
      case 'dropped-off': return 'Dropped Off'
      case 'absent': return 'Absent'
      default: return 'Pending'
    }
  }

  const getTripTypeIcon = (tripType: 'morning' | 'evening') => {
    return tripType === 'morning' ? 
      <Sun className="w-3 h-3 text-amber-600" /> : 
      <Moon className="w-3 h-3 text-indigo-600" />
  }

  const pendingPassengers = passengers.filter(p => p.status === 'pending')
  const completedPassengers = passengers.filter(p => p.status !== 'pending')

  return (
    <div className="space-y-6">
      {/* Trip Info Header */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Passenger Tracking - {trip.service_type.toUpperCase()} Trip
          </CardTitle>
          <CardDescription>
            {trip.pickup_location} → {trip.dropoff_location}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {pendingPassengers.length} pending • {completedPassengers.length} completed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Mark all pending as absent
                  pendingPassengers.forEach(p => onMarkPassenger(p.id, 'absent'))
                }}
              >
                Mark All Absent
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Passengers */}
      {pendingPassengers.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Pending ({pendingPassengers.length})</CardTitle>
            <CardDescription>Mark passengers as they board the vehicle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingPassengers.map(passenger => (
                <div key={passenger.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{passenger.name}</span>
                      <div className="flex items-center gap-1">
                        {getTripTypeIcon(passenger.trip_type)}
                        <Badge variant="outline" className="text-xs">
                          Seat {passenger.id}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {passenger.parent_phone}
                      </span>
                      <span>Parent: {passenger.parent_name}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onMarkPassenger(passenger.id, 'picked-up')}
                      className={`${
                        passenger.trip_type === 'morning' 
                          ? 'bg-amber-600 hover:bg-amber-700' 
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Pick Up
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMarkPassenger(passenger.id, 'absent')}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Absent
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Passengers */}
      {completedPassengers.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Completed ({completedPassengers.length})</CardTitle>
            <CardDescription>Passengers who have been picked up, dropped off, or marked absent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedPassengers.map(passenger => (
                <div key={passenger.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{passenger.name}</span>
                      <div className="flex items-center gap-1">
                        {getTripTypeIcon(passenger.trip_type)}
                        <Badge className={getStatusColor(passenger.status)}>
                          {getStatusText(passenger.status)}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {passenger.status === 'picked-up' && passenger.checked_in_time && (
                        <span>Picked up at {passenger.checked_in_time}</span>
                      )}
                      {passenger.status === 'dropped-off' && passenger.checked_out_time && (
                        <span>Dropped off at {passenger.checked_out_time}</span>
                      )}
                      {passenger.status === 'absent' && (
                        <span>Marked absent</span>
                      )}
                    </div>
                  </div>
                  {passenger.status === 'picked-up' && (
                    <Button
                      size="sm"
                      onClick={() => onMarkPassenger(passenger.id, 'dropped-off')}
                    >
                      Mark Dropped Off
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Passengers Message */}
      {passengers.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No Passengers Assigned</h3>
              <p className="text-muted-foreground">No passengers have been assigned to this trip yet</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}