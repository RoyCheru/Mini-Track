'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit2, Trash2, MapPin } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

type Route = {
  id: number
  name: string
  starting_point: string
  ending_point: string
  status: 'Active' | 'Inactive'
}

const SEED_ROUTES: Route[] = [
  {
    id: 1,
    name: 'RouteA',
    starting_point: 'Langatta womens prison',
    ending_point: 'CBD',
    status: 'Active',
  },
]

export default function RouteManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [routes, setRoutes] = useState<Route[]>(SEED_ROUTES)

  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({
    name: '',
    starting_point: '',
    ending_point: '',
  })

  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<Route | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    starting_point: '',
    ending_point: '',
    status: 'Active' as Route['status'],
  })

  const filteredRoutes = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return routes
    return routes.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.starting_point.toLowerCase().includes(q) ||
      r.ending_point.toLowerCase().includes(q)
    )
  }, [routes, searchTerm])

  const handleDelete = (id: number) => setRoutes(prev => prev.filter(r => r.id !== id))

  const handleAdd = () => {
    if (!addForm.name || !addForm.starting_point || !addForm.ending_point) return

    // Backend payload matches JSON exactly
    const payload = { ...addForm }

    const newRoute: Route = {
      id: Math.max(...routes.map(r => r.id), 0) + 1,
      name: payload.name,
      starting_point: payload.starting_point,
      ending_point: payload.ending_point,
      status: 'Active',
    }

    setRoutes(prev => [newRoute, ...prev])
    setAddForm({ name: '', starting_point: '', ending_point: '' })
    setAddOpen(false)
  }

  const openEdit = (route: Route) => {
    setEditing(route)
    setEditForm({
      name: route.name,
      starting_point: route.starting_point,
      ending_point: route.ending_point,
      status: route.status,
    })
    setEditOpen(true)
  }

  const handleSave = () => {
    if (!editing) return
    if (!editForm.name || !editForm.starting_point || !editForm.ending_point) return

    setRoutes(prev =>
      prev.map(r =>
        r.id === editing.id ? { ...r, ...editForm } : r
      )
    )
    setEditOpen(false)
    setEditing(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Route Management</CardTitle>
              {/* <CardDescription>Matches JSON: name, starting_point, ending_point</CardDescription> */}
            </div>

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Route
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Route</DialogTitle>
                  <DialogDescription>Enter route details</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label>Route Name</Label>
                    <Input value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label>Starting Point</Label>
                    <Input value={addForm.starting_point} onChange={e => setAddForm({ ...addForm, starting_point: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label>Ending Point</Label>
                    <Input value={addForm.ending_point} onChange={e => setAddForm({ ...addForm, ending_point: e.target.value })} className="mt-1" />
                  </div>

                  <Button className="w-full mt-6" onClick={handleAdd}>
                    Create Route
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
              placeholder="Search routes..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {filteredRoutes.map(route => (
          <Card key={route.id} className="border-border/50 hover:border-border transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {route.name}
                </CardTitle>

                <Badge className={route.status === 'Active' ? 'bg-emerald-600' : 'bg-gray-500'}>
                  {route.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Starting Point</p>
                <p className="font-semibold text-foreground mt-1">{route.starting_point}</p>
              </div>

              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Ending Point</p>
                <p className="font-semibold text-foreground mt-1">{route.ending_point}</p>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border/50">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent" onClick={() => openEdit(route)}>
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent" onClick={() => handleDelete(route.id)}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredRoutes.length === 0 && (
          <Card className="border-border/50">
            <CardContent className="pt-6 text-center text-muted-foreground">
              No routes found.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Route</DialogTitle>
            <DialogDescription>Update route details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Route Name</Label>
              <Input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Starting Point</Label>
              <Input value={editForm.starting_point} onChange={e => setEditForm({ ...editForm, starting_point: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Ending Point</Label>
              <Input value={editForm.ending_point} onChange={e => setEditForm({ ...editForm, ending_point: e.target.value })} className="mt-1" />
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
