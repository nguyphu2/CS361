from flask import Flask, request, jsonify
import json
import os
import traceback

app = Flask(__name__)
USERS_FILE = "user.json"

def load_users():
    if not os.path.exists(USERS_FILE):
        return []
    try:
        with open(USERS_FILE, "r") as file:
            return json.load(file)
    except json.JSONDecodeError:
        return []
    
def save_users(users):
    with open(USERS_FILE, "w") as file:
        json.dump(users, file, indent=4)

@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.json
        if data is None:
            return jsonify({"message": "Invalid JSON data"}), 400
        
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"message": "Username and password required"}), 400
        
        users = load_users()
        
        if any(user["username"] == username for user in users):
            return jsonify({"message": "Username already exists"}), 400
        
        users.append({"username": username, "password": password})
        save_users(users)
        return jsonify({"message": "User registered!"}), 201
    
    except Exception as e:
        print(f"Error in register: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"message": "Internal server error"}), 500

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        if data is None:
            return jsonify({"message": "Invalid JSON data"}), 400
        
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return jsonify({"message": "Username and password required"}), 400

        users = load_users()
        
        if any(user["username"] == username and user["password"] == password for user in users):
            return jsonify({"message": "Login successful"}), 200
        
        return jsonify({"message": "Invalid username or password"}), 401
    
    except Exception as e:
        print(f"Error in login: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"message": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(debug=True)