from flask import Flask
from flask_restful import Api 
from models import db 
from flask_migrate import Migrate
from routes.auth import Login, Signup, Logout
from routes.user import CreateDriver, GetDrivers, GetUsers, UpdateUser, DeleteUser

def create_app():

    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate = Migrate(app, db)
    api = Api(app)

    api.add_resource(Login, '/login')
    api.add_resource(Signup, '/signup')
    api.add_resource(Logout, '/logout')
    
    api.add_resource(CreateDriver, '/drivers')
    api.add_resource(GetDrivers, '/drivers')
    api.add_resource(GetUsers, '/users')
    api.add_resource(UpdateUser, '/users/<int:user_id>')
    api.add_resource(DeleteUser, '/users/<int:user_id>')
    
    

    return app 

app = create_app()
if __name__ == '__main__':
        app.run(port=5555, debug=True)