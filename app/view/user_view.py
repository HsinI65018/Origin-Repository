from flask import *

class User:
    def get_success_user_status(login_status):
        response = make_response({'data': login_status}, 200)
        return response

    def get_error_email():
        response = make_response({"error":True, "message":"Email 帳號已經存在"}, 400)
        return response

    def get_error_login():
        response = make_response({"error": True, "message": "帳號或密碼輸入錯誤"}, 400)
        return response    