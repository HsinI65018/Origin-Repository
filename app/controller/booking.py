from flask import *
from app import app
from app.model.booking_db import BookingDb
from app.view.booking_view import Booking
from app.view.response_view import statusResponse
import jwt

booking_blueprint = Blueprint("booking", __name__)
jwt_secret_key = app.config['JWT_SECRET_KEY']

@booking_blueprint.route('/api/booking',methods=["GET"])
def get_booking():
    token = request.cookies.get('JWT')
    if(token):
        email = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])['email']
    else:
        return statusResponse.get_login_error()

    try:
        id = BookingDb.get_id(email)['bookingItem']
        attraction_data = BookingDb.get_attraction(id)
        attraction_data['images'] = attraction_data['images'].split('https')
        attraction_data['images'] = ['https' + i for i in attraction_data['images']][1:]
        image = attraction_data['images'][0]

        booking_data = BookingDb.get_booking(id)

        response = Booking.get_success(id, attraction_data, image, booking_data)
    except:
        response = Booking.get_error()
    return response

@booking_blueprint.route('/api/booking',methods=["POST"])
def create_booking():
    token = request.cookies.get('JWT')
    if(token):
        email = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])['email']
    else:
        return statusResponse.get_login_error()

    try:
        request_body = request.get_json()
        id = request_body['attractionId']
        date = request_body['date']
        time = request_body['time']
        price = request_body['price']
        data = BookingDb.create_booking(id, date, time, price, email)
        response = statusResponse.get_success()
    except:
        response = statusResponse.get_server_error()
    return response

@booking_blueprint.route('/api/booking',methods=["DELETE"])
def delete_booking():
    token = request.cookies.get('JWT')
    if(token):
        email = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])['email']
    else:
        return statusResponse.get_login_error()

    try:
        data = BookingDb.get_items(email)
        for item in data:
            id = item['bookingItem']
            delete_item = BookingDb.delete_booking(id)
        response = statusResponse.get_success()
    except:  
        response = statusResponse.get_server_error()
    return response