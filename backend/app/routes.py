from flask import Flask, jsonify
from app import app, db

@app.route("/api/test", methods=["GET"])
def test():
    return jsonify({"message": "Backend is working!"})


@app.route("/api/movies", methods=["GET"])
def get_movies():
    movies = list(db.movies.find({}))
    for movie in movies:
        movie["_id"] = str(movie["_id"])
    return jsonify(movies)
