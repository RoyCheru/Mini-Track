from flask import Flask
from flask_restful import Api 
from models import db 
from flask_migrate import Migrate

def create_app():

    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    migrate = Migrate(app, db)
    api = Api(app)

    if __name__ == '__main__':
        app.run(port=5555, debug=True)

    return app 

app = create_app