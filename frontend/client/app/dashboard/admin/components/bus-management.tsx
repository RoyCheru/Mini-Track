'use client'

import { useMemo, useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { apiFetch } from '@/lib/api'
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

type Vehicle = {
  id: number
  route_id: string
  user_id: string
  license_plate: string
  model: string
  capacity: number
  status: 'Active' | 'Inactive'
}


export default function VehicleManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [vehicles, setVehicles] = useState<any[]>([]);


  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({
    route_id: '',
    user_id: '',
    license_plate: '',
    model: '',
    capacity: 0,
  })

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

  const fetchVehicles = async () => {
      const token = localStorage.getItem("token");
      console.log (token)
    try {
      const res = await apiFetch("/vehicles");
  
      const data = await res.json();
      setVehicles(data);
    } catch (err) {
      console.error("Failed to fetch vehicles", err);
    }
    };
    useEffect(() => {
    fetchVehicles();
    }, []);

  const filteredVehicles = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return vehicles
    return vehicles.filter(v =>
      v.license_plate.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.route_id.includes(q) ||
      v.user_id.includes(q)
    )
  }, [vehicles, searchTerm])

  const handleDelete = async (id: number) => {
  try {
    const res = await apiFetch(
      `/vehicles/${id}`,
      {
        method: "DELETE"
      }
    )

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || "Delete failed")
      return
    }

    setVehicles(prev => prev.filter(v => v.id !== id))

  } catch (err) {
    console.error(err)
    alert("Server error")
  }
}
  const handleAdd = async() => {
    if (!addForm.route_id || !addForm.user_id || !addForm.license_plate || !addForm.model) return

    // Backend payload matches JSON exactly
    const payload = {
      route_id: addForm.route_id,
      user_id: addForm.user_id,
      license_plate: addForm.license_plate,
      model: addForm.model,
      capacity: Number(addForm.capacity) || 0,
    }

    const token = localStorage.getItem("token");
     const res = await apiFetch("/vehicles", {
      method: "POST",
      body: JSON.stringify(payload)
      });

    if (res.ok) {
      fetchVehicles();
    }

    // setVehicles(prev => [newVehicle, ...prev])
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

  const handleSave = async() => {
    if (!editing) return
    if (!editForm.route_id || !editForm.user_id || !editForm.license_plate || !editForm.model|| !editForm.capacity) return

    const payload = {
    route_id: editForm.route_id,
    user_id: editForm.user_id,
    license_plate: editForm.license_plate,
    model: editForm.model,
    capacity: editForm.capacity,


  }

  
  try {
    const token = localStorage.getItem("token")

    const res = await apiFetch(`/vehicles/${editing.id}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload)
      }
    )

    const data = await res.json()

    if (!res.ok) {
      alert(data.error || "Update failed")
      return
    }

    // Update UI AFTER backend success
    setVehicles(prev =>
      prev.map(v =>
        v.id === editing.id
          ? { ...v, ...editForm, capacity: Number(editForm.capacity) || 0 }
          : v
      )
    )

    setEditOpen(false)
    setEditing(null)

  } catch (err) {
    console.error(err)
    alert("Server error")
  }
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
                    <Input
                      value={addForm.route_id}
                      onChange={e => setAddForm({ ...addForm, route_id: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>User ID (Driver)</Label>
                    <Input
                      value={addForm.user_id}
                      onChange={e => setAddForm({ ...addForm, user_id: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>License Plate</Label>
                    <Input
                      value={addForm.license_plate}
                      onChange={e => setAddForm({ ...addForm, license_plate: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Model</Label>
                    <Input
                      value={addForm.model}
                      onChange={e => setAddForm({ ...addForm, model: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Capacity</Label>
                    <Input
                      type="number"
                      value={addForm.capacity}
                      onChange={e => setAddForm({ ...addForm, capacity: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>

                  <Button className="w-full mt-6" onClick={handleAdd}>
                    Create Vehicle
                  </Button>
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
              placeholder="Search by plate, model, route_id, user_id..."
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
                  <th className="text-left py-4 px-6 font-semibold text-foreground">User ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Capacity</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredVehicles.map(v => (
                  <tr key={v.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-semibold text-foreground flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        {v.license_plate}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{v.model}</p>
                    </td>

                    <td className="py-4 px-6">{v.route_id}</td>
                    <td className="py-4 px-6">{v.user_id}</td>
                    <td className="py-4 px-6">
                      <Badge variant="outline">{v.capacity}</Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Badge className={v.status === 'Active' ? 'bg-emerald-600' : 'bg-gray-500'}>
                        {v.status}
                      </Badge>
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
                ))}

                {filteredVehicles.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 px-6 text-center text-muted-foreground">
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
