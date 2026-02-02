from flask import Flask, request, session
from flask_restful import Resource
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash, generate_password_hash

from models import db, User, UserRole

class Login(Resource):
    def post(self):
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        role_id = data.get("role_id")

        user = User.query.filter_by(email=email).first()

        if user and check_password_hash(user.password_hash, password):
            # session["user_id"] = user.id
            access_token = create_access_token(identity={"id": user.id, "role_id": user.role_id})
            return {
            "message": "Login successful",
            "access_token": access_token,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role_id": user.role_id,
                "role": user.role.name
            }
        }
        else:
            return {"message": "Invalid credentials"}, 401

class Signup(Resource):
    def post(self):
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        phone_number = data.get("phone_number")
        residence = data.get("residence")
        password = data.get("password")

        if not name or not email or not password:
            return {"error": "All fields required"}, 400

        if User.query.filter_by(email=email).first():
            return {"error": "Email already exists"}, 400

        hashed_password = generate_password_hash(password)
        
        new_user = User(
            name=name,
            email=email,
            phone_number=phone_number,
            residence=residence,
            password_hash=hashed_password,
            role_id= 3 # default to parent role
        )
        db.session.add(new_user)
        db.session.commit()

        return{
            "message": "User created successfully",
            "user": {
                "id": new_user.id,
                "name": new_user.name,
                "email": new_user.email,
                "role_id": new_user.role_id
            }
        }, 201
    
class Logout(Resource):
    def post(self):
        # session.pop("user_id", None)
        return {"message": "Logout successful"}, 200