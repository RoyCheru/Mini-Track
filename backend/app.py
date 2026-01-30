from flask import Flask
from flask_restful import Api 
from flask_cors import CORS
from models import db 
from flask_migrate import Migrate
from routes.auth import Login, Signup, Logout
from routes.user import CreateDriver, GetDrivers, GetUsers, UpdateUser, DeleteUser
from routes.user_role import UserRoleList, UserRoleDetail

from routes.booking import BookingList, BookingDetail
from routes.trip import TripToday, TripPickup, TripDropoff

def create_app():

    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    app.secret_key = "super-secret-key"

    db.init_app(app)
    migrate = Migrate(app, db)
    CORS(
        app,
        supports_credentials=True,
        origins=["http://localhost:3000"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type"]
    )
    api = Api(app)

    api.add_resource(Login, '/login')
    api.add_resource(Signup, '/signup')
    api.add_resource(Logout, '/logout')
    
    api.add_resource(CreateDriver, '/drivers')
    api.add_resource(GetDrivers, '/drivers')
    api.add_resource(GetUsers, '/users')
    api.add_resource(UpdateUser, '/users/<int:user_id>')
    api.add_resource(DeleteUser, '/users/<int:user_id>')
    
    api.add_resource(UserRoleList, '/user_roles')
    api.add_resource(UserRoleDetail, '/user_roles/<int:role_id>')


    api.add_resource(TripToday, '/trips/today')
    api.add_resource(TripPickup, '/trips/<int:trip_id>/pickup')
    api.add_resource(TripDropoff, '/trips/<int:trip_id>/dropoff')

    api.add_resource(BookingList, '/bookings')
    api.add_resource(BookingDetail, '/bookings/<int:booking_id>')

    
    return app 

app = create_app()
if __name__ == '__main__':
        app.run(port=5555, debug=True)