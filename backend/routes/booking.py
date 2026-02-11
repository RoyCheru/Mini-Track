# 


""" 
Booking Routes and Resources
Handles booking creation, listing, and management
"""

from flask import request
from flask_restful import Resource
from datetime import datetime, date, timedelta
from models import db, Booking, Vehicle, User, Trip, Route, PickupLocation, SchoolLocation

# ========================
# HELPER FUNCTIONS
# ========================

def generate_trips_for_booking(booking):
    """
    Generate trip records for a booking based on:
    - start_date to end_date range
    - days_of_week pattern (e.g., '1,3,5' for Mon/Wed/Fri)
    - service_type ('morning', 'evening', 'both')
    
    IMPORTANT LOGIC:
    - Morning trips: Home (pickup_location) → School (dropoff_location)
    - Evening trips: School (dropoff_location) → Home (pickup_location) [SWAPPED]
    
    The swap is handled in serialize_trip() function when displaying trip details.
    
    Returns: number of trips created
    """
    trips = []
    current_date = booking.start_date
    days_of_week = [int(d) for d in booking.days_of_week.split(',')]
    
    while current_date <= booking.end_date:
        # Check if current day matches the pattern (1=Monday, 7=Sunday)
        if current_date.isoweekday() in days_of_week:
            
            # Create morning trip if needed
            # Morning: Home → School (uses booking locations as-is)
            if booking.service_type in ['morning', 'both']:
                trips.append(Trip(
                    booking_id=booking.id,
                    trip_date=current_date,
                    service_time='morning',
                    status='scheduled'
                ))
            
            # Create evening trip if needed
            # Evening: School → Home (locations swapped in serialization)
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
    
    # Find all trips that overlap with this date range for this vehicle's route
    overlapping_trips = Trip.query.join(Booking).filter(
        Booking.route_id == vehicle.route_id,
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
    """
    Validate booking date range
    
    Returns: (is_valid: bool, error_message: str)
    """
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
    """
    Validate days_of_week format
    Expected format: '1,3,5' (comma-separated numbers, 1=Monday, 7=Sunday)
    
    Returns: (is_valid: bool, error_message: str)
    """
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
    """
    Validate service_type value
    
    Returns: (is_valid: bool, error_message: str)
    """
    valid_types = ['morning', 'evening', 'both']
    if service_type not in valid_types:
        return False, f"Service type must be one of: {', '.join(valid_types)}"
    return True, ""


# ✅ NEW: Compute booking completion based on trips (THIS fixes your issue)
def sync_booking_completion_from_trips(booking: Booking) -> bool:
    """
    If booking is active, mark it completed when there are no remaining
    scheduled/picked_up trips (i.e., all trips are completed or cancelled).

    Returns True if it updated booking.status, else False.
    """
    if not booking:
        return False

    # Never override cancelled bookings
    if booking.status != 'active':
        return False

    trips = booking.trips or []
    if len(trips) == 0:
        # If trips aren't generated yet, don't guess.
        return False

    any_incomplete = any(t.status in ['scheduled', 'picked_up'] for t in trips)

    if not any_incomplete:
        booking.status = 'completed'
        return True

    return False


def serialize_booking(booking, include_trips=False):
    """
    Serialize booking object to dictionary
    
    Auto-completes booking if end_date has passed
    ✅ ALSO auto-completes booking if all trips are done (completed/cancelled)
    
    Args:
        booking: Booking object
        include_trips: Whether to include trips list
    
    Returns: dict
    """
    # Auto-complete booking if end date has passed
    # ✅ FIX: also complete if trips are fully done (important for one-day bookings)
    did_update = False

    if booking.status == 'active' and booking.end_date < date.today():
        booking.status = 'completed'
        did_update = True
    else:
        # ✅ NEW: complete based on trip statuses (covers "today" completion)
        did_update = sync_booking_completion_from_trips(booking)

    if did_update:
        db.session.commit()
    
    result = {
        "booking_id": booking.id,
        "user_id": booking.user_id,
        "user_name": booking.user.name,
        "route_id": booking.route_id,
        "route_name": booking.route.name,
        "pickup_location_id": booking.pickup_location_id,
        "pickup_location_name": booking.pickup_location.name,
        "pickup_location_gps": booking.pickup_location.gps_coordinates,
        "dropoff_location_id": booking.dropoff_location_id,
        "dropoff_location_name": booking.dropoff_location.name,
        "dropoff_location_gps": booking.dropoff_location.gps_coordinates,
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
    
    IMPORTANT: Automatically swaps pickup/dropoff for evening trips
    - Morning: Home (pickup) → School (dropoff)
    - Evening: School (pickup) → Home (dropoff)
    
    Returns: dict
    """
    booking = trip.booking
    
    # For evening trips, swap the locations
    # Evening trip goes from School back to Home
    if trip.service_time == 'evening':
        pickup_location = booking.dropoff_location  # School becomes pickup
        dropoff_location = booking.pickup_location  # Home becomes dropoff
    else:  # morning
        pickup_location = booking.pickup_location   # Home is pickup
        dropoff_location = booking.dropoff_location # School is dropoff
    
    return {
        "trip_id": trip.id,
        "booking_id": trip.booking_id,
        "trip_date": trip.trip_date.isoformat(),
        "service_time": trip.service_time,
        "status": trip.status,
        # Pickup location (swapped for evening)
        "pickup_location_id": pickup_location.id,
        "pickup_location_name": pickup_location.name,
        "pickup_location_gps": pickup_location.gps_coordinates,
        # Dropoff location (swapped for evening)
        "dropoff_location_id": dropoff_location.id,
        "dropoff_location_name": dropoff_location.name,
        "dropoff_location_gps": dropoff_location.gps_coordinates,
        # Times
        "pickup_time": trip.pickup_time.isoformat() if trip.pickup_time else None,
        "actual_pickup_time": trip.actual_pickup_time.isoformat() if trip.actual_pickup_time else None,
        "actual_dropoff_time": trip.actual_dropoff_time.isoformat() if trip.actual_dropoff_time else None,
        "driver_notes": trip.driver_notes,
    }


# ========================
# RESOURCE CLASSES
# ========================

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
            - route_id: Filter by route (optional)
            - status: Filter by status (optional)
        """
        # Get query parameters
        user_id = request.args.get('user_id', type=int)
        route_id = request.args.get('route_id', type=int)
        status = request.args.get('status')
        
        # Build query
        query = Booking.query
        
        if user_id:
            query = query.filter_by(user_id=user_id)
        
        if route_id:
            query = query.filter_by(route_id=route_id)
        
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
            "route_id": 5,
            "pickup_location_id": 3,
            "dropoff_location_id": 2,
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
            'user_id', 'route_id', 'pickup_location_id', 'dropoff_location_id',
            'start_date', 'end_date', 'days_of_week', 'service_type', 'seats_booked'
        ]
        
        for field in required_fields:
            if field not in data:
                return {"error": f"{field} is required"}, 400
        
        # Validate user exists
        user = User.query.get(data['user_id'])
        if not user:
            return {"error": "User not found"}, 404
        
        # Validate route exists
        route = Route.query.get(data['route_id'])
        if not route:
            return {"error": "Route not found"}, 404
        
        # Validate pickup location exists and belongs to route
        pickup_location = PickupLocation.query.get(data['pickup_location_id'])
        if not pickup_location:
            return {"error": "Pickup location not found"}, 404
        if pickup_location.route_id != data['route_id']:
            return {"error": "Pickup location does not belong to selected route"}, 400
        
        # Validate dropoff location exists and belongs to route
        dropoff_location = SchoolLocation.query.get(data['dropoff_location_id'])
        if not dropoff_location:
            return {"error": "Dropoff location not found"}, 404
        if dropoff_location.route_id != data['route_id']:
            return {"error": "Dropoff location does not belong to selected route"}, 400
        
        # Auto-assign vehicle from route (get first available vehicle on this route)
        vehicle = Vehicle.query.filter_by(route_id=data['route_id']).first()
        if not vehicle:
            return {"error": "No vehicles available on this route"}, 404
        
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
            vehicle.id,
            start_date,
            end_date,
            seats_booked
        )
        if not is_valid:
            return {"error": error_msg}, 409  # 409 Conflict
        
        # Create booking
        booking = Booking(
            user_id=data['user_id'],
            route_id=data['route_id'],
            pickup_location_id=data['pickup_location_id'],
            dropoff_location_id=data['dropoff_location_id'],
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
    DELETE: Delete completed or cancelled bookings
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
    
    def patch(self, booking_id):
        """
        Update booking status
        
        Allowed transitions:
        - active → cancelled (parent/admin cancels)
        - active → completed (admin completes early)
        
        Expected JSON body:
        {
            "status": "cancelled"  // or "completed"
        }
        """
        booking = Booking.query.get(booking_id)
        
        if not booking:
            return {"error": "Booking not found"}, 404
        
        data = request.get_json()
        
        if not data or 'status' not in data:
            return {"error": "status field is required"}, 400
        
        new_status = data['status']
        
        # Validate status transitions
        if booking.status == 'active':
            if new_status not in ['cancelled', 'completed']:
                return {"error": "Can only set status to 'cancelled' or 'completed'"}, 400
        elif booking.status in ['cancelled', 'completed']:
            return {"error": f"Cannot modify a {booking.status} booking"}, 409
        else:
            return {"error": f"Invalid current status: {booking.status}"}, 400
        
        old_status = booking.status
        booking.status = new_status
        
        # Handle trip updates based on new status
        if new_status == 'cancelled':
            # ✅ FIX: cancel *all* remaining trips from today onward (scheduled OR picked_up)
            Trip.query.filter(
                Trip.booking_id == booking_id,
                Trip.trip_date >= date.today(),
                Trip.status.in_(['scheduled', 'picked_up'])
            ).update({'status': 'cancelled'})
        
        elif new_status == 'completed':
            # ✅ FIX: mark all remaining non-cancelled trips as completed (scheduled OR picked_up)
            Trip.query.filter(
                Trip.booking_id == booking_id,
                Trip.status.in_(['scheduled', 'picked_up'])
            ).update({'status': 'completed'})
        
        db.session.commit()
        
        response = serialize_booking(booking, include_trips=True)
        response["message"] = f"Booking status changed from '{old_status}' to '{new_status}'"
        
        return response, 200
    
    def delete(self, booking_id):
        """
        Delete a booking (only allowed for completed or cancelled bookings)
        This helps clean up the database after bookings are done
        """
        booking = Booking.query.get(booking_id)
        
        if not booking:
            return {"error": "Booking not found"}, 404
        
        # Only allow deletion of completed or cancelled bookings
        if booking.status not in ['completed', 'cancelled']:
            return {
                "error": "Can only delete completed or cancelled bookings",
                "current_status": booking.status
            }, 400
        
        try:
            # Trips will be deleted automatically due to cascade='all, delete-orphan'
            db.session.delete(booking)
            db.session.commit()
            
            return {
                "message": "Booking deleted successfully",
                "booking_id": booking_id
            }, 200
            
        except Exception as e:
            db.session.rollback()
            return {"error": f"Failed to delete booking: {str(e)}"}, 500
