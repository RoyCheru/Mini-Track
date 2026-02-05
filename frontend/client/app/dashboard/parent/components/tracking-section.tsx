'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import L from 'leaflet'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Navigation } from 'lucide-react'

// ================= MAP IMPORTS =================
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false })
const Polyline = dynamic(() => import('react-leaflet').then(m => m.Polyline), { ssr: false })

// ================= LEAFLET FIX =================
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

export default function TrackingSection() {
  const pickup: [number, number] = [-1.286389, 36.817223]   // CBD
  const dropoff: [number, number] = [-1.303205, 36.707308] // Westlands

  const [route, setRoute] = useState<[number, number][]>([])
  const [busPosition, setBusPosition] = useState<[number, number] | null>(null)

  useEffect(() => {
    async function fetchRoute() {
      const url = `https://router.project-osrm.org/route/v1/driving/${pickup[1]},${pickup[0]};${dropoff[1]},${dropoff[0]}?overview=full&geometries=geojson`
      const res = await fetch(url)
      const data = await res.json()

      const coords = data.routes[0].geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng]
      )

      setRoute(coords)
      setBusPosition(coords[0])
    }

    fetchRoute()
  }, [])

  // ================= MOVE BUS =================
  useEffect(() => {
    if (!route.length) return

    let i = 0
    const interval = setInterval(() => {
      i++
      if (i < route.length) {
        setBusPosition(route[i])
      } else {
        clearInterval(interval)
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [route])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* MAP */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Navigation className="w-5 h-5 text-blue-500" />
              Live Trip Tracking
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <div className="h-[450px] w-full">
              <MapContainer
                center={pickup}
                zoom={13}
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Route */}
                {route.length > 0 && (
                  <Polyline positions={route} pathOptions={{ color: 'blue' }} />
                )}

                {/* Pickup */}
                <Marker position={pickup}>
                  <Popup>Pickup Location</Popup>
                </Marker>

                {/* Dropoff */}
                <Marker position={dropoff}>
                  <Popup>Drop-off Location</Popup>
                </Marker>

                {/* Bus */}
                {busPosition && (
                  <Marker position={busPosition}>
                    <Popup>Bus is moving</Popup>
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
          <CardHeader className="flex flex-row justify-between">
            <CardTitle className="text-base">Bus Status</CardTitle>
            <Badge className="bg-emerald-600">In Transit</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Route:</strong> Home → School</p>
            <p><strong>Driver:</strong> John Kamau</p>
            <p><strong>ETA:</strong> Calculating...</p>
          </CardContent>
        </Card>

        <Button variant="outline">Call Driver</Button>
        <Button variant="outline">Send Message</Button>
      </div>
    </div>
  )
}
