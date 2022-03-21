from flask import *
import jwt
from werkzeug.security import check_password_hash

class User_view:
    def get_user(status):
        response = make_response({'data': status}, 200)
        return response

    def create_user(check_email, register_ststus):
        try:
            if check_email:
                response = make_response({"error":True, "message":"Email 帳號已經存在"}, 400)
            else:
                response = make_response(register_ststus, 200)
        except:
            response = make_response({"error":True, "message":"Error message from server"}, 500)
        return response

    def login(email,get_user,password,jwt_secret_key):
        try:
            if(get_user):
                check_password = check_password_hash(get_user['password'], password)
            if(get_user is None or check_password is False):
                response = make_response({"error": True, "message": "帳號或密碼輸入錯誤"}, 400)        
            else:
                access_token = jwt.encode({"email":email}, jwt_secret_key, algorithm="HS256")
                response = make_response({"ok": True})
                response.set_cookie("JWT", access_token, httponly = True)
        except:
            response = make_response({"error":True, "message":"Error message from server"}, 500)
        return response

    def logout():
        response = make_response({"ok": True}, 200)
        return response        