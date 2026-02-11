from flask import request
from flask_restful import Resource
from models import db, Route
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

def serialize_route(route):
    return {
        "id": route.id,
        "name": route.name,
        "starting_point": route.starting_point,
        "ending_point": route.ending_point,
        "starting_point_gps": route.starting_point_gps,
        "ending_point_gps": route.ending_point_gps,
        "route_radius_km": route.route_radius_km or 5.0,
    }

class RouteList(Resource):
    @jwt_required()
    def get(self):
  
        routes = Route.query.all()
        
        response = []
        for route in routes:
            response.append(serialize_route(route))
        
        return response, 200
    
    @admin_required
    def post(self):
        data = request.get_json()
        required_fields = ['name', 'starting_point', 'ending_point']
        
        for field in required_fields:
            if field not in data:
                return {"error": f"{field} is required"}, 400

        existing_route = Route.query.filter_by(name=data['name']).first()
        if existing_route:
            return {"error": "Route with this name already exists"}, 409
   
        route = Route(
            name=data['name'],
            starting_point=data['starting_point'],
            ending_point=data['ending_point'],
            starting_point_gps=data.get('starting_point_gps'),
            ending_point_gps=data.get('ending_point_gps'),
            route_radius_km=data.get('route_radius_km', 5.0)
        )
        
        db.session.add(route)
        db.session.commit()
        
        response = serialize_route(route)
        response["message"] = "Route created successfully"
        
        return response, 201
    
class RouteDetail(Resource):

    @jwt_required()
    def get(self, route_id):
        route = Route.query.get(route_id)
        
        if not route:
            return {"error": "Route not found"}, 404
        
        response = serialize_route(route)
        return response, 200
    
    @admin_required
    def patch(self, route_id):
        route = Route.query.get(route_id)
        
        if not route:
            return {"error": "Route not found"}, 404
        
        data = request.get_json()
        
        if not data:
            return {"error": "No data provided"}, 400
    
        if 'name' in data:
            existing = Route.query.filter(
                Route.name == data['name'],
                Route.id != route_id
            ).first()
            if existing:
                return {"error": "Route with this name already exists"}, 409
            route.name = data['name']
        
        if 'starting_point' in data:
            route.starting_point = data['starting_point']
     
        if 'ending_point' in data:
            route.ending_point = data['ending_point']

        if 'starting_point_gps' in data:
            route.starting_point_gps = data['starting_point_gps']
        
        if 'ending_point_gps' in data:
            route.ending_point_gps = data['ending_point_gps']
        
        if 'route_radius_km' in data:
            radius = float(data['route_radius_km'])
            if radius <= 0:
                return {"error": "route_radius_km must be positive"}, 400
            route.route_radius_km = radius           
        
        db.session.commit()
        
        response = serialize_route(route)
        response["message"] = "Route updated successfully"
        
        return response, 200
    @admin_required
    def delete(self, route_id):
        route = Route.query.get(route_id)
        
        if not route:
            return {"error": "Route not found"}, 404
        from models import Vehicle
        vehicles_count = Vehicle.query.filter_by(route_id=route_id).count()
        
        if vehicles_count > 0:
            return {"error": f"Cannot delete route. It has {vehicles_count} vehicle(s) assigned"}, 409
        
        from models import SchoolLocation
        school_locations_count = SchoolLocation.query.filter_by(route_id=route_id).count()
        
        if school_locations_count > 0:
            return {"error": f"Cannot delete route. It has {school_locations_count} school location(s)"}, 409
        
        db.session.delete(route)
        db.session.commit()
        
        return {"message": "Route deleted successfully"}, 200