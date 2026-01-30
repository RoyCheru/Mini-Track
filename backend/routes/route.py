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