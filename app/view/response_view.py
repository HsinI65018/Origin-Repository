from flask import *

class statusResponse:
    def get_success():
        response = make_response({"ok": True}, 200)
        return response

    def get_server_error():
        response = make_response({"error": True, "message": "Error message from server"}, 500)
        return response

    def get_login_error():
        response = make_response({"error": True, "message": "Please login in"}, 403)
        return response