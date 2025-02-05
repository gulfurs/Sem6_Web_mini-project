from flask import Flask
from pymongo import MongoClient
import os
from dotenv import load_dotenv


load_dotenv()

app = Flask(__name__)


# MongoDB connection
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client["Cinematch-app_db"]  

# Import routes
from app.routes import *