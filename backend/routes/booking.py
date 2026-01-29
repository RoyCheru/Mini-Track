"""
Booking Route and Resources
Handles booking creation, listing, and management
Has helper function to filter data to be send to Trip Route
"""

from flask import request
from flask_restful import Resource
from datetime import datetime, date, timedelta
from models import db, Booking, Vehicle, User, Trip