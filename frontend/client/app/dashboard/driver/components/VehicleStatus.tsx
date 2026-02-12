'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Car } from 'lucide-react'

type VehicleInfo = {
  id: number
  license_plate: string
  model: string
  capacity: number
  current_passengers: number
  fuel_level: number
  status: 'active' | 'maintenance' | 'offline'
  next_service: string
}

export default function VehicleStatus({ vehicle }: { vehicle: VehicleInfo }) {
  const cap = Number.isFinite(vehicle.capacity) ? vehicle.capacity : 0
  const onboard = Number.isFinite(vehicle.current_passengers) ? vehicle.current_passengers : 0
  const loadPct = cap > 0 ? Math.round((onboard / cap) * 100) : 0

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Car className="w-5 h-5" />
          Vehicle Status
          <Badge
            variant="outline"
            className={
              vehicle.status === 'active'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : vehicle.status === 'maintenance'
                ? 'border-amber-200 bg-amber-50 text-amber-700'
                : 'border-slate-200 bg-slate-50 text-slate-700'
            }
          >
            {vehicle.status}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-slate-500">Plate</p>
            <p className="font-semibold text-slate-900">{vehicle.license_plate}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-slate-500">Model</p>
            <p className="font-semibold text-slate-900">{vehicle.model}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-slate-500">Capacity</p>
            <p className="font-semibold text-slate-900">{cap}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-slate-500">On board</p>
            <p className="font-semibold text-slate-900">
              {onboard} <span className="text-slate-500 font-normal">({loadPct}%)</span>
            </p>
          </div>
        </div>

        {(vehicle.fuel_level || vehicle.next_service) && (
          <div className="rounded-lg border p-3">
            <p className="text-xs text-slate-500">Maintenance</p>
            <p className="text-sm text-slate-700">
              {vehicle.fuel_level ? `Fuel: ${vehicle.fuel_level}%` : ''}
              {vehicle.fuel_level && vehicle.next_service ? ' • ' : ''}
              {vehicle.next_service ? `Next service: ${vehicle.next_service}` : ''}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
