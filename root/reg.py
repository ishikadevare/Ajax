import os
from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient

app = Flask(__name__, template_folder='./templates')

# Connect to the MongoDB database
client = MongoClient("mongodb://localhost:27017/")
db = client["registration_form"]
users = db["users"]

@app.route("/")
def index():
    print(os.path.abspath(app.template_folder))
    return render_template('reg.html')

@app.route("/check-username", methods=["POST"])
def check_username():
    username = request.json["username"]
    if users.find_one({"username": username}):
        return jsonify({"exists": True})
    else:
        return jsonify({"exists": False})

@app.route("/register", methods=["POST"])
def register():
    name = request.json["name"]
    college = request.json["college"]
    username = request.json["username"]
    password = request.json["password"]
    user = {"name": name, "college": college,
            "username": username, "password": password}
    users.insert_one(user)
    return jsonify({"success": True})

if __name__ == "__main__":
    app.run(debug=True)
