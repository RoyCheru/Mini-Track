from flask import Flask, request, jsonify, session
from flask_migrate import Migrate
from werkzeug.security import check_password_hash