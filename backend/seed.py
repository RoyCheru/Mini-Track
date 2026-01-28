from app import create_app
from models import db, User, Parent, Vehicle, Route, Booking, SchoolLocation
from datetime import datetime

app = create_app()

with app.app_context():
    print("Seeding database...")
    # users
    user1 = User(name="Grace Kuria", email="grace@gmail.com", password_hash="hashed_password_1", role_id=1)
    user2 = User(name="Kipkwemoi Kebut", email="kipkwemoi@gmail.com", password_hash="hashed_password_2", role_id=2)
    db.session.add_all([user1, user2])
    db.session.commit()