'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertCircle, Users, MapPin, Bus, Zap, TrendingUp, Plus, Edit2, Trash2, Eye, Settings } from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'John Smith', phone: '+1-234-567-8900', email: 'john@minitrack.com', routes: 2, status: 'active' },
    { id: 2, name: 'Sarah Johnson', phone: '+1-234-567-8901', email: 'sarah@minitrack.com', routes: 1, status: 'active' },
    { id: 3, name: 'Michael Brown', phone: '+1-234-567-8902', email: 'michael@minitrack.com', routes: 3, status: 'active' },
  ])
  const [editingDriver, setEditingDriver] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', routes: 0, status: 'active' })

  // Routes state
  const [routes, setRoutes] = useState([
    { id: 1, name: 'Route A - Downtown', driver: 'John Smith', stops: 8, distance: '12.5 km', status: 'active', passengers: 18 },
    { id: 2, name: 'Route B - Westside', driver: 'Sarah Johnson', stops: 6, distance: '9.2 km', status: 'active', passengers: 12 },
    { id: 3, name: 'Route C - Eastside', driver: 'Michael Brown', stops: 10, distance: '15.8 km', status: 'active', passengers: 22 },
  ])
  const [editingRoute, setEditingRoute] = useState(null)
  const [showEditRouteModal, setShowEditRouteModal] = useState(false)
  const [showAddRouteModal, setShowAddRouteModal] = useState(false)
  const [showDeleteRouteConfirm, setShowDeleteRouteConfirm] = useState(null)
  const [routeFormData, setRouteFormData] = useState({ name: '', driver: '', stops: 0, distance: '', status: 'active', passengers: 0 })

  // Buses state
  const [buses, setBuses] = useState([
    { id: 1, plate: 'BUS-001', model: '2023 Mercedes Sprinter', capacity: 25, occupancy: 18, status: 'in-service', fuel: 85 },
    { id: 2, plate: 'BUS-002', model: '2022 Volvo B7R', capacity: 30, occupancy: 25, status: 'in-service', fuel: 60 },
    { id: 3, plate: 'BUS-003', model: '2024 Scania K230', capacity: 28, occupancy: 12, status: 'maintenance', fuel: 40 },
  ])
  const [editingBus, setEditingBus] = useState(null)
  const [showEditBusModal, setShowEditBusModal] = useState(false)
  const [showAddBusModal, setShowAddBusModal] = useState(false)
  const [showDeleteBusConfirm, setShowDeleteBusConfirm] = useState(null)
  const [busFormData, setBusFormData] = useState({ plate: '', model: '', capacity: 0, occupancy: 0, status: 'in-service', fuel: 50 })

  // Bookings state
  const [bookingsData, setBookingsData] = useState([
    { id: 1, child: 'Emma Wilson', route: 'Route A', date: '2024-02-15', status: 'confirmed', amount: '$5.00' },
    { id: 2, child: 'Liam Davis', route: 'Route B', date: '2024-02-15', status: 'confirmed', amount: '$5.00' },
    { id: 3, child: 'Olivia Martinez', route: 'Route C', date: '2024-02-15', status: 'pending', amount: '$5.00' },
  ])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showBookingDetail, setShowBookingDetail] = useState(false)
  // Important
  const username= localStorage.getItem("username")

  // Handler functions
  const handleEditDriver = (driver) => {
    setEditingDriver(driver)
    setFormData(driver)
    setShowEditModal(true)
  }

  const handleDeleteDriver = (id) => {
    setDrivers(drivers.filter(d => d.id !== id))
    setShowDeleteConfirm(null)
  }

  const handleAddDriver = () => {
    if (formData.name && formData.phone && formData.email) {
      const newDriver = {
        id: Math.max(...drivers.map(d => d.id), 0) + 1,
        ...formData,
        routes: parseInt(formData.routes) || 0
      }
      setDrivers([...drivers, newDriver])
      setFormData({ name: '', phone: '', email: '', routes: 0, status: 'active' })
      setShowAddModal(false)
    }
  }

  const handleSaveDriver = () => {
    if (formData.name && formData.phone && formData.email) {
      setDrivers(drivers.map(d => d.id === editingDriver.id ? { ...d, ...formData, routes: parseInt(formData.routes) || 0 } : d))
      setShowEditModal(false)
      setEditingDriver(null)
    }
  }

  // Route handlers
  const handleEditRoute = (route) => {
    setEditingRoute(route)
    setRouteFormData(route)
    setShowEditRouteModal(true)
  }

  const handleDeleteRoute = (id) => {
    setRoutes(routes.filter(r => r.id !== id))
    setShowDeleteRouteConfirm(null)
  }

  const handleAddRoute = () => {
    if (routeFormData.name && routeFormData.driver) {
      const newRoute = {
        id: Math.max(...routes.map(r => r.id), 0) + 1,
        ...routeFormData,
        stops: parseInt(routeFormData.stops) || 0,
        passengers: parseInt(routeFormData.passengers) || 0
      }
      setRoutes([...routes, newRoute])
      setRouteFormData({ name: '', driver: '', stops: 0, distance: '', status: 'active', passengers: 0 })
      setShowAddRouteModal(false)
    }
  }

  const handleSaveRoute = () => {
    if (routeFormData.name && routeFormData.driver) {
      setRoutes(routes.map(r => r.id === editingRoute.id ? { ...r, ...routeFormData, stops: parseInt(routeFormData.stops) || 0, passengers: parseInt(routeFormData.passengers) || 0 } : r))
      setShowEditRouteModal(false)
      setEditingRoute(null)
    }
  }

  // Bus handlers
  const handleEditBus = (bus) => {
    setEditingBus(bus)
    setBusFormData(bus)
    setShowEditBusModal(true)
  }

  const handleDeleteBus = (id) => {
    setBuses(buses.filter(b => b.id !== id))
    setShowDeleteBusConfirm(null)
  }

  const handleAddBus = () => {
    if (busFormData.plate && busFormData.model) {
      const newBus = {
        id: Math.max(...buses.map(b => b.id), 0) + 1,
        ...busFormData,
        capacity: parseInt(busFormData.capacity) || 0,
        occupancy: parseInt(busFormData.occupancy) || 0,
        fuel: parseInt(busFormData.fuel) || 50
      }
      setBuses([...buses, newBus])
      setBusFormData({ plate: '', model: '', capacity: 0, occupancy: 0, status: 'in-service', fuel: 50 })
      setShowAddBusModal(false)
    }
  }

  const handleSaveBus = () => {
    if (busFormData.plate && busFormData.model) {
      setBuses(buses.map(b => b.id === editingBus.id ? { ...b, ...busFormData, capacity: parseInt(busFormData.capacity) || 0, occupancy: parseInt(busFormData.occupancy) || 0, fuel: parseInt(busFormData.fuel) || 50 } : b))
      setShowEditBusModal(false)
      setEditingBus(null)
    }
  }

  // Bookings handlers
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking)
    setShowBookingDetail(true)
  }

  const handleApproveBooking = (id) => {
    setBookingsData(bookingsData.map(b => b.id === id ? { ...b, status: 'confirmed' } : b))
  }

  const handleRejectBooking = (id) => {
    setBookingsData(bookingsData.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome Admin, {username}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage drivers, routes, buses, and bookings
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-2">
                <AlertCircle className="w-3 h-3" />
                3 buses active
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto bg-card border border-border/50">
            <TabsTrigger value="overview" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="management" className="gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Management</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Bookings</span>
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" /> Active Drivers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground mt-1">All on duty</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Active Routes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground mt-1">All running</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Bus className="w-4 h-4" /> Fleet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground mt-1">2 in-service</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Daily Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$175</div>
                  <p className="text-xs text-muted-foreground mt-1">Today's total</p>
                </CardContent>
              </Card>
            </div>

            {/* System Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Fleet Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm font-medium">In Service</span>
                    <Badge className="bg-green-500">2/3</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm font-medium">Maintenance</span>
                    <Badge className="bg-yellow-500">1/3</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm font-medium">Total Capacity</span>
                    <span className="text-sm font-semibold">83 seats</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Route Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm font-medium">Total Stops</span>
                    <span className="text-sm font-semibold">24</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm font-medium">Avg Passengers</span>
                    <span className="text-sm font-semibold">52/route</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm font-medium">Total Distance</span>
                    <span className="text-sm font-semibold">37.5 km</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Bookings</CardTitle>
                <CardDescription>Latest bookings from this morning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Child</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookingsData.map((booking) => (
                        <TableRow key={booking.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{booking.child}</TableCell>
                          <TableCell>{booking.route}</TableCell>
                          <TableCell>{booking.date}</TableCell>
                          <TableCell>
                            <Badge variant={booking.status === 'confirmed' ? 'default' : 'outline'}>
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold">{booking.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MANAGEMENT TAB */}
          <TabsContent value="management" className="space-y-6">
            {/* Drivers Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Driver Management</CardTitle>
                  <CardDescription>Manage your transport drivers</CardDescription>
                </div>
                <Button size="sm" className="gap-2" onClick={() => setShowAddModal(true)}>
                  <Plus className="w-4 h-4" />
                  Add Driver
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Routes</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {drivers.map((driver) => (
                        <TableRow key={driver.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{driver.name}</TableCell>
                          <TableCell className="text-sm">{driver.phone}</TableCell>
                          <TableCell className="text-sm">{driver.email}</TableCell>
                          <TableCell>{driver.routes}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500">{driver.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => handleEditDriver(driver)}>
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setShowDeleteConfirm(driver.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Routes Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Route Management</CardTitle>
                  <CardDescription>Configure and monitor routes</CardDescription>
                </div>
                <Button size="sm" className="gap-2" onClick={() => setShowAddRouteModal(true)}>
                  <Plus className="w-4 h-4" />
                  Add Route
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Route Name</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Stops</TableHead>
                        <TableHead>Distance</TableHead>
                        <TableHead>Passengers</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {routes.map((route) => (
                        <TableRow key={route.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{route.name}</TableCell>
                          <TableCell>{route.driver}</TableCell>
                          <TableCell>{route.stops}</TableCell>
                          <TableCell>{route.distance}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{route.passengers}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-500">{route.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => handleEditRoute(route)}>
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setShowDeleteRouteConfirm(route.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Bus Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Bus Fleet</CardTitle>
                  <CardDescription>Monitor vehicle status and fuel</CardDescription>
                </div>
                <Button size="sm" className="gap-2" onClick={() => setShowAddBusModal(true)}>
                  <Plus className="w-4 h-4" />
                  Add Bus
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>License Plate</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Occupancy</TableHead>
                        <TableHead>Fuel</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {buses.map((bus) => (
                        <TableRow key={bus.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{bus.plate}</TableCell>
                          <TableCell className="text-sm">{bus.model}</TableCell>
                          <TableCell>{bus.capacity}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {bus.occupancy}/{bus.capacity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${bus.fuel > 70 ? 'bg-green-500' : bus.fuel > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${bus.fuel}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold">{bus.fuel}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={bus.status === 'in-service' ? 'bg-green-500' : 'bg-yellow-500'}>
                              {bus.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => handleEditBus(bus)}>
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setShowDeleteBusConfirm(bus.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BOOKINGS TAB */}
          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>Complete booking management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 flex-col sm:flex-row">
                  <Input placeholder="Search bookings..." className="flex-1" />
                  <Button variant="outline">Filter</Button>
                </div>

                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Child</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...bookingsData, ...bookingsData].map((booking, idx) => (
                        <TableRow key={idx} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{booking.child}</TableCell>
                          <TableCell>{booking.route}</TableCell>
                          <TableCell>{booking.date}</TableCell>
                          <TableCell>
                            <Badge variant={booking.status === 'confirmed' ? 'default' : 'outline'}>
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold">{booking.amount}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" onClick={() => handleViewBooking(booking)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ADD DRIVER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Driver</CardTitle>
              <CardDescription>Enter driver information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input 
                  placeholder="+1-234-567-8900"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input 
                  placeholder="john@minitrack.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <Label>Routes Assigned</Label>
                <Input 
                  placeholder="0"
                  type="number"
                  value={formData.routes}
                  onChange={(e) => setFormData({...formData, routes: e.target.value})}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</Button>
                <Button onClick={handleAddDriver} className="flex-1">Add Driver</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* EDIT DRIVER MODAL */}
      {showEditModal && editingDriver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Driver</CardTitle>
              <CardDescription>Update driver information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <Label>Routes Assigned</Label>
                <Input 
                  type="number"
                  value={formData.routes}
                  onChange={(e) => setFormData({...formData, routes: e.target.value})}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">Cancel</Button>
                <Button onClick={handleSaveDriver} className="flex-1">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Delete Driver</CardTitle>
              <CardDescription>Are you sure you want to delete this driver?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowDeleteConfirm(null)} className="flex-1">Cancel</Button>
                <Button variant="destructive" onClick={() => handleDeleteDriver(showDeleteConfirm)} className="flex-1">Delete</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ADD ROUTE MODAL */}
      {showAddRouteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Route</CardTitle>
              <CardDescription>Enter route information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Route Name</Label>
                <Input 
                  placeholder="Route A"
                  value={routeFormData.name}
                  onChange={(e) => setRouteFormData({...routeFormData, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Driver</Label>
                <Input 
                  placeholder="John Smith"
                  value={routeFormData.driver}
                  onChange={(e) => setRouteFormData({...routeFormData, driver: e.target.value})}
                />
              </div>
              <div>
                <Label>Stops</Label>
                <Input 
                  placeholder="0"
                  type="number"
                  value={routeFormData.stops}
                  onChange={(e) => setRouteFormData({...routeFormData, stops: e.target.value})}
                />
              </div>
              <div>
                <Label>Distance</Label>
                <Input 
                  placeholder="0 km"
                  value={routeFormData.distance}
                  onChange={(e) => setRouteFormData({...routeFormData, distance: e.target.value})}
                />
              </div>
              <div>
                <Label>Passengers</Label>
                <Input 
                  placeholder="0"
                  type="number"
                  value={routeFormData.passengers}
                  onChange={(e) => setRouteFormData({...routeFormData, passengers: e.target.value})}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddRouteModal(false)} className="flex-1">Cancel</Button>
                <Button onClick={handleAddRoute} className="flex-1">Add Route</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* EDIT ROUTE MODAL */}
      {showEditRouteModal && editingRoute && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Route</CardTitle>
              <CardDescription>Update route information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Route Name</Label>
                <Input 
                  value={routeFormData.name}
                  onChange={(e) => setRouteFormData({...routeFormData, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Driver</Label>
                <Input 
                  value={routeFormData.driver}
                  onChange={(e) => setRouteFormData({...routeFormData, driver: e.target.value})}
                />
              </div>
              <div>
                <Label>Stops</Label>
                <Input 
                  type="number"
                  value={routeFormData.stops}
                  onChange={(e) => setRouteFormData({...routeFormData, stops: e.target.value})}
                />
              </div>
              <div>
                <Label>Distance</Label>
                <Input 
                  value={routeFormData.distance}
                  onChange={(e) => setRouteFormData({...routeFormData, distance: e.target.value})}
                />
              </div>
              <div>
                <Label>Passengers</Label>
                <Input 
                  type="number"
                  value={routeFormData.passengers}
                  onChange={(e) => setRouteFormData({...routeFormData, passengers: e.target.value})}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowEditRouteModal(false)} className="flex-1">Cancel</Button>
                <Button onClick={handleSaveRoute} className="flex-1">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* DELETE ROUTE CONFIRMATION MODAL */}
      {showDeleteRouteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Delete Route</CardTitle>
              <CardDescription>Are you sure you want to delete this route?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowDeleteRouteConfirm(null)} className="flex-1">Cancel</Button>
                <Button variant="destructive" onClick={() => handleDeleteRoute(showDeleteRouteConfirm)} className="flex-1">Delete</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ADD BUS MODAL */}
      {showAddBusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Bus</CardTitle>
              <CardDescription>Enter bus information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>License Plate</Label>
                <Input 
                  placeholder="BUS-001"
                  value={busFormData.plate}
                  onChange={(e) => setBusFormData({...busFormData, plate: e.target.value})}
                />
              </div>
              <div>
                <Label>Model</Label>
                <Input 
                  placeholder="2023 Mercedes Sprinter"
                  value={busFormData.model}
                  onChange={(e) => setBusFormData({...busFormData, model: e.target.value})}
                />
              </div>
              <div>
                <Label>Capacity</Label>
                <Input 
                  placeholder="0"
                  type="number"
                  value={busFormData.capacity}
                  onChange={(e) => setBusFormData({...busFormData, capacity: e.target.value})}
                />
              </div>
              <div>
                <Label>Occupancy</Label>
                <Input 
                  placeholder="0"
                  type="number"
                  value={busFormData.occupancy}
                  onChange={(e) => setBusFormData({...busFormData, occupancy: e.target.value})}
                />
              </div>
              <div>
                <Label>Fuel</Label>
                <Input 
                  placeholder="0%"
                  type="number"
                  value={busFormData.fuel}
                  onChange={(e) => setBusFormData({...busFormData, fuel: e.target.value})}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddBusModal(false)} className="flex-1">Cancel</Button>
                <Button onClick={handleAddBus} className="flex-1">Add Bus</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* EDIT BUS MODAL */}
      {showEditBusModal && editingBus && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Bus</CardTitle>
              <CardDescription>Update bus information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>License Plate</Label>
                <Input 
                  value={busFormData.plate}
                  onChange={(e) => setBusFormData({...busFormData, plate: e.target.value})}
                />
              </div>
              <div>
                <Label>Model</Label>
                <Input 
                  value={busFormData.model}
                  onChange={(e) => setBusFormData({...busFormData, model: e.target.value})}
                />
              </div>
              <div>
                <Label>Capacity</Label>
                <Input 
                  type="number"
                  value={busFormData.capacity}
                  onChange={(e) => setBusFormData({...busFormData, capacity: e.target.value})}
                />
              </div>
              <div>
                <Label>Occupancy</Label>
                <Input 
                  type="number"
                  value={busFormData.occupancy}
                  onChange={(e) => setBusFormData({...busFormData, occupancy: e.target.value})}
                />
              </div>
              <div>
                <Label>Fuel</Label>
                <Input 
                  type="number"
                  value={busFormData.fuel}
                  onChange={(e) => setBusFormData({...busFormData, fuel: e.target.value})}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowEditBusModal(false)} className="flex-1">Cancel</Button>
                <Button onClick={handleSaveBus} className="flex-1">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* DELETE BUS CONFIRMATION MODAL */}
      {showDeleteBusConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Delete Bus</CardTitle>
              <CardDescription>Are you sure you want to delete this bus?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowDeleteBusConfirm(null)} className="flex-1">Cancel</Button>
                <Button variant="destructive" onClick={() => handleDeleteBus(showDeleteBusConfirm)} className="flex-1">Delete</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* BOOKING DETAIL MODAL */}
      {showBookingDetail && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>View and manage booking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Child Name</Label>
                <p className="font-semibold">{selectedBooking.child}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Route</Label>
                <p className="font-semibold">{selectedBooking.route}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Date</Label>
                <p className="font-semibold">{selectedBooking.date}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Amount</Label>
                <p className="font-semibold">{selectedBooking.amount}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Badge variant={selectedBooking.status === 'confirmed' ? 'default' : selectedBooking.status === 'cancelled' ? 'destructive' : 'outline'}>
                  {selectedBooking.status}
                </Badge>
              </div>
              <div className="flex gap-2 pt-4">
                {selectedBooking.status === 'pending' && (
                  <>
                    <Button variant="outline" onClick={() => handleRejectBooking(selectedBooking.id)} className="flex-1">Reject</Button>
                    <Button onClick={() => {
                      handleApproveBooking(selectedBooking.id)
                      setShowBookingDetail(false)
                    }} className="flex-1">Approve</Button>
                  </>
                )}
                {selectedBooking.status !== 'pending' && (
                  <Button onClick={() => setShowBookingDetail(false)} className="w-full">Close</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
