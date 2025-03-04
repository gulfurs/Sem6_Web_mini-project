from flask import Flask, request, jsonify, session
from flask_cors import CORS
from pymongo import MongoClient
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
import os

from functools import wraps

app = Flask(__name__)
app.secret_key = 'your_secret_key'  

app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = 3600  
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False  
app.config['SESSION_COOKIE_HTTPONLY'] = True

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["Cinematch-app_db"]

# CORS configuration
CORS(app, 
     origins=["http://localhost:3000"],
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.session_protection = "strong"

@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"error": "Authentication required"}), 401

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get the auth header
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({"error": "Authorization header is required"}), 401
        
        # Extract user_id from header
        try:
            # Simple format: "Bearer user_id"
            token_parts = auth_header.split(' ')
            if len(token_parts) != 2 or token_parts[0] != 'Bearer':
                return jsonify({"error": "Invalid authorization format"}), 401
                
            user_id = token_parts[1]
            
            # Check if user exists
            user_data = db.users.find_one({"_id": ObjectId(user_id)})
            if not user_data:
                return jsonify({"error": "Invalid user"}), 401
                
            # Set the current user for the request
            request.current_user = user_data
            
            return f(*args, **kwargs)
        except Exception as e:
            print(f"Auth error: {str(e)}")
            return jsonify({"error": "Authentication failed"}), 401
            
    return decorated_function

@app.route("/api/movies", methods=["GET"])
def get_movies():
    try:
        movies = list(db.movies.find())
        
        # Convert ObjectId to string for JSON serialization
        for movie in movies:
            movie["_id"] = str(movie["_id"])
        
        return jsonify(movies), 200
    except Exception as e:
        print(f"Error fetching movies: {str(e)}")
        return jsonify({"error": "An error occurred while fetching movies"}), 500

# User class for Flask-Login
class User(UserMixin):
    def __init__(self, user_data):
        self.id = str(user_data['_id'])
        self.username = user_data['username']
        self.user_data = user_data
    
    def get_id(self):
        return self.id

@login_manager.user_loader
def load_user(user_id):
    user_data = db.users.find_one({"_id": ObjectId(user_id)})
    if user_data:
        return User(user_data)
    return None

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Invalid username or password"}), 400

    # Check if username already exists
    existing_user = db.users.find_one({"username": username})
    if existing_user:
        return jsonify({"error": "Username already exists"}), 400

    hashed_password = generate_password_hash(password)
    
    # Insert user into database
    result = db.users.insert_one({"username": username, "password": hashed_password})
    
    # Login the newly registered user
    user_data = db.users.find_one({"_id": result.inserted_id})
    user = User(user_data)
    login_user(user)
    
    return jsonify({
        "message": "User created successfully", 
        "user": {"id": str(result.inserted_id), "username": username}
    }), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Invalid username or password"}), 400

    user_data = db.users.find_one({"username": username})

    if not user_data or not check_password_hash(user_data["password"], password):
        return jsonify({"error": "Invalid username or password"}), 401

    # Create simple auth token for client storage
    user_id = str(user_data["_id"])
    
    # Return user info and authentication token
    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user_id,
            "username": username
        },
    }), 200

@app.route("/api/logout", methods=["POST"])
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200

@app.route("/api/me", methods=["GET"])
def get_current_user():
    if current_user.is_authenticated:
        return jsonify({
            "user": {
                "id": current_user.id,
                "username": current_user.username
            }
        }), 200
    return jsonify({"user": None}), 401

# Movie rating endpoint
@app.route("/api/ratings", methods=["GET"])
@token_required  # Changed from @login_required
def get_user_ratings():
    try:
        # Use the user from the request
        user_id = request.current_user["_id"]
        ratings = list(db.ratings.find({"user_id": user_id}))
        
        # Convert ObjectId to string for JSON serialization
        for rating in ratings:
            rating["_id"] = str(rating["_id"])
            rating["user_id"] = str(rating["user_id"])
        
        return jsonify({"ratings": ratings}), 200
    
    except Exception as e:
        print(f"Error getting ratings: {str(e)}")
        return jsonify({"error": "An error occurred while retrieving your ratings"}), 500

# Same for the rate endpoint
@app.route("/api/rate", methods=["POST"])
@token_required  # Changed from @login_required
def rate_movie():
    data = request.get_json()
    movie_id = data.get("movie_id")
    rating = data.get("rating")
    
    if not movie_id or not rating:
        return jsonify({"error": "Movie ID and rating are required"}), 400
    
    try:
        # Validate rating
        rating = int(rating)
        if rating < 1 or rating > 5:
            return jsonify({"error": "Rating must be between 1 and 5"}), 400
        
        # Check if movie exists
        movie = db.movies.find_one({"_id": ObjectId(movie_id)})
        if not movie:
            return jsonify({"error": "Movie not found"}), 404
        
        # Use the user from the request
        user_id = request.current_user["_id"]
        
        # Check if user has already rated this movie
        existing_rating = db.ratings.find_one({
            "user_id": user_id,
            "movie_id": movie_id
        })
        
        if existing_rating:
            # Update existing rating
            db.ratings.update_one(
                {"_id": existing_rating["_id"]},
                {"$set": {"rating": rating}}
            )
            return jsonify({"message": "Rating updated successfully"}), 200
        else:
            # Insert new rating
            db.ratings.insert_one({
                "user_id": user_id,
                "movie_id": movie_id,
                "rating": rating
            })
            return jsonify({"message": "Rating added successfully"}), 201
    
    except Exception as e:
        print(f"Error rating movie: {str(e)}")
        return jsonify({"error": "An error occurred while processing your request"}), 500

# Add a route to get a single movie's details
@app.route("/api/movies/<movie_id>", methods=["GET"])
def get_movie(movie_id):
    try:
        movie = db.movies.find_one({"_id": ObjectId(movie_id)})
        if not movie:
            return jsonify({"error": "Movie not found"}), 404
        
        # Convert ObjectId to string for JSON serialization
        movie["_id"] = str(movie["_id"])
        
        return jsonify(movie), 200
    
    except Exception as e:
        print(f"Error getting movie: {str(e)}")
        return jsonify({"error": "An error occurred while retrieving the movie"}), 500



if __name__ == "__main__":
    app.run(debug=True)