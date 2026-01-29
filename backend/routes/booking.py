"""
Booking Route and Resources
Handles booking creation, listing, and management
Has helper function to filter data to be send to Trip Route
"""

from flask import request
from flask_restful import Resource
from datetime import datetime, date, timedelta
from models import db, Booking, Vehicle, User, Trip 

# 1. Helper functions

def generate_trips_for_booking(booking):
    """
    Generate trip records for a booking based on:
    - start_date to end_date range
    - days_of_week pattern (e.g., '1,3,5' for Mon/Wed/Fri)
    - service_type ('morning', 'evening', 'both')
    
    Returns: number of trips created
    """
    trips = []
    current_date = booking.start_date
    days_of_week = [int(d) for d in booking.days_of_week.split(',')]
    
    while current_date <= booking.end_date:
        # Check if current day matches the pattern (1=Monday, 7=Sunday)
        if current_date.isoweekday() in days_of_week:
            
            # Create morning trip if needed
            if booking.service_type in ['morning', 'both']:
                trips.append(Trip(
                    booking_id=booking.id,
                    trip_date=current_date,
                    service_time='morning',
                    status='scheduled'
                ))
            
            # Create evening trip if needed
            if booking.service_type in ['evening', 'both']:
                trips.append(Trip(
                    booking_id=booking.id,
                    trip_date=current_date,
                    service_time='evening',
                    status='scheduled'
                ))
        
        current_date += timedelta(days=1)
    
    # Bulk insert for efficiency
    db.session.bulk_save_objects(trips)
    db.session.commit()
    
    return len(trips)

def validate_booking_capacity(vehicle_id, start_date, end_date, seats_requested):
    """
    Check if vehicle has capacity for the requested booking
    
    Returns: (is_valid: bool, available_seats: int, error_message: str)
    """
    vehicle = Vehicle.query.get(vehicle_id)
    if not vehicle:
        return False, 0, "Vehicle not found"
    
    # Find all trips that overlap with this date range
    overlapping_trips = Trip.query.join(Booking).filter(
        Booking.vehicle_id == vehicle_id,
        Trip.trip_date >= start_date,
        Trip.trip_date <= end_date,
        Trip.status.in_(['scheduled', 'picked_up'])  # Active trips only
    ).all()
    
    # Group by date and count seats
    from collections import defaultdict
    seats_by_date = defaultdict(int)
    
    for trip in overlapping_trips:
        seats_by_date[trip.trip_date] += trip.booking.seats_booked
    
    # Check if any date exceeds capacity
    max_seats_used = max(seats_by_date.values()) if seats_by_date else 0
    available = vehicle.capacity - max_seats_used
    
    if seats_requested <= available:
        return True, available, ""
    else:
        return False, available, f"Not enough seats. Only {available} seats available, but {seats_requested} requested"
