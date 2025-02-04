from flask import Flask
from flask_restful import Api
from flask_jwt_extended import JWTManager
from pymongo import MongoClient

app = Flask(__name__)
api = Api(app)
jwt = JWTManager(app)

# Load configuration
app.config.from_pyfile('config.py')

# MongoDB connection
client = MongoClient(app.config["MONGO_URI"])
db = client["Cinematch-app_db"]  

# Import routes
from app.routes import *