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
    

def validate_date_range(start_date, end_date):

    if start_date < date.today():
        return False, "Start date cannot be in the past"
    
    if end_date < start_date:
        return False, "End date must be after start date"
    
    # Max booking period (e.g., 6 months / 180 days)
    max_days = 180
    if (end_date - start_date).days > max_days:
        return False, f"Booking period cannot exceed {max_days} days"
    
    return True, ""

def validate_days_of_week(days_string):

    try:
        days = [int(d) for d in days_string.split(',')]
        
        if not all(1 <= d <= 7 for d in days):
            return False, "Days must be between 1 (Monday) and 7 (Sunday)"
        
        if len(days) != len(set(days)):
            return False, "Duplicate days not allowed"
        
        if len(days) == 0:
            return False, "At least one day must be specified"
        
        return True, ""
    except Exception as e:
        return False, "Invalid days format. Use comma-separated numbers (e.g., '1,3,5' for Mon/Wed/Fri)"


def validate_service_type(service_type):

    valid_types = ['morning', 'evening', 'both']
    if service_type not in valid_types:
        return False, f"Service type must be one of: {', '.join(valid_types)}"
    return True, ""
