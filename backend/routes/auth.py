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
        
class Signup(Resource):
    def post(self):
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        phone_number = data.get("phone_number")
        residence = data.get("residence")
        password_hash = data.get("password_hash")
        role_id = data.get("role_id")

        if User.query.filter_by(email=email).first():
            return jsonify({"message": "Email already exists"}), 400

        new_user = User(
            name=name,
            email=email,
            phone_number=phone_number,
            residence=residence,
            password_hash=password_hash,
            role_id=role_id
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created successfully", "user_id": new_user.id}), 201