'use client'

import { useMemo, useState, useEffect} from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { apiFetch } from '@/lib/api'
import { Plus, Search, Trash2, MapPin, Edit2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

type SchoolLocation = {
  id: number
  name: string
  route_id: string
  gps_coordinates: string
}


export default function SchoolLocationManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [locations, setLocations] = useState<any[]>([]);

  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    route_id: '',
    gps_coordinates: '',
  })
   const [editOpen, setEditOpen] = useState(false)
    const [editing, setEditing] = useState<SchoolLocation | null>(null)
    const [editForm, setEditForm] = useState({
    name: '',
    route_id: '',
    gps_coordinates: '',
    })

  const fetchLocations = async () => {
        const token = localStorage.getItem("token");
        console.log (token)
      try {
        const res = await apiFetch("/school-locations/all");
    
        const data = await res.json();
        setLocations(data);
      } catch (err) {
        console.error("Failed to fetch locations", err);
      }
      };
      useEffect(() => {
      fetchLocations();
      }, []);

 const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return locations

    return locations.filter((l: any) =>
      String(l.name ?? '').toLowerCase().includes(q) ||
      String(l.route_id ?? '').toLowerCase().includes(q) ||
      String(l.gps_coordinates ?? '').toLowerCase().includes(q)
    )
  }, [locations, searchTerm])

  const handleAdd = async() => {
    if (!form.name || !form.route_id || !form.gps_coordinates) return

    // Simple constraint: one school location per route_id
    // const exists = locations.some(l => l.route_id === form.route_id)
    // if (exists) return

    const token = localStorage.getItem("token");
    
         const res = await apiFetch("/school-locations", {
          method: "POST",
          body: JSON.stringify(form)
          });
    
        if (res.ok) {
          fetchLocations();   
        }

    // setLocations(prev => [{ ...form }, ...prev])
    setForm({ name: '', route_id: '', gps_coordinates: '' })
    setAddOpen(false)
  }

    const openEdit = (s: SchoolLocation) => {
    setEditing(s)
    setEditForm({
      name: s.name,
      route_id: s.route_id,
      gps_coordinates: s.gps_coordinates
    })
    setEditOpen(true)
  }

  const handleSave = async() => {
    if (!editing) return
    if (!editForm.name || !editForm.route_id || !editForm.gps_coordinates) return

    const payload = {
    name: editForm.name,
    route_id: editForm.route_id,
    gps_coordinates: editForm.gps_coordinates,

  }

  
  try {
    const token = localStorage.getItem("token")

    const res = await apiFetch(`/school-locations/${editing.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    )

    const data = await res.json()

    if (!res.ok) {
      alert(data.error || "Update failed")
      return
    }

    // Update UI AFTER backend success

    setLocations(prev =>
      prev.map(s =>
        s.id === editing.id ? { ...s, ...payload } : s
      )
    )
    setEditOpen(false)
    setEditing(null)
  }
  catch (err) {
    console.error(err)
    alert("Server error")
  }
}

  const handleDelete = async (id: number) => {
    try {
    const res = await apiFetch(
      `/school-locations/${id}`,
      {
        method: "DELETE"
      }
    )

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || "Delete failed")
      return
    }

    setLocations(prev => prev.filter(s => s.id !== id))

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
              <CardTitle>School Locations</CardTitle>
            </div>

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Location
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add School Location</DialogTitle>
                  <DialogDescription>Enter school location details</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="mt-1"
                      placeholder="Moi Educational Centre"
                    />
                  </div>

                  <div>
                    <Label>Route ID</Label>
                    <Input
                      value={form.route_id}
                      onChange={e => setForm({ ...form, route_id: e.target.value })}
                      className="mt-1"
                      placeholder="1"
                    />
                  </div>

                  <div>
                    <Label>GPS Coordinates</Label>
                    <Input
                      value={form.gps_coordinates}
                      onChange={e => setForm({ ...form, gps_coordinates: e.target.value })}
                      className="mt-1"
                      placeholder="234-432N, 376-122E"
                    />
                  </div>

                  <Button className="w-full mt-6" onClick={handleAdd}>
                    Create Location
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    Note: route_id must be unique (one location per route).
                  </p>
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
              placeholder="Search by name, route_id, GPS..."
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
                  <th className="text-left py-4 px-6 font-semibold text-foreground">School</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Route ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">GPS</th>
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map(l => (
                  <tr key={l.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-semibold text-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {l.name}
                      </p>
                    </td>

                    <td className="py-4 px-6">
                      <Badge variant="outline">{l.route_id}</Badge>
                    </td>

                    <td className="py-4 px-6 text-muted-foreground">{l.gps_coordinates}</td>

                    <td className="py-4 px-6">
                      <Button size="sm" variant="outline" onClick={() => openEdit(l)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(l.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>

                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-10 px-6 text-center text-muted-foreground">
                      No school locations found.
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
            <DialogTitle>Edit School Location</DialogTitle>
            <DialogDescription>Update details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>School Name</Label>
              <Input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div>
              <Label>Route ID</Label>
              <Input value={editForm.route_id} onChange={e => setEditForm({ ...editForm, route_id: e.target.value })} />
            </div>
            <div>
              <Label>GPS Coordinates</Label>
              <Input value={editForm.gps_coordinates} onChange={e => setEditForm({ ...editForm, gps_coordinates: e.target.value })} />
            </div>
            <Button className="w-full" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
