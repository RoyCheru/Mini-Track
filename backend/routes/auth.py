from flask import Flask, request, jsonify, session
from flask_restful import Resource
from werkzeug.security import check_password_hash

from models import db, User, UserRole

class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        role_id = data.get("role_id")

        user = User.query.filter_by(email=email).first()

        if user and check_password_hash(user.password_hash, password):
            session["user_id"] = user.id
            return jsonify({"message": "Login successful", "user_id": user.id}), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401
        
