from flask import *
from app import app
from app.model.user_db import UserDb
from app.view.user_view import User
from app.view.response_view import statusResponse
from werkzeug.security import generate_password_hash, check_password_hash
import jwt

user_blueprint = Blueprint("user", __name__)
jwt_secret_key = app.config['JWT_SECRET_KEY']

@user_blueprint.route('/api/user', methods=['GET'])
def get_user():
    token = request.cookies.get('JWT')
    if(token):
        email = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])['email']
        login_status = UserDb.get_user(email)
    else:
        login_status = 'null'
    response = User.get_success_user_status(login_status)
    return response

@user_blueprint.route('/api/user', methods=['POST'])
def create_user():
    request_body = json.loads(request.data)['content']
    name = request_body['name']
    email = request_body['email']
    password =  generate_password_hash(request_body['password'])
    check_email = UserDb.check_user(email)
    if check_email:
        return User.get_error_email()

    try:
        register_status = UserDb.create_user(name, email, password)
        response = statusResponse.get_success()
    except:
        response = statusResponse.get_server_error()
    return response

@user_blueprint.route('/api/user', methods=['PATCH'])
def login():
    request_body = json.loads(request.data)['content']
    email = request_body['email']
    password = request_body['password']
    get_user = UserDb.get_login(email)
    if(get_user):
        check_password = check_password_hash(get_user['password'], password)
    if(get_user is None or check_password is False):
        return User.get_error_login()

    try:
        access_token = jwt.encode({"email":email}, jwt_secret_key, algorithm="HS256")
        response = statusResponse.get_success()
        response.set_cookie("JWT", access_token, httponly = True)
    except:
        response = statusResponse.get_server_error()
    return response

@user_blueprint.route('/api/user', methods=['DELETE'])
def logout():
    response = statusResponse.get_success()
    response.delete_cookie("JWT")
    return response

@user_blueprint.route('/api/user', methods=['PUT'])
def update_password():
    token = request.cookies.get('JWT')
    get_password = request.get_json()['password']
    new_password = generate_password_hash(get_password)
    if(token):
        email = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])['email']
    else:
        return statusResponse.get_login_error()
        
    try:
        data = UserDb.update_password(new_password, email)
        response = statusResponse.get_success()
    except:
        response = statusResponse.get_server_error()
    return response