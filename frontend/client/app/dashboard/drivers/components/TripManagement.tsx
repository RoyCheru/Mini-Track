import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, Users, Car, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

interface Passenger {
  id: number
  name: string
  status: 'pending' | 'picked-up' | 'dropped-off' | 'absent'
}

interface TripManagementProps {
  trip: {
    id: number
    pickup_location: string
    dropoff_location: string
    service_type: 'morning' | 'evening' | 'both'
    seats_booked: number
    passengers?: Passenger[]
  }
  onCompleteTrip: () => void
  onMarkPassenger: (passengerId: number, status: 'picked-up' | 'dropped-off' | 'absent') => void
}

export default function TripManagement({ trip, onCompleteTrip, onMarkPassenger }: TripManagementProps) {
  const passengers = trip.passengers || []
  const pickedUpCount = passengers.filter(p => p.status === 'picked-up').length
  const pendingCount = passengers.filter(p => p.status === 'pending').length
  const progress = passengers.length > 0 ? (pickedUpCount / passengers.length) * 100 : 0

  const getNextPendingPassenger = () => {
    return passengers.find(p => p.status === 'pending')
  }

  const nextPassenger = getNextPendingPassenger()

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="w-5 h-5" />
          Trip Management
        </CardTitle>
        <CardDescription>
          {trip.pickup_location} → {trip.dropoff_location}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Passenger Progress</span>
            <span className="text-sm text-muted-foreground">
              {pickedUpCount} of {passengers.length} picked up
            </span>
          </div>
          
          {/* Custom Progress Bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pending: {pendingCount}</span>
            <span className="text-emerald-600">Picked up: {pickedUpCount}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Quick Actions</h4>
              <p className="text-sm text-muted-foreground">
                Manage passenger boarding quickly
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {nextPassenger && (
              <Button 
                className="w-full h-16 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => onMarkPassenger(nextPassenger.id, 'picked-up')}
              >
                <div className="flex items-center gap-2 w-full justify-start">
                  <CheckCircle className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold">Pick Up: {nextPassenger.name}</div>
                    <div className="text-sm opacity-90">Next in line</div>
                  </div>
                </div>
              </Button>
            )}
            
            <Button 
              variant="outline"
              className="w-full h-16"
              onClick={() => {
                passengers.forEach(p => {
                  if (p.status === 'pending') {
                    onMarkPassenger(p.id, 'absent')
                  }
                })
              }}
            >
              <div className="flex items-center gap-2 w-full justify-start">
                <XCircle className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Mark All Absent</div>
                  <div className="text-sm text-muted-foreground">Remaining: {pendingCount}</div>
                </div>
              </div>
            </Button>
          </div>
        </div>

        {/* Passenger Status Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-700">{passengers.length}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div className="bg-emerald-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-emerald-700">{pickedUpCount}</div>
            <div className="text-xs text-emerald-600">Picked Up</div>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-amber-700">{pendingCount}</div>
            <div className="text-xs text-amber-600">Pending</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-700">
              {passengers.filter(p => p.status === 'dropped-off').length}
            </div>
            <div className="text-xs text-blue-600">Dropped Off</div>
          </div>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Route</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {trip.pickup_location.split(',')[0]} → {trip.dropoff_location.split(',')[0]}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Service Type</span>
            </div>
            <Badge variant="outline" className="capitalize">
              {trip.service_type} Service
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Capacity</span>
            </div>
            <p className="text-sm text-muted-foreground">{trip.seats_booked} assigned seats</p>
          </div>
        </div>

        {/* Complete Trip Button */}
        <div className="pt-4 border-t">
          <Button 
            onClick={onCompleteTrip}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
            disabled={pendingCount > 0}
          >
            Complete Trip
          </Button>
          
          {pendingCount > 0 ? (
            <p className="text-xs text-amber-600 text-center mt-2">
              Cannot complete trip: {pendingCount} passenger{pendingCount !== 1 ? 's' : ''} still pending
            </p>
          ) : (
            <p className="text-xs text-muted-foreground text-center mt-2">
              All passengers have been handled. You can now complete the trip.
            </p>
          )}
        </div>

        {/* Important Notes */}
        {pendingCount > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-800">Action Required</p>
                <p className="text-xs text-amber-700">
                  {pendingCount} passenger{pendingCount !== 1 ? 's' : ''} still pending. 
                  Please mark them as picked up or absent before completing the trip.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}