'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit2, Trash2, Truck, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

const BUSES = [
  {
    id: 1,
    busId: 'BUS-001',
    registration: 'KDL 001A',
    model: 'Toyota Coaster',
    capacity: 15,
    currentPassengers: 8,
    driver: 'John Kamau',
    route: 'Route A',
    status: 'In Transit',
    maintenanceStatus: 'Good',
    lastService: '2025-01-20',
    fuelLevel: 85,
  },
  {
    id: 2,
    busId: 'BUS-002',
    registration: 'KDL 002A',
    model: 'Toyota Coaster',
    capacity: 15,
    currentPassengers: 12,
    driver: 'Peter Kipchoge',
    route: 'Route B',
    status: 'In Transit',
    maintenanceStatus: 'Good',
    lastService: '2025-01-18',
    fuelLevel: 72,
  },
  {
    id: 3,
    busId: 'BUS-003',
    registration: 'KDL 003A',
    model: 'Hyundai County',
    capacity: 15,
    currentPassengers: 5,
    driver: 'Samuel Kipkemboi',
    route: 'Route C',
    status: 'In Transit',
    maintenanceStatus: 'Needs Service',
    lastService: '2024-12-15',
    fuelLevel: 45,
  },
  {
    id: 4,
    busId: 'BUS-004',
    registration: 'KDL 004A',
    model: 'Toyota Hiace',
    capacity: 10,
    currentPassengers: 0,
    driver: 'Idle',
    route: 'None',
    status: 'Parked',
    maintenanceStatus: 'Good',
    lastService: '2025-01-15',
    fuelLevel: 30,
  },
]

export default function BusManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [buses, setBuses] = useState(BUSES)

  const filteredBuses = buses.filter(
    bus =>
      bus.busId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.registration.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id: number) => {
    setBuses(buses.filter(b => b.id !== id))
  }

  const getOccupancyColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100
    if (percentage >= 80) return 'bg-red-500'
    if (percentage >= 60) return 'bg-yellow-500'
    return 'bg-emerald-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Bus Management</CardTitle>
              <CardDescription>Manage fleet and monitor vehicle status</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Bus
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Bus</DialogTitle>
                  <DialogDescription>
                    Enter bus details to add it to the fleet
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Bus ID</Label>
                    <Input placeholder="BUS-XXX" className="mt-1" />
                  </div>
                  <div>
                    <Label>Registration Number</Label>
                    <Input placeholder="KDL XXX X" className="mt-1" />
                  </div>
                  <div>
                    <Label>Model</Label>
                    <Input placeholder="e.g., Toyota Coaster" className="mt-1" />
                  </div>
                  <div>
                    <Label>Capacity</Label>
                    <Input placeholder="15" type="number" className="mt-1" />
                  </div>
                  <Button className="w-full mt-6">Add Bus</Button>
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
              placeholder="Search by Bus ID or registration..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Buses Table */}
      <Card className="border-border/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border/50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Bus</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Driver & Route</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Occupancy</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Maintenance</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Fuel</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuses.map(bus => (
                  <tr key={bus.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-foreground flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          {bus.busId}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {bus.registration} • {bus.model}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-foreground">{bus.driver}</p>
                        <p className="text-xs text-muted-foreground">{bus.route}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div
                            className={`${getOccupancyColor(
                              bus.currentPassengers,
                              bus.capacity
                            )} h-full rounded-full`}
                            style={{
                              width: `${(bus.currentPassengers / bus.capacity) * 100}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {bus.currentPassengers}/{bus.capacity}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <Badge
                          variant="outline"
                          className={
                            bus.maintenanceStatus === 'Good'
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                              : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
                          }
                        >
                          {bus.maintenanceStatus === 'Good' ? '✓' : '⚠'} {bus.maintenanceStatus}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last: {bus.lastService}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                            bus.fuelLevel > 50
                              ? 'bg-emerald-500/20 text-emerald-600'
                              : bus.fuelLevel > 25
                                ? 'bg-yellow-500/20 text-yellow-600'
                                : 'bg-red-500/20 text-red-600'
                          }`}
                        >
                          {bus.fuelLevel}%
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        className={
                          bus.status === 'In Transit'
                            ? 'bg-blue-600'
                            : 'bg-gray-600'
                        }
                      >
                        {bus.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(bus.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Alert for Maintenance */}
      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-yellow-600">Maintenance Required</p>
              <p className="text-sm text-muted-foreground mt-1">
                BUS-003 requires maintenance. Please schedule a service.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
