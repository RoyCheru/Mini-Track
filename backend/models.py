# users
# vehicles
# bookings
# user_roles
# routes
# parents
# school_locations

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), unique=True, nullable=True)
    residence = db.Column(db.String(200), nullable=True) # this can be null for non-parents
    password_hash = db.Column(db.String(128), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('user_roles.id'), nullable=False)

    role = db.relationship('UserRole', back_populates='users')
    vehicles = db.relationship('Vehicle', back_populates='user')
    bookings = db.relationship('Booking', back_populates='user') # bookings made by the user
    
class UserRole(db.Model):
    __tablename__ = 'user_roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    users = db.relationship('User', back_populates='role')
    
class Vehicle(db.Model):
    __tablename__ = 'vehicles'
    id = db.Column(db.Integer, primary_key=True)
    route_id = db.Column(db.Integer, db.ForeignKey('routes.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    license_plate = db.Column(db.String(20), unique=True, nullable=False)
    model = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)

    bookings = db.relationship('Booking', back_populates='vehicle')
    user = db.relationship('User', back_populates='vehicles')
    route = db.relationship('Route', back_populates='vehicles')
    
class Booking(db.Model):
    __tablename__ = 'bookings'
    id = db.Column(db.Integer, primary_key=True)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    booking_date = db.Column(db.DateTime, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    pickup_location = db.Column(db.String(200), nullable=False)
    dropoff_location = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    seats_booked = db.Column(db.Integer, nullable=False, default=1)
    service_type = db.Column(db.String(50), nullable=False)
    days_of_week = db.Column(db.String(100), nullable=True)  # e.g., "Monday,Wednesday,Friday"

    vehicle = db.relationship('Vehicle', back_populates='bookings')
    user = db.relationship('User', back_populates='bookings')
    
class Route(db.Model):
    __tablename__ = 'routes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    starting_point = db.Column(db.String(200), nullable=False)
    ending_point = db.Column(db.String(200), nullable=False)

    vehicles = db.relationship('Vehicle', back_populates='route')
    school_locations = db.relationship('SchoolLocation', back_populates='route')
    
    
class SchoolLocation(db.Model):
    __tablename__ = 'school_locations'
    id = db.Column(db.Integer, primary_key=True)
    route_id = db.Column(db.Integer, db.ForeignKey('routes.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    gps_coordinates = db.Column(db.String(50), nullable=False)

    route = db.relationship('Route', back_populates='school_locations')
    
class Trip(db.Model):
    __tablename__ = 'trips'
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'), nullable=False)
    service_time = db.Column(db.String, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    trip_date = db.Column(db.Date, nullable=False)
    pickup_time = db.Column(db.Time, nullable=True)
    actual_pickup_time = db.Column(db.DateTime, nullable=True)
    actual_dropoff_time = db.Column(db.DateTime, nullable=True)
    driver_notes = db.Column(db.Text, nullable=True)

    booking = db.relationship('Booking')
    
    


