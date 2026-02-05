'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import type * as LeafletTypes from 'leaflet'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Navigation, Phone, MessageSquare, MapPin } from 'lucide-react'
import { apiFetch } from '@/lib/api'

// ================= MAP IMPORTS =================
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false })
const Polyline = dynamic(() => import('react-leaflet').then(m => m.Polyline), { ssr: false })

// ================= LEAFLET SETUP =================
let L: typeof LeafletTypes | null = null

if (typeof window !== 'undefined') {
  import('leaflet').then((leaflet) => {
    L = leaflet.default
    
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })
  })
}

// ================= ICON CREATION FUNCTIONS =================
const createCustomIcon = (color: string) => {
  if (typeof window === 'undefined' || !L) return undefined
  
  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}

const createBusIcon = () => {
  if (typeof window === 'undefined' || !L) return undefined
  
  return new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="48" height="48">
        <!-- Bus body -->
        <rect x="8" y="16" width="48" height="32" rx="4" fill="#FFD700" stroke="#333" stroke-width="2"/>
        
        <!-- Windows -->
        <rect x="12" y="20" width="18" height="12" rx="2" fill="#87CEEB"/>
        <rect x="34" y="20" width="18" height="12" rx="2" fill="#87CEEB"/>
        
        <!-- Front grill -->
        <rect x="12" y="36" width="40" height="4" fill="#333"/>
        
        <!-- Wheels -->
        <circle cx="18" cy="48" r="6" fill="#333" stroke="#666" stroke-width="2"/>
        <circle cx="18" cy="48" r="3" fill="#888"/>
        <circle cx="46" cy="48" r="6" fill="#333" stroke="#666" stroke-width="2"/>
        <circle cx="46" cy="48" r="3" fill="#888"/>
        
        <!-- Headlights -->
        <circle cx="14" cy="42" r="2" fill="#FFF"/>
        <circle cx="50" cy="42" r="2" fill="#FFF"/>
        
        <!-- Top sign -->
        <rect x="24" y="10" width="16" height="6" rx="2" fill="#FF6B6B"/>
        <text x="32" y="15" font-size="4" fill="white" text-anchor="middle" font-weight="bold">SCHOOL</text>
      </svg>
    `)}`,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48],
  })
}

// ================= TYPES =================
type Booking = {
  booking_id: number
  user_id: number
  user_name: string
  pickup_location_name: string
  pickup_location_gps: string
  dropoff_location_name: string
  dropoff_location_gps: string
  route_name: string
  status: string
  service_type: string
  start_date: string
  end_date: string
}

// ================= HELPER FUNCTIONS =================
function parseGPS(gps: string): [number, number] | null {
  if (!gps) return null
  
  const parts = gps.split(',').map(s => parseFloat(s.trim()))
  
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return [parts[0], parts[1]]
  }
  
  return null
}

function calculateDistance(point1: [number, number], point2: [number, number]): number {
  const R = 6371
  const dLat = (point2[0] - point1[0]) * Math.PI / 180
  const dLon = (point2[1] - point1[1]) * Math.PI / 180
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(point1[0] * Math.PI / 180) * Math.cos(point2[0] * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function estimateETA(distance: number, speedKmh: number = 30): string {
  const hours = distance / speedKmh
  const minutes = Math.round(hours * 60)
  
  if (minutes < 60) {
    return `${minutes} mins`
  }
  
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hrs}h ${mins}m`
}

/**
 * Get actual pickup and dropoff based on service type
 * Morning: pickup_location → dropoff_location (home → school)
 * Evening: dropoff_location → pickup_location (school → home)
 */
function getActualLocations(booking: Booking) {
  const isEvening = booking.service_type === 'evening' || booking.service_type === 'both'
  const currentHour = new Date().getHours()
  
  // Determine if it's currently evening time (after 1 PM)
  const isEveningTime = currentHour >= 13
  
  // If it's evening service and evening time, swap the locations
  const shouldSwap = isEvening && isEveningTime
  
  return {
    actualPickup: shouldSwap ? booking.dropoff_location_gps : booking.pickup_location_gps,
    actualPickupName: shouldSwap ? booking.dropoff_location_name : booking.pickup_location_name,
    actualDropoff: shouldSwap ? booking.pickup_location_gps : booking.dropoff_location_gps,
    actualDropoffName: shouldSwap ? booking.pickup_location_name : booking.dropoff_location_name,
    isReversed: shouldSwap
  }
}

// ================= MAIN COMPONENT =================
export default function TrackingSection() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [route, setRoute] = useState<[number, number][]>([])
  const [busPosition, setBusPosition] = useState<[number, number] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [mapCenter, setMapCenter] = useState<[number, number]>([-1.286389, 36.817223])
  
  const [pickupIcon, setPickupIcon] = useState<any>(undefined)
  const [dropoffIcon, setDropoffIcon] = useState<any>(undefined)
  const [busIcon, setBusIcon] = useState<any>(undefined)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((leaflet) => {
        const L = leaflet.default
        
        setPickupIcon(createCustomIcon('#10b981'))
        setDropoffIcon(createCustomIcon('#ef4444'))
        setBusIcon(createBusIcon())
      })
    }
  }, [])

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true)
        setError('')
        
        console.log('Fetching bookings...')
        
        const res = await apiFetch('/bookings')
        
        if (!res.ok) {
          throw new Error(`Failed to fetch bookings: ${res.status}`)
        }
        
        const data = await res.json()
        console.log('Bookings response:', data)
        
        let bookingsList: Booking[] = []
        
        if (Array.isArray(data)) {
          bookingsList = data
        } else if (data.bookings && Array.isArray(data.bookings)) {
          bookingsList = data.bookings
        } else if (data.data && Array.isArray(data.data)) {
          bookingsList = data.data
        }
        
        console.log('Parsed bookings list:', bookingsList)
        
        const activeBookings = bookingsList.filter((b: Booking) => 
          b.status === 'active' && 
          b.pickup_location_gps && 
          b.dropoff_location_gps
        )
        
        console.log('Active bookings with GPS:', activeBookings)
        
        if (activeBookings.length === 0) {
          setError('No active bookings found with valid GPS coordinates')
        }
        
        setBookings(activeBookings)
        
        if (activeBookings.length > 0) {
          setSelectedBooking(activeBookings[0])
        }
      } catch (err) {
        console.error('Error fetching bookings:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch bookings')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  useEffect(() => {
    if (!selectedBooking) return

    console.log('Selected booking:', selectedBooking)

    // Get the actual pickup and dropoff based on service type and time
    const { actualPickup, actualDropoff, isReversed } = getActualLocations(selectedBooking)

    const pickup = parseGPS(actualPickup)
    const dropoff = parseGPS(actualDropoff)

    console.log('Is route reversed (evening):', isReversed)
    console.log('Actual pickup:', pickup)
    console.log('Actual dropoff:', dropoff)

    if (!pickup || !dropoff) {
      console.error('Invalid GPS coordinates')
      setError('Invalid GPS coordinates in booking')
      return
    }

    async function fetchRoute() {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${pickup![1]},${pickup![0]};${dropoff![1]},${dropoff![0]}?overview=full&geometries=geojson`
        
        console.log('Fetching route from OSRM:', url)
        
        const res = await fetch(url)
        const data = await res.json()

        console.log('OSRM response:', data)

        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng] as [number, number]
          )

          console.log('Route coordinates count:', coords.length)

          setRoute(coords)
          setBusPosition(coords[0])
          
          const centerLat = (pickup![0] + dropoff![0]) / 2
          const centerLng = (pickup![1] + dropoff![1]) / 2
          setMapCenter([centerLat, centerLng])
          
          setError('')
        } else {
          setError('Could not find route between locations')
        }
      } catch (err) {
        console.error('Failed to fetch route:', err)
        setError('Failed to fetch route from OSRM')
      }
    }

    fetchRoute()
  }, [selectedBooking])

  useEffect(() => {
    if (!route.length) return

    let i = 0
    const interval = setInterval(() => {
      i++
      if (i < route.length) {
        setBusPosition(route[i])
      } else {
        i = 0
        setBusPosition(route[0])
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [route])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tracking data...</p>
        </div>
      </div>
    )
  }

  if (error && bookings.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Bookings</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </CardContent>
      </Card>
    )
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Active Bookings</h3>
          <p className="text-muted-foreground mb-4">
            You don't have any active bookings to track. Create a booking to see live tracking.
          </p>
        </CardContent>
      </Card>
    )
  }

  // Get actual locations for display
  const { 
    actualPickup, 
    actualPickupName, 
    actualDropoff, 
    actualDropoffName,
    isReversed 
  } = selectedBooking ? getActualLocations(selectedBooking) : {
    actualPickup: null,
    actualPickupName: '',
    actualDropoff: null,
    actualDropoffName: '',
    isReversed: false
  }

  const pickup = actualPickup ? parseGPS(actualPickup) : null
  const dropoff = actualDropoff ? parseGPS(actualDropoff) : null
  const distance = pickup && dropoff ? calculateDistance(pickup, dropoff) : 0
  const eta = distance > 0 ? estimateETA(distance) : 'Calculating...'

  return (
    <div className="space-y-6">
      {/* Booking Selector */}
      {bookings.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Select Booking to Track</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {bookings.map((booking) => (
                <Button
                  key={booking.booking_id}
                  variant={selectedBooking?.booking_id === booking.booking_id ? 'default' : 'outline'}
                  onClick={() => setSelectedBooking(booking)}
                  className="text-sm"
                >
                  {booking.route_name} - {booking.service_type}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAP */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex gap-2 items-center">
                  <Navigation className="w-5 h-5 text-blue-500" />
                  Live Trip Tracking - {selectedBooking?.route_name}
                </CardTitle>
                {isReversed && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    Evening Route (Reversed)
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="h-[450px] w-full">
                <MapContainer
                  center={mapCenter}
                  zoom={13}
                  className="h-full w-full"
                  key={`${selectedBooking?.booking_id}-${isReversed}`}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />

                  {route.length > 0 && (
                    <Polyline 
                      positions={route} 
                      pathOptions={{ 
                        color: '#3b82f6', 
                        weight: 4,
                        opacity: 0.7
                      }} 
                    />
                  )}

                  {pickup && pickupIcon && (
                    <Marker position={pickup} icon={pickupIcon}>
                      <Popup>
                        <div className="font-semibold">🏁 Pickup Location</div>
                        <div className="text-sm">{actualPickupName}</div>
                        {isReversed && (
                          <div className="text-xs text-muted-foreground mt-1">
                            (School - Evening Route)
                          </div>
                        )}
                      </Popup>
                    </Marker>
                  )}

                  {dropoff && dropoffIcon && (
                    <Marker position={dropoff} icon={dropoffIcon}>
                      <Popup>
                        <div className="font-semibold">🎯 Drop-off Location</div>
                        <div className="text-sm">{actualDropoffName}</div>
                        {isReversed && (
                          <div className="text-xs text-muted-foreground mt-1">
                            (Home - Evening Route)
                          </div>
                        )}
                      </Popup>
                    </Marker>
                  )}

                  {busPosition && busIcon && (
                    <Marker position={busPosition} icon={busIcon}>
                      <Popup>
                        <div className="font-semibold">🚌 School Bus</div>
                        <div className="text-sm">En route to {actualDropoffName}</div>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SIDE INFO */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Trip Status</CardTitle>
                <Badge className="bg-emerald-600">
                  {isReversed ? '🌆 Evening Run' : '🌅 Morning Run'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Route</p>
                <p className="font-semibold">{selectedBooking?.route_name}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Pickup {isReversed && '(School)'}
                </p>
                <p className="font-medium text-sm">{actualPickupName}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Drop-off {isReversed && '(Home)'}
                </p>
                <p className="font-medium text-sm">{actualDropoffName}</p>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">Distance</p>
                <p className="font-semibold">{distance.toFixed(2)} km</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Estimated Time</p>
                <p className="font-semibold">{eta}</p>
              </div>

              {isReversed && (
                <div className="pt-2 border-t">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-700 font-medium">
                      ℹ️ Evening route: Bus starts from school and goes to home
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button variant="outline" className="w-full gap-2">
                <Phone className="w-4 h-4" />
                Call Driver
              </Button>
              
              <Button variant="outline" className="w-full gap-2">
                <MessageSquare className="w-4 h-4" />
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}