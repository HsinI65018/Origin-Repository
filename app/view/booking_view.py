from flask import *

class Booking:
    def get_success(id, attraction_data, image, booking_data):
        data = {
            "attraction":{
                "id": id,
                "name": attraction_data['name'],
                "address": attraction_data['address'],
                "image": image
            },
            "date": booking_data['date'],
            "time": booking_data['time'],
            "price": booking_data['price']
        }
        response = make_response({"data": data}, 200)
        return response

    def get_error():
        response = make_response({"data": "null"} ,200)
        return response    