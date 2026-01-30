from flask import request
from flask_restful import Resource
from models import db, Route

# 1. HELPER FUNCTIONS 

def serialize_route(route):
    return {
        "id": route.id,
        "name": route.name,
        "starting_point": route.starting_point,
        "ending_point": route.ending_point
    }

class RouteList(Resource):

    def get(self):
        # Get all routes

        routes = Route.query.all()
        
        response = []
        for route in routes:
            response.append(serialize_route(route))
        
        return response, 200
    
    def post(self):
        # Create new route

        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'starting_point', 'ending_point']
        
        for field in required_fields:
            if field not in data:
                return {"error": f"{field} is required"}, 400
        
        # Check if route name already exists
        existing_route = Route.query.filter_by(name=data['name']).first()
        if existing_route:
            return {"error": "Route with this name already exists"}, 409
        
        # Create route
        route = Route(
            name=data['name'],
            starting_point=data['starting_point'],
            ending_point=data['ending_point']
        )
        
        db.session.add(route)
        db.session.commit()
        
        response = serialize_route(route)
        response["message"] = "Route created successfully"
        
        return response, 201
    
class RouteDetail(Resource):
    # Handle single route operations

    def get(self, route_id):
        # Get single route by ID

        route = Route.query.get(route_id)
        
        if not route:
            return {"error": "Route not found"}, 404
        
        response = serialize_route(route)
        return response, 200
    
    def patch(self, route_id):
        # Update route
        
        route = Route.query.get(route_id)
        
        if not route:
            return {"error": "Route not found"}, 404
        
        data = request.get_json()
        
        if not data:
            return {"error": "No data provided"}, 400
        
        # Update name if provided
        if 'name' in data:
            # Check if new name already exists (but not for this route)
            existing = Route.query.filter(
                Route.name == data['name'],
                Route.id != route_id
            ).first()
            if existing:
                return {"error": "Route with this name already exists"}, 409
            route.name = data['name']
        
        # Update starting_point if provided
        if 'starting_point' in data:
            route.starting_point = data['starting_point']
        
        # Update ending_point if provided
        if 'ending_point' in data:
            route.ending_point = data['ending_point']
        
        db.session.commit()
        
        response = serialize_route(route)
        response["message"] = "Route updated successfully"
        
        return response, 200