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

const MOCK_SCHEDULE: DriverSchedule[] = [
  { id: 1, date: '2024-02-15', start_time: '07:00', end_time: '08:30', route: 'Route A - Downtown', status: 'in-progress', passengers: 12, vehicle: 'KDC 123X' },
  { id: 2, date: '2024-02-15', start_time: '14:00', end_time: '15:30', route: 'Route A - Downtown', status: 'scheduled', passengers: 8, vehicle: 'KDC 123X' },
  { id: 3, date: '2024-02-16', start_time: '07:00', end_time: '08:30', route: 'Route A - Downtown', status: 'scheduled', passengers: 15, vehicle: 'KDC 123X' },
];

const MOCK_BOOKINGS: BookingRequest[] = [
  { id: 1, child_name: 'Emma Wilson', pickup_location: 'Freedom Heights Mall', dropoff_location: 'Nairobi School', date: '2024-02-15', time: '07:30', seats: 2, status: 'pending' },
  { id: 2, child_name: 'Liam Davis', pickup_location: 'Westgate Mall', dropoff_location: 'Nairobi School', date: '2024-02-15', time: '07:45', seats: 1, status: 'pending' },
  { id: 3, child_name: 'Olivia Martinez', pickup_location: 'Embakasi', dropoff_location: 'Nairobi School', date: '2024-02-15', time: '08:00', seats: 3, status: 'approved' },
];

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
  const [schedule, setSchedule] = useState<DriverSchedule[]>(MOCK_SCHEDULE)
  const [bookings, setBookings] = useState<BookingRequest[]>(MOCK_BOOKINGS)
  const [vehicle, setVehicle] = useState<VehicleInfo>(MOCK_VEHICLE)
  const [earnings, setEarnings] = useState<EarningsData>(MOCK_EARNINGS)
  const [loading, setLoading] = useState(false)
  const username = typeof window !== 'undefined' ? localStorage.getItem("username") || 'Driver' : 'Driver'

  // Fetch driver data
  const fetchDriverData = async () => {
    try {
      setLoading(true)
      // In a real app, fetch from API
      // const scheduleRes = await fetch(`${API_URL}/driver/schedule`)
      // const bookingsRes = await fetch(`${API_URL}/driver/bookings`)
      // const vehicleRes = await fetch(`${API_URL}/driver/vehicle`)
      // const earningsRes = await fetch(`${API_URL}/driver/earnings`)
      
      // Use mock data for now
    } catch (error) {
      toast.error("Failed to load driver data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDriverData()
  }, [])

  const handleStartTrip = (scheduleId: number) => {
    setSchedule(schedule.map(s => 
      s.id === scheduleId ? { ...s, status: 'in-progress' } : s
    ))
    toast.success("Trip started successfully")
  }

  const handleCompleteTrip = (scheduleId: number) => {
    setSchedule(schedule.map(s => 
      s.id === scheduleId ? { ...s, status: 'completed' } : s
    ))
    toast.success("Trip completed successfully")
  }

  const handleApproveBooking = (bookingId: number) => {
    setBookings(bookings.map(b => 
      b.id === bookingId ? { ...b, status: 'approved' } : b
    ))
    toast.success("Booking approved")
  }

  const handleRejectBooking = (bookingId: number) => {
    setBookings(bookings.map(b => 
      b.id === bookingId ? { ...b, status: 'rejected' } : b
    ))
    toast.success("Booking rejected")
  }

  const currentTrip = schedule.find(s => s.status === 'in-progress')