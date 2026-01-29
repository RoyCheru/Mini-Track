"""
Trip Routes and Resources
Handles driver daily operations and trip status management
"""
from flask import request
from flask_restful import Resource
from datetime import datetime, date
from models import db, Trip, Booking

# 1. HELPER FUNCTION

def serialize_trip(trip):

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
        # Include booking details for driver
        "child_name": trip.booking.user.name,
        "pickup_location": trip.booking.pickup_location,
        "dropoff_location": trip.booking.dropoff_location,
        "seats_booked": trip.booking.seats_booked,
    }

# 2. CLASS RESOURCE

class TripToday(Resource):
    """
    Get today's trips for a specific vehicle and service time
    Critical for driver daily checklist
    """
    
    def get(self):
        """
        Get today's trips
        """
        # Get required parameters
        vehicle_id = request.args.get('vehicle_id', type=int)
        service_time = request.args.get('service_time')
        
        # Validate required params
        if not vehicle_id:
            return {"error": "vehicle_id is required"}, 400
        
        if not service_time:
            return {"error": "service_time is required"}, 400
        
        if service_time not in ['morning', 'evening']:
            return {"error": "service_time must be 'morning' or 'evening'"}, 400
        
        # Query today's trips for this vehicle and service time
        today = date.today()
        
        trips = Trip.query.join(Booking).filter(
            Trip.trip_date == today,
            Trip.service_time == service_time,
            Booking.vehicle_id == vehicle_id,
            Trip.status.in_(['scheduled', 'picked_up'])  # Don't show cancelled/completed
        ).all()
        
        # Serialize trips
        response = {
            "date": today.isoformat(),
            "service_time": service_time,
            "vehicle_id": vehicle_id,
            "trips": [serialize_trip(trip) for trip in trips],
            "total_expected": len(trips),
            "total_picked_up": len([t for t in trips if t.status == 'picked_up']),
            "total_pending": len([t for t in trips if t.status == 'scheduled'])
        }
        
        return response, 200
    

class TripPickup(Resource):
    """
    Mark trip as picked up (shortcut endpoint for drivers)
    """
    
    def patch(self, trip_id):
        """
        Mark child as picked up
        """
        trip = Trip.query.get(trip_id)
        
        if not trip:
            return {"error": "Trip not found"}, 404
        
        if trip.status == 'completed':
            return {"error": "Trip is already completed"}, 409
        
        if trip.status == 'cancelled':
            return {"error": "Cannot pickup a cancelled trip"}, 409
        
        # Mark as picked up
        trip.status = 'picked_up'
        trip.actual_pickup_time = datetime.utcnow()
        
        # Add driver notes if provided
        data = request.get_json()
        if data and 'driver_notes' in data:
            trip.driver_notes = data['driver_notes']
        
        db.session.commit()
        
        response = serialize_trip(trip)
        response["message"] = "Child marked as picked up"
        
        return response, 200