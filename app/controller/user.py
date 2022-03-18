from flask import *

user_blueprint = Blueprint("user", __name__)

@user_blueprint.route('/api/user', methods=['GET'])
def get_user():
    return 'HI'

@user_blueprint.route('/api/user', methods=['POST'])
def create_user():
    return 'HI'

@user_blueprint.route('/api/user', methods=['PATCH'])
def login():
    return 'HI'

@user_blueprint.route('/api/user', methods=['DELETE'])
def logout():
    return 'HI'        