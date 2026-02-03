'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Navigation, AlertCircle, Phone, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

// ✅ Dynamically import react-leaflet (NO SSR)
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

// Leaflet config ONLY runs in browser
if (typeof window !== 'undefined') {
  const L = require('leaflet')

  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

export default function TrackingSection() {
  const [position, setPosition] = useState<[number, number]>([
    -1.286389,
    36.817223,
  ])

  // Fake live movement
  useEffect(() => {
    const interval = setInterval(() => {
      setPosition(([lat, lng]) => [lat + 0.00015, lng + 0.00012])
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  const busData = {
    id: 'BUS-001',
    route: 'Route A - Downtown',
    driver: 'John Kamau',
    status: 'In Transit',
    speed: '45 km/h',
    eta: '12 mins',
    passengers: 8,
    capacity: 15,
    children: [
      { name: 'Sarah Kipchoge', status: 'Onboard' },
      { name: 'Michael Kipchoge', status: 'Onboard' },
    ],
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* MAP */}
      <div className="lg:col-span-2">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-500" />
              Live Bus Tracking
            </CardTitle>
            <CardDescription>Real-time bus movement</CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <div className="h-[420px] w-full">
              <MapContainer
                center={position}
                zoom={14}
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />

                <Marker position={position}>
                  <Popup>
                    <strong>{busData.id}</strong>
                    <br />
                    {busData.route}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat label="Bus ID" value={busData.id} />
              <Stat label="Speed" value={busData.speed} />
              <Stat
                label="Passengers"
                value={`${busData.passengers}/${busData.capacity}`}
              />
              <Stat label="ETA" value={busData.eta} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SIDE INFO */}
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-base">Bus Status</CardTitle>
            <Badge className="bg-emerald-600 animate-pulse">
              {busData.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <Info label="Route" value={busData.route} />
            <Separator />
            <Info label="Driver" value={busData.driver} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Children</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {busData.children.map((child, i) => (
              <div
                key={i}
                className="flex justify-between p-3 border rounded-lg"
              >
                <span className="font-medium">{child.name}</span>
                <Badge variant="outline" className="text-emerald-600">
                  {child.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-2">
          <Button variant="outline" className="w-full gap-2">
            <Phone className="w-4 h-4" /> Call Driver
          </Button>
          <Button variant="outline" className="w-full gap-2">
            <MessageSquare className="w-4 h-4" /> Send Message
          </Button>
        </div>

        <Card className="border-yellow-500/30 bg-yellow-50">
          <CardContent className="pt-6 flex gap-3">
            <AlertCircle className="text-yellow-600" />
            <p className="text-sm">
              Ensure your child is seated with a seatbelt.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center border rounded-lg p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold mt-1">{value}</p>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase font-semibold">
        {label}
      </p>
      <p className="font-medium mt-1">{value}</p>
    </div>
  )
}
