from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")  # For local MongoDB
db = client["Cinematch-app_db"]

# Collections
users = db["users"]
movies = db["movies"]
ratings = db["ratings"]
groups = db["groups"]
