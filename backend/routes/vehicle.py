from flask import request
from flask_restful import Resource
from models import db, Vehicle, Route, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps

def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        identity = get_jwt_identity()

        if identity.get("role_id") != 1:
            return {"error": "Admins only"}, 403

        return fn(*args, **kwargs)
    return wrapper



def serialize_vehicle(vehicle):
    return {
        "id": vehicle.id,
        "route_id": vehicle.route_id,
        "route_name": vehicle.route.name,
        "user_id": vehicle.user_id,
        "driver_name": vehicle.user.name,
        "license_plate": vehicle.license_plate,
        "model": vehicle.model,
        "capacity": vehicle.capacity
    }


class VehicleList(Resource):

    def get(self):  
  
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
    
    @admin_required
    def post(self):
        data = request.get_json()
        required_fields = ['route_id', 'user_id', 'license_plate', 'model', 'capacity']
        
        for field in required_fields:
            if field not in data:
                return {"error": f"{field} is required"}, 400
            
        route = Route.query.get(data['route_id'])
        if not route:
            return {"error": "Route not found"}, 404
        
     
        user = User.query.get(data['user_id'])
        if not user:
            return {"error": "User not found"}, 404
        
        existing_vehicle = Vehicle.query.filter_by(license_plate=data['license_plate']).first()
        if existing_vehicle:
            return {"error": "Vehicle with this license plate already exists"}, 409
        
       
        capacity = data['capacity']
        if not isinstance(capacity, int) or capacity < 1:
            return {"error": "Capacity must be a positive integer"}, 400
        
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

    def get(self, vehicle_id):
 
        vehicle = Vehicle.query.get(vehicle_id)
        
        if not vehicle:
            return {"error": "Vehicle not found"}, 404
        
        response = serialize_vehicle(vehicle)
        return response, 200  
    
    @admin_required
    def patch(self, vehicle_id):
   
        vehicle = Vehicle.query.get(vehicle_id)
        
        if not vehicle:
            return {"error": "Vehicle not found"}, 404
        
        data = request.get_json()
        
        if not data:
            return {"error": "No data provided"}, 400
        
        if 'route_id' in data:
            route = Route.query.get(data['route_id'])
            if not route:
                return {"error": "Route not found"}, 404
            vehicle.route_id = data['route_id']
        
        if 'user_id' in data:
            user = User.query.get(data['user_id'])
            if not user:
                return {"error": "User not found"}, 404
            vehicle.user_id = data['user_id']
        
        if 'license_plate' in data:
            existing = Vehicle.query.filter(
                Vehicle.license_plate == data['license_plate'],
                Vehicle.id != vehicle_id
            ).first()
            if existing:
                return {"error": "Vehicle with this license plate already exists"}, 409
            vehicle.license_plate = data['license_plate']
        
        if 'model' in data:
            vehicle.model = data['model']

        if 'capacity' in data:
            capacity = data['capacity']
            if not isinstance(capacity, int) or capacity < 1:
                return {"error": "Capacity must be a positive integer"}, 400
            vehicle.capacity = capacity
        
        db.session.commit()
        
        response = serialize_vehicle(vehicle)
        response["message"] = "Vehicle updated successfully"
        
        return response, 200
    
    @admin_required
    def delete(self, vehicle_id):
        vehicle = Vehicle.query.get(vehicle_id)
        
        if not vehicle:
            return {"error": "Vehicle not found"}, 404

        from models import Booking
        active_bookings = Booking.query.filter_by(
            route_id=vehicle.route_id,
            status='active'
        ).count()
        
        if active_bookings > 0:
            return {
                "error": f"Cannot delete vehicle. Its route has {active_bookings} active booking(s)",
                "suggestion": "Cancel all active bookings on this route first"
            }, 409
        
        db.session.delete(vehicle)
        db.session.commit()
        
        return {"message": "Vehicle deleted successfully"}, 200