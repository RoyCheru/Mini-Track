from flask import request
from flask_restful import Resource
from models import db, Vehicle, Route, User

# 1. HELPER FUNCTIONS

def serialize_vehicle(vehicle):
    return {
        "id": vehicle.id,
        "route_id": vehicle.route_id,
        "user_id": vehicle.user_id,
        "license_plate": vehicle.license_plate,
        "model": vehicle.model,
        "capacity": vehicle.capacity
    }

class VehicleList(Resource):

    def get(self):  
        # get all vehicles
        route_id = request.args.get('route_id', type=int)
        user_id = request.args.get('user_id', type=int)
        
        query = Vehicle.query
        
        if route_id:
            query = query.filter_by(route_id=route_id)
        
        if user_id:
            query = query.filter_by(user_id=user_id)
        
        vehicles = query.all()
        
        response = []
        for vehicle in vehicles:
            response.append(serialize_vehicle(vehicle))
        
        return response, 200
    
    def post(self):
        # create a vehicle
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['route_id', 'user_id', 'license_plate', 'model', 'capacity']
        
        for field in required_fields:
            if field not in data:
                return {"error": f"{field} is required"}, 400
        
        # Validate route exists
        route = Route.query.get(data['route_id'])
        if not route:
            return {"error": "Route not found"}, 404
        
        # Validate user exists
        user = User.query.get(data['user_id'])
        if not user:
            return {"error": "User not found"}, 404
        
        # Check if license plate already exists
        existing_vehicle = Vehicle.query.filter_by(license_plate=data['license_plate']).first()
        if existing_vehicle:
            return {"error": "Vehicle with this license plate already exists"}, 409
        
        # Validate capacity
        capacity = data['capacity']
        if not isinstance(capacity, int) or capacity < 1:
            return {"error": "Capacity must be a positive integer"}, 400
        
        # Create vehicle
        vehicle = Vehicle(
            route_id=data['route_id'],
            user_id=data['user_id'],
            license_plate=data['license_plate'],
            model=data['model'],
            capacity=capacity
        )
        
        db.session.add(vehicle)
        db.session.commit()
        
        response = serialize_vehicle(vehicle)
        response["message"] = "Vehicle created successfully"
        
        return response, 201

class VehicleDetail(Resource):
    # Handle single vehicle operations

    def get(self, vehicle_id):
        # Get single vehicle by ID

        vehicle = Vehicle.query.get(vehicle_id)
        
        if not vehicle:
            return {"error": "Vehicle not found"}, 404
        
        response = serialize_vehicle(vehicle)
        return response, 200  
    
    def patch(self, vehicle_id):
        # Update vehicle

        vehicle = Vehicle.query.get(vehicle_id)
        
        if not vehicle:
            return {"error": "Vehicle not found"}, 404
        
        data = request.get_json()
        
        if not data:
            return {"error": "No data provided"}, 400
        
        # Update route_id if provided
        if 'route_id' in data:
            route = Route.query.get(data['route_id'])
            if not route:
                return {"error": "Route not found"}, 404
            vehicle.route_id = data['route_id']
        
        # Update user_id if provided
        if 'user_id' in data:
            user = User.query.get(data['user_id'])
            if not user:
                return {"error": "User not found"}, 404
            vehicle.user_id = data['user_id']
        
        # Update license_plate if provided
        if 'license_plate' in data:
            # Check if new license plate already exists (but not for this vehicle)
            existing = Vehicle.query.filter(
                Vehicle.license_plate == data['license_plate'],
                Vehicle.id != vehicle_id
            ).first()
            if existing:
                return {"error": "Vehicle with this license plate already exists"}, 409
            vehicle.license_plate = data['license_plate']
        
        # Update model if provided
        if 'model' in data:
            vehicle.model = data['model']
        
        # Update capacity if provided
        if 'capacity' in data:
            capacity = data['capacity']
            if not isinstance(capacity, int) or capacity < 1:
                return {"error": "Capacity must be a positive integer"}, 400
            vehicle.capacity = capacity
        
        db.session.commit()
        
        response = serialize_vehicle(vehicle)
        response["message"] = "Vehicle updated successfully"
        
        return response, 200
    
    def delete(self, vehicle_id):
        # Delete vehicle

        vehicle = Vehicle.query.get(vehicle_id)
        
        if not vehicle:
            return {"error": "Vehicle not found"}, 404
        
        # Check if vehicle has active bookings
        from models import Booking
        active_bookings = Booking.query.filter_by(
            vehicle_id=vehicle_id,
            status='active'
        ).count()
        
        if active_bookings > 0:
            return {"error": f"Cannot delete vehicle. It has {active_bookings} active booking(s)"}, 409
        
        db.session.delete(vehicle)
        db.session.commit()
        
        return {"message": "Vehicle deleted successfully"}, 200