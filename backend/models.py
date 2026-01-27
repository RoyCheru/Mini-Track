# users
# vehicles
# bookings
# user_roles
# routes
# parents
# school_locations

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('user_roles.id'), nullable=False)

    role = db.relationship('UserRole', back_populates='users')
    vehicles = db.relationship('Vehicle', back_populates='user')
    
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
    parent_id = db.Column(db.Integer, db.ForeignKey('parents.id'), nullable=False)
    booking_date = db.Column(db.DateTime, nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    pickup_location = db.Column(db.String(200), nullable=False)
    dropoff_location = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(50), nullable=False)

    vehicle = db.relationship('Vehicle', back_populates='bookings')
    parent = db.relationship('Parent', back_populates='bookings')
    

    
    


