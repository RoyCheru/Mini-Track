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