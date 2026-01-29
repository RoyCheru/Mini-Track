from flask import request, jsonify
from flask_restful import Resource
from models import db, UserRole



class UserRoleList(Resource):
    # get all user roles
    def get(self):
        roles = UserRole.query.all()

        result = []
        for role in roles:
            result.append({
                "id": role.id,
                "name": role.name
            })

        return result, 200
    # create a new user role
    def post(self):
        data = request.get_json()
        name = data.get("name")

        if not name:
            return {"error": "Role name is required"}, 400

        if UserRole.query.filter_by(name=name).first():
            return {"error": "Role already exists"}, 400

        new_role = UserRole(name=name)
        db.session.add(new_role)
        db.session.commit()

        return {
            "message": "Role created successfully",
            "role": {
                "id": new_role.id,
                "name": new_role.name
            }
        }, 201

# get, update, delete a user role by id
class UserRoleDetail(Resource):
    def get(self, role_id):
        role = UserRole.query.get(role_id)

        if not role:
            return {"error": "Role not found"}, 404

        return {
            "id": role.id,
            "name": role.name
        }, 200

    def put(self, role_id):
        role = UserRole.query.get(role_id)

        if not role:
            return {"error": "Role not found"}, 404

        data = request.get_json()
        name = data.get("name")

        if not name:
            return {"error": "Role name is required"}, 400

        role.name = name
        db.session.commit()

        return {
            "message": "Role updated successfully",
            "role": {
                "id": role.id,
                "name": role.name
            }
        }, 200

    def delete(self, role_id):
        role = UserRole.query.get(role_id)

        if not role:
            return {"error": "Role not found"}, 404

        db.session.delete(role)
        db.session.commit()

        return {"message": "Role deleted successfully"}, 200
