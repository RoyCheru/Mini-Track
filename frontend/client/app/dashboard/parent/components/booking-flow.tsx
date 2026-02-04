'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { MapPin, Users, TrendingUp, CheckCircle2 } from 'lucide-react'

const SAMPLE_ROUTES = [
  { id: 1, name: 'Route A - Downtown', pickups: 5, cost: 200 },
  { id: 2, name: 'Route B - Westside', pickups: 4, cost: 180 },
  { id: 3, name: 'Route C - Eastside', pickups: 6, cost: 220 },
]

export default function BookingFlow() {
  const [step, setStep] = useState(1)
  const [selectedRoute, setSelectedRoute] = useState('')
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [seats, setSeats] = useState(1)
  const [bookingData, setBookingData] = useState<any>(null)

  const getSelectedRoute = () => SAMPLE_ROUTES.find(r => r.id.toString() === selectedRoute)
  const totalCost = selectedRoute ? (getSelectedRoute()?.cost || 0) * seats : 0

  const handleStepOne = () => {
    if (selectedRoute && pickup && dropoff) {
      setStep(2)
    }
  }

  const handleBooking = () => {
    const route = getSelectedRoute()
    setBookingData({
      route: route?.name,
      pickup,
      dropoff,
      seats,
      totalCost,
      timestamp: new Date().toLocaleString(),
    })
    setStep(3)
  }

  const resetBooking = () => {
    setStep(1)
    setSelectedRoute('')
    setPickup('')
    setDropoff('')
    setSeats(1)
    setBookingData(null)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                s <= step
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`w-12 h-1 rounded-full ${
                  s < step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Route & Location Selection */}
      {step === 1 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Select Route & Locations
            </CardTitle>
            <CardDescription>Choose your pickup and dropoff points</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Route Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Available Routes</Label>
              <div className="grid grid-cols-1 gap-3">
                {SAMPLE_ROUTES.map(route => (
                  <button
                    key={route.id}
                    onClick={() => setSelectedRoute(route.id.toString())}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedRoute === route.id.toString()
                        ? 'border-primary bg-primary/5'
                        : 'border-border/30 bg-card hover:border-border/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{route.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {route.pickups} stops • KES {route.cost}/seat
                        </p>
                      </div>
                      {selectedRoute === route.id.toString() && (
                        <Badge className="bg-primary">Selected</Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Location Selection */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="pickup" className="text-base font-semibold">
                  Pickup Location
                </Label>
                <Input
                  id="pickup"
                  placeholder="Enter pickup location"
                  value={pickup}
                  onChange={e => setPickup(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="dropoff" className="text-base font-semibold">
                  Dropoff Location
                </Label>
                <Input
                  id="dropoff"
                  placeholder="Enter dropoff location"
                  value={dropoff}
                  onChange={e => setDropoff(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>

            <Button
              onClick={handleStepOne}
              disabled={!selectedRoute || !pickup || !dropoff}
              size="lg"
              className="w-full"
            >
              Continue to Seat Selection
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Seat Selection & Booking Confirmation */}
      {step === 2 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Select Seats & Confirm
            </CardTitle>
            <CardDescription>Review your booking details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Route</span>
                <span className="font-semibold text-foreground">
                  {getSelectedRoute()?.name}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pickup</span>
                <span className="font-semibold text-foreground">{pickup}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dropoff</span>
                <span className="font-semibold text-foreground">{dropoff}</span>
              </div>
            </div>

            <Separator />

            {/* Seat Selection */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Number of Seats</Label>
              <div className="flex items-center gap-4 bg-card border border-border/50 p-4 rounded-lg">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSeats(Math.max(1, seats - 1))}
                >
                  −
                </Button>
                <span className="text-2xl font-bold w-12 text-center">{seats}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSeats(seats + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Cost per seat
                </span>
                <span className="font-medium">
                  KES {getSelectedRoute()?.cost}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Number of seats</span>
                <span className="font-medium">{seats}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Total Cost</span>
                <span className="font-bold text-primary">
                  KES {totalCost}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleBooking}
                className="flex-1"
              >
                Confirm Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Booking Confirmation */}
      {step === 3 && bookingData && (
        <Card className="border-border/50 border-emerald-500/50 bg-emerald-500/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-emerald-600">Booking Confirmed!</CardTitle>
                <CardDescription>Your reservation has been successfully made</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Confirmation Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Booking Details
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Route</p>
                    <p className="font-semibold text-foreground mt-1">
                      {bookingData.route}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Seats</p>
                    <p className="font-semibold text-foreground mt-1">
                      {bookingData.seats}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pickup</p>
                    <p className="font-semibold text-foreground mt-1">
                      {bookingData.pickup}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Dropoff</p>
                    <p className="font-semibold text-foreground mt-1">
                      {bookingData.dropoff}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="bg-card border border-border/50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    KES {bookingData.totalCost}
                  </p>
                </div>
                <Badge className="bg-emerald-600">Confirmed</Badge>
              </div>
            </div>

            <Button
              onClick={resetBooking}
              className="w-full"
            >
              Make Another Booking
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
