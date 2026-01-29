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
