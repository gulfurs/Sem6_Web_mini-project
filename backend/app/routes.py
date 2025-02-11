from flask import Flask, jsonify, request
from app import app, db
from werkzeug.security import generate_password_hash, check_password_hash

@app.route("/api/test", methods=["GET"])
def test():
    return jsonify({"message": "Backend is working!"})


@app.route("/api/movies", methods=["GET"])
def get_movies():
    movies = list(db.movies.find({}))
    for movie in movies:
        movie["_id"] = str(movie["_id"])
    return jsonify(movies)

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data["username"]
    password = data["password"]

    if not username or not password:
        return jsonify({"error": "Invalid username or password"}), 400

    users = db.users

    # Check if username already exists
    existing_user = users.find_one({"username": username})
    if existing_user:
        return jsonify({"error": "Username already exists"}), 400

    hashed_password = generate_password_hash(password)

    #Insert user into database
    users.insert_one({"username": username, "password": hashed_password})

    return jsonify({"message": "User created successfully"}), 201