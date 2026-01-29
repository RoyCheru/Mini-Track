from flask import Flask, request, session
from flask_restful import Resource
from werkzeug.security import check_password_hash, generate_password_hash
from models import db, User, UserRole


class CreateDriver(Resource):
    def post(self):
        data = request.get_json()
        admin_id = session.get("user_id")

        # Check if logged-in user is admin
        admin = User.query.get(admin_id)
        if not admin or admin.role_id != 1:  
            return {"error": "Unauthorized"}, 403

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        phone_number = data.get("phone_number")

        if not name or not email or not password:
            return {"error": "All fields required"}, 400

        if User.query.filter_by(email=email).first():
            return {"error": "Email already exists"}, 400

        hashed_password = generate_password_hash(password)

        new_driver = User(
            name=name,
            email=email,
            password_hash=hashed_password,
            phone_number=phone_number,
            role_id=2
        )

        db.session.add(new_driver)
        db.session.commit()

        return {
            "message": "Driver created successfully",
            "user": {
                "id": new_driver.id,
                "name": new_driver.name,
                "email": new_driver.email,
                "role_id": new_driver.role_id
            }
        }, 201
        
class GetDrivers(Resource):
    def get(self):
        admin = User.query.get(session.get("user_id"))
        if not admin or admin.role_id != 1:
            return {"error": "Unauthorized"}, 403

        users = User.query.all()

        return [
            {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "role_id": u.role_id
            } for u in users
        ]

class GetUser(Resource):
    def get(self, id):
        user = User.query.get(id)
        if not user:
            return {"error": "User not found"}, 404

        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone_number": user.phone_number,
            "role_id": user.role_id
        }
