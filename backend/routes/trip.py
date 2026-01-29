"""
Trip Routes and Resources
Handles driver daily operations and trip status management
"""
from flask import request
from flask_restful import Resource
from datetime import datetime, date
from models import db, Trip, Booking