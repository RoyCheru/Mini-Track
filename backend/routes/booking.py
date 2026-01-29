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


def serialize_booking(booking, include_trips=False):
    """
    Serialize booking object to dictionary
    """
    result = {
        "booking_id": booking.id,
        "user_id": booking.user_id,
        "user_name": booking.user.name,
        "vehicle_id": booking.vehicle_id,
        "vehicle_plate": booking.vehicle.license_plate,
        "pickup_location": booking.pickup_location,
        "dropoff_location": booking.dropoff_location,
        "booking_date": booking.booking_date.isoformat(),
        "start_date": booking.start_date.isoformat(),
        "end_date": booking.end_date.isoformat(),
        "status": booking.status,
        "seats_booked": booking.seats_booked,
        "service_type": booking.service_type,
        "days_of_week": booking.days_of_week,
    }
    
    if include_trips:
        result["trips"] = [serialize_trip(trip) for trip in booking.trips]
        result["total_trips"] = len(booking.trips)
        result["completed_trips"] = len([t for t in booking.trips if t.status == 'completed'])
        result["upcoming_trips"] = len([t for t in booking.trips if t.status == 'scheduled'])
    
    return result


def serialize_trip(trip):
    """
    Serialize trip object to dictionary
    """
    return {
        "trip_id": trip.id,
        "booking_id": trip.booking_id,
        "trip_date": trip.trip_date.isoformat(),
        "service_time": trip.service_time,
        "status": trip.status,
        "pickup_time": trip.pickup_time.isoformat() if trip.pickup_time else None,
        "actual_pickup_time": trip.actual_pickup_time.isoformat() if trip.actual_pickup_time else None,
        "actual_dropoff_time": trip.actual_dropoff_time.isoformat() if trip.actual_dropoff_time else None,
        "driver_notes": trip.driver_notes,
    }


# 2. RESOURCE CLASSES

class BookingList(Resource):
    """
    Handle booking list operations
    GET: List all bookings (filtered by user role)
    POST: Create new booking
    """
    
    def get(self):
        """
        Get all bookings
        Query params:
            - user_id: Filter by user (optional, for parents to see their own)
            - vehicle_id: Filter by vehicle (optional, for drivers)
            - status: Filter by status (optional)
        """
        # Get query parameters
        user_id = request.args.get('user_id', type=int)
        vehicle_id = request.args.get('vehicle_id', type=int)
        status = request.args.get('status')
        
        # Build query
        query = Booking.query
        
        if user_id:
            query = query.filter_by(user_id=user_id)
        
        if vehicle_id:
            query = query.filter_by(vehicle_id=vehicle_id)
        
        if status:
            query = query.filter_by(status=status)
        
        bookings = query.all()
        
        response = []
        for booking in bookings:
            response.append(serialize_booking(booking, include_trips=False))
        
        return response, 200
    
    def post(self):
        """
        Create new booking and generate trips
        
        Expected JSON body:
        {
            "user_id": 1,
            "vehicle_id": 5,
            "pickup_location": "Westlands Mall",
            "dropoff_location": "Brookhouse School",
            "start_date": "2026-02-01",
            "end_date": "2026-02-28",
            "days_of_week": "1,3,5",
            "service_type": "morning",
            "seats_booked": 1
        }
        """
        data = request.get_json()
        
        # Validate required fields
        required_fields = [
            'user_id', 'vehicle_id', 'pickup_location', 'dropoff_location',
            'start_date', 'end_date', 'days_of_week', 'service_type', 'seats_booked'
        ]
        
        for field in required_fields:
            if field not in data:
                return {"error": f"{field} is required"}, 400
        
        # Validate user exists
        user = User.query.get(data['user_id'])
        if not user:
            return {"error": "User not found"}, 404
        
        # Validate vehicle exists
        vehicle = Vehicle.query.get(data['vehicle_id'])
        if not vehicle:
            return {"error": "Vehicle not found"}, 404
        
        # Parse and validate dates
        try:
            start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
            end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
        except ValueError:
            return {"error": "Invalid date format. Use YYYY-MM-DD"}, 400
        
        # Validate date range
        is_valid, error_msg = validate_date_range(start_date, end_date)
        if not is_valid:
            return {"error": error_msg}, 400
        
        # Validate days_of_week
        is_valid, error_msg = validate_days_of_week(data['days_of_week'])
        if not is_valid:
            return {"error": error_msg}, 400
        
        # Validate service_type
        is_valid, error_msg = validate_service_type(data['service_type'])
        if not is_valid:
            return {"error": error_msg}, 400
        
        # Validate seats_booked
        seats_booked = data['seats_booked']
        if not isinstance(seats_booked, int) or seats_booked < 1:
            return {"error": "seats_booked must be a positive integer"}, 400
        
        # Check vehicle capacity
        is_valid, available_seats, error_msg = validate_booking_capacity(
            data['vehicle_id'],
            start_date,
            end_date,
            seats_booked
        )
        if not is_valid:
            return {"error": error_msg}, 409  # 409 Conflict
        
        # Create booking
        booking = Booking(
            user_id=data['user_id'],
            vehicle_id=data['vehicle_id'],
            pickup_location=data['pickup_location'],
            dropoff_location=data['dropoff_location'],
            booking_date=datetime.utcnow(),
            start_date=start_date,
            end_date=end_date,
            status='active',
            seats_booked=seats_booked,
            service_type=data['service_type'],
            days_of_week=data['days_of_week']
        )
        
        db.session.add(booking)
        db.session.commit()
        
        # Generate trips
        try:
            trips_created = generate_trips_for_booking(booking)
        except Exception as e:
            # Rollback booking if trip generation fails
            db.session.delete(booking)
            db.session.commit()
            return {"error": f"Failed to generate trips: {str(e)}"}, 500
        
        # Return success response
        response = serialize_booking(booking, include_trips=False)
        response["trips_created"] = trips_created
        response["message"] = "Booking created successfully"
        
        return response, 201
    
class BookingDetail(Resource):
    """
    Handle single booking operations
    GET: Get booking details with trips
    PATCH: Update booking (cancel only for MVP)
    """
    
    def get(self, booking_id):
        """
        Get single booking with all its trips
        """
        booking = Booking.query.get(booking_id)
        
        if not booking:
            return {"error": "Booking not found"}, 404
        
        response = serialize_booking(booking, include_trips=True)
        return response, 200