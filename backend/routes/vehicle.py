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