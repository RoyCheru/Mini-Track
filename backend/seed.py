from app import create_app
from models import db, User, Parent, Vehicle, Route, Booking, SchoolLocation, UserRole
from datetime import datetime

app = create_app()

with app.app_context():
    print("Seeding database...")
    Booking.query.delete()
    Vehicle.query.delete()
    Parent.query.delete()
    SchoolLocation.query.delete()
    Route.query.delete()
    User.query.delete()
    UserRole.query.delete()
    db.session.commit()
    # user roles
    roles = [
        UserRole(name="super_admin"),
        UserRole(name="driver")
    ]
    db.session.add_all(roles)
    db.session.commit()
    # users
    users = [
        User(
            name="Victor Chirchir",
            email="chirchir@gmail.com",
            password_hash="chirchir123",
            role_id=roles[0].id
        ),
        User(
            name="Faith Toro",
            email="faith.toro@gmail.com",
            password_hash="toro123",
            role_id=roles[1].id
        ),
        User(
            name="Bethwel Kiplagat",
            email="bethu002@gmail.com",
            password_hash="bethwel123",
            role_id=roles[1].id
        )
    ]
    db.session.add_all(users)
    db.session.commit()
    # parents
    parents = [
        Parent(
            name="Magret Shama",
            contact_number="0712345678",
            email="magret003@gmail.com",
            residence="Green Valley"
        ),
        Parent(
            name="John Smith",
            contact_number="0723456789",
            email="john@gmail.com",
            residence="Sunrise Estate"
        )
    ]
    db.session.add_all(parents)
    db.session.commit()
    # routes
    routes = [
        Route(name="Green Valley - Central School", starting_point="Green Valley", ending_point="Central School"),
        Route(name="Sunrise Estate - Bright Future School", starting_point="Sunrise Estate", ending_point="Bright Future School")
    ]
    db.session.add_all(routes)
    db.session.commit()
    # vehicles
    vehicles = [
        Vehicle(route_id=routes[0].id, user_id=users[1].id, license_plate="KCA 123A", model="Toyota Hiace", capacity=14),
        Vehicle(route_id=routes[1].id, user_id=users[2].id, license_plate="KCB 456B", model="Nissan Urvan", capacity=12)
    ]
    db.session.add_all(vehicles)
    db.session.commit()
    # bookings
    bookings = [
        Booking(
            vehicle_id=vehicles[0].id,
            parent_id=parents[0].id,
            booking_date=datetime.now(),
            start_date=datetime.now(),
            end_date=datetime.now(),
            pickup_location=parents[0].residence,
            dropoff_location=routes[0].ending_point,
            status="confirmed"
        ),
        Booking(
            vehicle_id=vehicles[1].id,
            parent_id=parents[1].id,
            booking_date=datetime.now(),
            start_date=datetime.now(),
            end_date=datetime.now(),
            pickup_location=parents[1].residence,
            dropoff_location=routes[1].ending_point,
            status="pending"
        )
    ]
    db.session.add_all(bookings)
    db.session.commit()
    # school locations
    locations = [
        SchoolLocation(
            route_id=routes[0].id,
            name="Central School",
            gps_coordinates="-1.2921,36.8219"
        ),
        SchoolLocation(
            route_id=routes[1].id,
            name="Bright Future School",
            gps_coordinates="-1.3000,36.8200"
        )
    ]
    db.session.add_all(locations)
    db.session.commit()
    print("Database seeded successfully.")