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