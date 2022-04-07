from flask import *
from app import app
from app.model.user_db import User_db
from app.view.user_view import User_view
from werkzeug.security import generate_password_hash
import jwt
from app.model.utility import get_db

user_blueprint = Blueprint("user", __name__)
jwt_secret_key = app.config['JWT_SECRET_KEY']

@user_blueprint.route('/api/user', methods=['GET'])
def get_user():
    token = request.cookies.get('JWT')
    status = 'null'
    if(token):
        email = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])['email']
        status = User_db.get_user(email)
    response = User_view.get_user(status)   
    return response

@user_blueprint.route('/api/user', methods=['POST'])
def create_user():
    request_body = json.loads(request.data)['content']
    name = request_body['name']
    email = request_body['email']
    password =  generate_password_hash (request_body['password'])
    check_email = User_db.check_user(email)
    register_status = 'null'
    if check_email is None:
        register_status = User_db.create_user(name, email, password)
    response = User_view.create_user(check_email, register_status)
    return response

@user_blueprint.route('/api/user', methods=['PATCH'])
def login():
    request_body = json.loads(request.data)['content']
    email = request_body['email']
    password = request_body['password']
    get_user = User_db.login(email)
    response = User_view.login(email,get_user,password,jwt_secret_key)    
    return response

@user_blueprint.route('/api/user', methods=['DELETE'])
def logout():
    response = User_view.logout()
    response.delete_cookie("JWT")
    return response

@user_blueprint.route('/api/user', methods=['PUT'])
def update_password():
    token = request.cookies.get('JWT')
    get_password = request.get_json()['password']
    new_password = generate_password_hash(get_password)
    if(token):
        email = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])['email']
        data = get_db("UPDATE member SET password=%s WHERE email=%s", [new_password, email], 'none')
        response = make_response({"ok": True}, 200)
    else:
        response = make_response({"error": True, "message": "please login in"}, 403)
    return response