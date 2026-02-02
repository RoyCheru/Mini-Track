'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit2, Trash2, MapPin, Clock, Users } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

const ROUTES = [
  {
    id: 1,
    name: 'Route A - Downtown',
    pickupPoints: 5,
    startTime: '7:00 AM',
    endTime: '8:30 AM',
    distance: '12 km',
    costPerSeat: 200,
    buses: 2,
    activeBookings: 18,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Route B - Westside',
    pickupPoints: 4,
    startTime: '7:15 AM',
    endTime: '8:45 AM',
    distance: '10 km',
    costPerSeat: 180,
    buses: 2,
    activeBookings: 15,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Route C - Eastside',
    pickupPoints: 6,
    startTime: '7:30 AM',
    endTime: '9:00 AM',
    distance: '14 km',
    costPerSeat: 220,
    buses: 2,
    activeBookings: 20,
    status: 'Active',
  },
  {
    id: 4,
    name: 'Route D - Northgate',
    pickupPoints: 3,
    startTime: '8:00 AM',
    endTime: '9:15 AM',
    distance: '8 km',
    costPerSeat: 160,
    buses: 1,
    activeBookings: 8,
    status: 'Inactive',
  },
]

export default function RouteManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [routes, setRoutes] = useState(ROUTES)

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id: number) => {
    setRoutes(routes.filter(r => r.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Route Management</CardTitle>
              <CardDescription>Configure and manage all transport routes</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Route
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Route</DialogTitle>
                  <DialogDescription>
                    Enter route details to add a new transport route
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Route Name</Label>
                    <Input placeholder="e.g., Route A - Downtown" className="mt-1" />
                  </div>
                  <div>
                    <Label>Start Time</Label>
                    <Input type="time" className="mt-1" />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input type="time" className="mt-1" />
                  </div>
                  <div>
                    <Label>Cost Per Seat (KES)</Label>
                    <Input placeholder="200" type="number" className="mt-1" />
                  </div>
                  <Button className="w-full mt-6">Create Route</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Search */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search routes..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredRoutes.map(route => (
          <Card key={route.id} className="border-border/50 hover:border-border transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {route.name}
                  </CardTitle>
                </div>
                <Badge
                  className={
                    route.status === 'Active'
                      ? 'bg-emerald-600'
                      : 'bg-gray-500'
                  }
                >
                  {route.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Route Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Start Time</p>
                  <p className="font-semibold text-foreground mt-1 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {route.startTime}
                  </p>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">End Time</p>
                  <p className="font-semibold text-foreground mt-1">{route.endTime}</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Distance</p>
                  <p className="font-semibold text-foreground mt-1">{route.distance}</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Cost/Seat</p>
                  <p className="font-semibold text-foreground mt-1">KES {route.costPerSeat}</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-t border-border/50 pt-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Pickup Points</span>
                  <span className="font-semibold text-foreground">{route.pickupPoints}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Buses Assigned</span>
                  <span className="font-semibold text-foreground">{route.buses}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Active Bookings
                  </span>
                  <Badge variant="outline">{route.activeBookings}</Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-border/50">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => handleDelete(route.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
