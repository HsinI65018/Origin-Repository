from flask import *
from app import app
from app.model.utility import get_db
import jwt

booking_blueprint = Blueprint("booking", __name__)
jwt_secret_key = app.config['JWT_SECRET_KEY']

@booking_blueprint.route('/api/booking',methods=["GET"])
def get_booking():
    token = request.cookies.get('JWT')
    email = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])['email']
    if(token):
        try:
            bookingItem = get_db("SELECT bookingItem FROM booking WHERE bookingUser=%s AND paymentStatus=1", [email], 'all')[-1]
            id = bookingItem['bookingItem']
            attraction_data = get_db("SELECT name, address, images FROM attractions WHERE id=%s", [id], 'one')
            name = attraction_data['name']
            address = attraction_data['address']
            attraction_data['images'] = attraction_data['images'].split('https')
            attraction_data['images'] = ['https' + i for i in attraction_data['images']][1:]
            image = attraction_data['images'][0]

            order_data = get_db("SELECT date, time, price, bookingUser FROM booking WHERE bookingItem=%s", [id], 'one')
            date = order_data['date']
            time = order_data['time']
            price = order_data['price']
            data = {
                "attraction":{
                    "id": id,
                    "name": name,
                    "address": address,
                    "image": image
                },
                "date": date,
                "time": time,
                "price": price
            }
            response = make_response({"data": data}, 200)
        except:
            response = make_response({"data": "null"} ,200)
    else:
        response = make_response({"error": True, "message": "Please login in"}, 403)    
    return response

@booking_blueprint.route('/api/booking',methods=["POST"])
def create_booking():
    token = request.cookies.get('JWT')
    email = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])['email']
    try:
        if(token):
            request_body = request.get_json()
            id = request_body['attractionId']
            date = request_body['date']
            time = request_body['time']
            price = request_body['price']
            email = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])['email']
            data = get_db("INSERT INTO booking (bookingItem, date, time, price, bookingUser, paymentStatus)VALUES(%s, %s, %s, %s, %s, %s)", [id, date, time, price, email, 1], 'none')
            response = make_response({"ok": True}, 200)
        else:
            response = make_response({"error": True, "message": "Please login in"}, 403)    
    except:
        response = make_response({"error": True, "message": "Error message from server"}, 500)
    return response

@booking_blueprint.route('/api/booking',methods=["DELETE"])
def delete_booking():
    token = request.cookies.get('JWT')
    email = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])['email']
    data = get_db("SELECT bookingItem FROM booking WHERE bookingUser=%s", [email], 'all')
    if(token):
        for item in data:
            print(item)
            id = item['bookingItem']
            delete_item = get_db("DELETE FROM booking WHERE bookingItem=%s AND paymentStatus=1", [id], 'none')
        response = make_response({"ok": True}, 200)
    else:
        response = make_response({"error": True, "message": "Please login in"}, 403)    
    return response