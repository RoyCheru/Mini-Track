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
