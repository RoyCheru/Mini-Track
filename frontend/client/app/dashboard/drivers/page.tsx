'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calendar, MapPin, Car, DollarSign, Users, Clock, Navigation, Bell } from 'lucide-react'
import ProfileCard from './components/ProfileCard'
import ScheduleView from './components/ScheduleView'
import BookingRequests from './components/BookingRequests'
import VehicleStatus from './components/VehicleStatus'
import RouteMap from './components/RouteMap'
import Earnings from './components/Earnings'
import { fetchDriverSchedule } from './utils/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface DriverSchedule {
  user_id: number;
  vehicle_id: number;
  pickup_location: string;
  dropoff_location: string;
  start_date: string;
  end_date: string;
  days_of_week: string;
  service_type: 'morning' | 'evening' | 'both';
  seats_booked: number;
  status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

interface VehicleInfo {
  id: number;
  license_plate: string;
  model: string;
  capacity: number;
  current_passengers: number;
  fuel_level: number;
  status: 'active' | 'maintenance' | 'offline';
  next_service: string;
}

interface EarningsData {
  today: number;
  thisWeek: number;
  thisMonth: number;
  totalTrips: number;
  avgRating: number;
}

interface AlertMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

const MOCK_VEHICLE: VehicleInfo = {
  id: 1,
  license_plate: 'KDC 123X',
  model: 'Scania',
  capacity: 42,
  current_passengers: 12,
  fuel_level: 85,
  status: 'active',
  next_service: '2024-03-15'
};

const MOCK_EARNINGS: EarningsData = {
  today: 8500,
  thisWeek: 42500,
  thisMonth: 124560,
  totalTrips: 156,
  avgRating: 4.8
};

export default function DriverDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [schedule, setSchedule] = useState<DriverSchedule[]>([])
  const [vehicle, setVehicle] = useState<VehicleInfo>(MOCK_VEHICLE)
  const [earnings, setEarnings] = useState<EarningsData>(MOCK_EARNINGS)
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState<AlertMessage | null>(null)
  const username = typeof window !== 'undefined' ? localStorage.getItem("username") || 'Driver' : 'Driver'
