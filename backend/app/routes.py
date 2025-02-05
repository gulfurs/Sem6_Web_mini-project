from flask import Flask, jsonify
from app import app, db

@app.route("/api/test", methods=["GET"])
def test():
    return jsonify({"message": "Backend is working!"})