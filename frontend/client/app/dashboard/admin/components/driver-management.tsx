'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit2, Trash2, Phone, Mail } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

const DRIVERS = [
  {
    id: 1,
    name: 'John Kamau',
    license: 'DL-001234',
    phone: '+254 712 345 678',
    email: 'john@minitrack.com',
    bus: 'BUS-001',
    status: 'Active',
    rating: 4.8,
    trips: 156,
  },
  {
    id: 2,
    name: 'Peter Kipchoge',
    license: 'DL-001235',
    phone: '+254 723 456 789',
    email: 'peter@minitrack.com',
    bus: 'BUS-002',
    status: 'Active',
    rating: 4.9,
    trips: 189,
  },
  {
    id: 3,
    name: 'Samuel Kipkemboi',
    license: 'DL-001236',
    phone: '+254 734 567 890',
    email: 'samuel@minitrack.com',
    bus: 'BUS-003',
    status: 'Active',
    rating: 4.7,
    trips: 142,
  },
  {
    id: 4,
    name: 'James Koech',
    license: 'DL-001237',
    phone: '+254 745 678 901',
    email: 'james@minitrack.com',
    bus: 'BUS-004',
    status: 'Inactive',
    rating: 4.5,
    trips: 98,
  },
]

export default function DriverManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [drivers, setDrivers] = useState(DRIVERS)

  const filteredDrivers = drivers.filter(
    driver =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.license.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id: number) => {
    setDrivers(drivers.filter(d => d.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Add Button */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Driver Management</CardTitle>
              <CardDescription>Manage all drivers and their assignments</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Driver
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Driver</DialogTitle>
                  <DialogDescription>
                    Enter driver information to add them to the system
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input placeholder="Enter driver name" className="mt-1" />
                  </div>
                  <div>
                    <Label>License Number</Label>
                    <Input placeholder="DL-XXXXXX" className="mt-1" />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input placeholder="+254 XXX XXX XXX" className="mt-1" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input placeholder="driver@minitrack.com" type="email" className="mt-1" />
                  </div>
                  <Button className="w-full mt-6">Add Driver</Button>
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
              placeholder="Search by name or license..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Drivers Table */}
      <Card className="border-border/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border/50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Driver</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Contact</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Bus</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Rating</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map(driver => (
                  <tr key={driver.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-foreground">{driver.name}</p>
                        <p className="text-xs text-muted-foreground">{driver.license}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <a
                          href={`tel:${driver.phone}`}
                          className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          {driver.phone}
                        </a>
                        <a
                          href={`mailto:${driver.email}`}
                          className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          {driver.email}
                        </a>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="outline">{driver.bus}</Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        className={
                          driver.status === 'Active'
                            ? 'bg-emerald-600'
                            : 'bg-gray-500'
                        }
                      >
                        {driver.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <p className="font-semibold text-foreground">⭐ {driver.rating}</p>
                        <p className="text-xs text-muted-foreground">{driver.trips} trips</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(driver.id)}
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
    </div>
  )
}
