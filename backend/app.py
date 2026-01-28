from flask import Flask, jsonify, request
from flask_migrate import Migrate

from models import db, User, Vehicle, Booking, UserRole, Route, Parent, SchoolLocation