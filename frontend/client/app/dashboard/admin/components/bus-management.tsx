'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit2, Trash2, Truck } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

/** School Location JSON shape */
type SchoolLocation = {
  name: string
  route_id: string
  gps_coordinates: string
}

/** Seed school locations (your JSON) */
const SEED_SCHOOL_LOCATIONS: SchoolLocation[] = [
  {
    name: 'Moi Educational Centre',
    route_id: '1',
    gps_coordinates: '234-432N, 376-122E',
  },
]

type Vehicle = {
  id: number
  route_id: string
  user_id: string
  license_plate: string
  model: string
  capacity: number
  status: 'Active' | 'Inactive'
}

const SEED_VEHICLES: Vehicle[] = [
  {
    id: 1,
    route_id: '1',
    user_id: '2',
    license_plate: 'KDC 123X',
    model: 'Scania',
    capacity: 42,
    status: 'Active',
  },
]

export default function VehicleManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [vehicles, setVehicles] = useState<Vehicle[]>(SEED_VEHICLES)

  /** ✅ NEW: school locations state */
  const [schoolLocations, setSchoolLocations] = useState<SchoolLocation[]>(SEED_SCHOOL_LOCATIONS)

  /** Vehicle add */
  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({
    route_id: '',
    user_id: '',
    license_plate: '',
    model: '',
    capacity: 0,
  })

  /** Vehicle edit */
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<Vehicle | null>(null)
  const [editForm, setEditForm] = useState({
    route_id: '',
    user_id: '',
    license_plate: '',
    model: '',
    capacity: 0,
    status: 'Active' as Vehicle['status'],
  })

  /** ✅ NEW: add school location dialog state */
  const [schoolOpen, setSchoolOpen] = useState(false)
  const [schoolForm, setSchoolForm] = useState<SchoolLocation>({
    name: '',
    route_id: '',
    gps_coordinates: '',
  })

  /** School lookup by route */
  const getSchoolByRouteId = (route_id: string) => schoolLocations.find(s => s.route_id === route_id)

  const filteredVehicles = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return vehicles

    return vehicles.filter(v => {
      const school = getSchoolByRouteId(v.route_id)

      return (
        v.license_plate.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.route_id.includes(q) ||
        v.user_id.includes(q) ||
        (school?.name.toLowerCase().includes(q) ?? false) ||
        (school?.gps_coordinates.toLowerCase().includes(q) ?? false)
      )
    })
  }, [vehicles, schoolLocations, searchTerm])

  const handleDelete = (id: number) => setVehicles(prev => prev.filter(v => v.id !== id))

  const handleAdd = () => {
    if (!addForm.route_id || !addForm.user_id || !addForm.license_plate || !addForm.model) return

    const payload = {
      route_id: addForm.route_id,
      user_id: addForm.user_id,
      license_plate: addForm.license_plate,
      model: addForm.model,
      capacity: Number(addForm.capacity) || 0,
    }

    const newVehicle: Vehicle = {
      id: Math.max(...vehicles.map(v => v.id), 0) + 1,
      ...payload,
      status: 'Active',
    }

    setVehicles(prev => [newVehicle, ...prev])
    setAddForm({ route_id: '', user_id: '', license_plate: '', model: '', capacity: 0 })
    setAddOpen(false)
  }

  const openEdit = (v: Vehicle) => {
    setEditing(v)
    setEditForm({
      route_id: v.route_id,
      user_id: v.user_id,
      license_plate: v.license_plate,
      model: v.model,
      capacity: v.capacity,
      status: v.status,
    })
    setEditOpen(true)
  }

  const handleSave = () => {
    if (!editing) return
    if (!editForm.route_id || !editForm.user_id || !editForm.license_plate || !editForm.model) return

    setVehicles(prev =>
      prev.map(v =>
        v.id === editing.id ? { ...v, ...editForm, capacity: Number(editForm.capacity) || 0 } : v
      )
    )
    setEditOpen(false)
    setEditing(null)
  }

  /** ✅ NEW: create school location */
  const handleAddSchoolLocation = () => {
    if (!schoolForm.name || !schoolForm.route_id || !schoolForm.gps_coordinates) return

    // prevent duplicates by route_id (simple rule)
    const exists = schoolLocations.some(s => s.route_id === schoolForm.route_id)
    if (exists) return

    setSchoolLocations(prev => [schoolForm, ...prev])
    setSchoolForm({ name: '', route_id: '', gps_coordinates: '' })
    setSchoolOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Vehicle Management</CardTitle>
            </div>

            {/* ✅ NEW: Add School Location + Add Vehicle buttons */}
            <div className="flex gap-2">
              <Dialog open={schoolOpen} onOpenChange={setSchoolOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Plus className="w-4 h-4" />
                    Add School Location
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add School Location</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={schoolForm.name}
                        onChange={e => setSchoolForm({ ...schoolForm, name: e.target.value })}
                        className="mt-1"
                        placeholder="Moi Educational Centre"
                      />
                    </div>

                    <div>
                      <Label>Route ID</Label>
                      <Input
                        value={schoolForm.route_id}
                        onChange={e => setSchoolForm({ ...schoolForm, route_id: e.target.value })}
                        className="mt-1"
                        placeholder="1"
                      />
                    </div>

                    <div>
                      <Label>GPS Coordinates</Label>
                      <Input
                        value={schoolForm.gps_coordinates}
                        onChange={e => setSchoolForm({ ...schoolForm, gps_coordinates: e.target.value })}
                        className="mt-1"
                        placeholder="234-432N, 376-122E"
                      />
                    </div>

                    <Button className="w-full mt-6" onClick={handleAddSchoolLocation}>
                      Create School Location
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Vehicle
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Vehicle</DialogTitle>
                    <DialogDescription>Enter vehicle details</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label>Route ID</Label>
                      <Input value={addForm.route_id} onChange={e => setAddForm({ ...addForm, route_id: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                      <Label>User ID (Driver)</Label>
                      <Input value={addForm.user_id} onChange={e => setAddForm({ ...addForm, user_id: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                      <Label>License Plate</Label>
                      <Input value={addForm.license_plate} onChange={e => setAddForm({ ...addForm, license_plate: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                      <Label>Model</Label>
                      <Input value={addForm.model} onChange={e => setAddForm({ ...addForm, model: e.target.value })} className="mt-1" />
                    </div>
                    <div>
                      <Label>Capacity</Label>
                      <Input type="number" value={addForm.capacity} onChange={e => setAddForm({ ...addForm, capacity: Number(e.target.value) })} className="mt-1" />
                    </div>

                    <Button className="w-full mt-6" onClick={handleAdd}>
                      Create Vehicle
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by plate, model, route_id, user_id, school..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border/50 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border/50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Vehicle</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Route ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">School Location</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">User ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Capacity</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredVehicles.map(v => {
                  const school = getSchoolByRouteId(v.route_id)

                  return (
                    <tr key={v.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-semibold text-foreground flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          {v.license_plate}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{v.model}</p>
                      </td>

                      <td className="py-4 px-6">{v.route_id}</td>

                      <td className="py-4 px-6">
                        <p className="font-medium text-foreground">{school?.name ?? 'Unknown School'}</p>
                        <p className="text-xs text-muted-foreground mt-1">{school?.gps_coordinates ?? 'N/A'}</p>
                      </td>

                      <td className="py-4 px-6">{v.user_id}</td>

                      <td className="py-4 px-6">
                        <Badge variant="outline">{v.capacity}</Badge>
                      </td>

                      <td className="py-4 px-6">
                        <Badge className={v.status === 'Active' ? 'bg-emerald-600' : 'bg-gray-500'}>{v.status}</Badge>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(v)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(v.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}

                {filteredVehicles.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 px-6 text-center text-muted-foreground">
                      No vehicles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
            <DialogDescription>Update vehicle details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Route ID</Label>
              <Input value={editForm.route_id} onChange={e => setEditForm({ ...editForm, route_id: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>User ID (Driver)</Label>
              <Input value={editForm.user_id} onChange={e => setEditForm({ ...editForm, user_id: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>License Plate</Label>
              <Input value={editForm.license_plate} onChange={e => setEditForm({ ...editForm, license_plate: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Model</Label>
              <Input value={editForm.model} onChange={e => setEditForm({ ...editForm, model: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Capacity</Label>
              <Input type="number" value={editForm.capacity} onChange={e => setEditForm({ ...editForm, capacity: Number(e.target.value) })} className="mt-1" />
            </div>
            <div>
              <Label>Status</Label>
              <Input value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value as any })} className="mt-1" />
            </div>

            <Button className="w-full mt-6" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
