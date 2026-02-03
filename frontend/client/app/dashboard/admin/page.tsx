'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, Settings, Zap } from 'lucide-react'

// Import the sections (your project likely already uses this pattern)
import OverviewSection from './components/overview'
import AnalyticsSection from './components/analytics'
import BookingsManagement from './components/bookings-management'

// Optional: If you have these pages too, keep them in management area
import DriverManagement from './components/driver-management'
import RouteManagement from './components/route-management'
import VehicleManagement from './components/bus-management'

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const username =
    typeof window !== 'undefined' ? localStorage.getItem('username') : null

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome Admin{username ? `, ${username}` : ''}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage drivers, routes, vehicles, and bookings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
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

          <TabsContent value="overview" className="space-y-6">
            <OverviewSection />
            <AnalyticsSection />
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <DriverManagement />
            <RouteManagement />
            <VehicleManagement />
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <BookingsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
