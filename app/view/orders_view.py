from flask import *

class Orders:
    def get_request_data(data, partner_key, merchant_id, order_number, contact):
        request_data = {
            "prime": data['prime'],
            "partner_key": partner_key,
            "merchant_id": merchant_id,
            "amount": data['order']['price'],
            "details": "TapPay Test",
            "order_number": order_number,
            "cardholder": {
                "phone_number": contact['phone'],
                "name": contact['name'],
                "email": contact['email'],
            },
            "remember": True
        }
        return request_data

    def get_request_headers(partner_key):
        headers = {
            "Content-Type": "application/json",
            "x-api-key": partner_key
        }
        return headers

    def get_success_payment(response_content):
        response_data = {
            "number": response_content["order_number"],
            "payment": {
                "status": response_content["status"],
                "message": response_content["msg"]
            }
        }
        response = make_response({"data": response_data}, 200)
        return response

    def get_error_payment(order_number):
        response = make_response({"error": True, "message": "Failed to pay", "order_number": order_number}, 400)
        return response

    def get_success_order_list(order_data, attraction_data):
        data = {
            "number": order_data['orderId'],
            "price": order_data['price'],
            "trip": {
                "attraction": {
                    "id": order_data['orderItem'],
                    "name": attraction_data['name'],
                    "address": attraction_data['address'],
                    "image": order_data['image'],
                },
                "date": order_data['date'],
                "time": order_data['time']
            },
            "contact": {
                "name": order_data['orderName'],
                "email": order_data['orderEmail'],
                "phone": order_data['orderPhone']
            },
            "status": order_data['paymentStatus'],
        }
        response = make_response({"data": data}, 200)
        return response

    def get_success_page_null(data):
        response = make_response({"data": data, "nextPage": "NULL"}, 200)
        return response

    def get_success_page_next(data, page):
        response = make_response({"data": data, "nextPage": page+1}, 200)
        return response

    def get_error_page_end():
        response = make_response({"error": True, "nextPage": "The end of the page"}, 400)
        return response
