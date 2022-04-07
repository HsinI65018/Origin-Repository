from flask import *
from app import app
from datetime import datetime
from app.model.utility import get_db
import jwt, math, requests

order_blueprint = Blueprint("order", __name__)
jwt_secret_key = app.config['JWT_SECRET_KEY']

@order_blueprint.route('/api/orders', methods=['POST'])
def create_order():
    token = request.cookies.get("JWT")
    if (token):
        try:
            data = request.get_json()
            email = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])['email']
            url = 'https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime'
            time = datetime.now()
            order_number = time.strftime("%Y%m%d%H%M%S")
            order = data['order']
            contact = order['contact']
            booking = order['trip']
            attraction = order['trip']['attraction']
            request_data = {
                "prime": data['prime'],
                "partner_key": "partner_zCbbaqaW49kZf9Gj1coC0hAWc22kkIBwXvofplwuIDBzJhjWVwate7Ui",
                "merchant_id": "HsinI65018_CTBC",
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
            headers = {
                "Content-Type": "application/json",
                "x-api-key": "partner_zCbbaqaW49kZf9Gj1coC0hAWc22kkIBwXvofplwuIDBzJhjWVwate7Ui"
            }
            response = requests.post(url, data=json.dumps(request_data), headers=headers)
            response_content = json.loads(response.content)
            # print(type(response_content))
            # response = make_response({"data": response_content}, 200)
            # print(response_content["status"] == 0)
            if(response_content["status"] == 0):
                response_data = {
                    "number": response_content["order_number"],
                    "payment": {
                        "status": response_content["status"],
                        "message": response_content["msg"]
                    }
                }
                print(type(order_number))
                order_status = get_db("INSERT INTO orders (orderId)VALUES(%s)", [order_number], 'none')
                # order_status = get_db("INSERT INTO orders (orderId, paymentStatus, orderName, orderEmail, orderPhone, orderItem, orderUser, date, time, price, attraction, address, image)VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", [order_number, 0, contact['name'], contact['email'], contact['phone'], attraction['id'], email, booking['date'], booking['time'],order['price'], attraction['name'], attraction['address'], attraction['image']], 'none')
                # update_status = get_db("UPDATE booking SET paymentStatus=0 WHERE bookingItem=%s", [attraction['id']], 'none')
                # undelete_items = get_db("SELECT bookingItem FROM booking WHERE bookingUser=%s AND paymentStatus=1", [email], 'all')
                # if(undelete_items != []):
                #     for item in undelete_items:
                #         delete_item = get_db("DELETE FROM booking WHERE bookingItem=%s", [item['bookingItem']], 'none')
                response = make_response({"data": order_status}, 200)
            else:
                response = make_response({"error": True, "message": "Failed to pay", "order_number": order_number}, 400)
        except:
            response = make_response({"error":True, "message":"Error message from server"}, 500)
    else:
        response = make_response({"error": True, "message": "Please login in"}, 403)        

    return response

@order_blueprint.route('/api/orders/<int:orderNumber>', methods=['GET'])
def get_single_order(orderNumber):
    token = request.cookies.get("JWT")
    if(token):
        order_data = get_db("SELECT orderId, paymentStatus, date, time ,price, orderName, orderEmail, orderPhone, orderItem, attraction, address, image FROM orders WHERE orderId=%s", [orderNumber], 'one')
        data = {
            "number": order_data['orderId'],
            "price": order_data['price'],
            "trip": {
                "attraction": {
                    "id": order_data['orderItem'],
                    "name": order_data['attraction'],
                    "address": order_data['address'],
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
    else:
        response = make_response({"error": True, "message": "Please login in"}, 403)
    return response

@order_blueprint.route('/api/orders', methods=['GET'])
def get_orders():
    token = request.cookies.get("JWT")
    email = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])['email']
    page = int(request.args.get('page', 0))
    count = get_db("SELECT COUNT(orderId) FROM orders WHERE orderUser=%s", [email], 'one')['COUNT(orderId)']
    if(count % 4 == 0):
        maxPage = math.floor(count / 4) - 1
    else:
        maxPage = math.floor(count / 4)

    page_range = page * 4
    data = get_db("SELECT orderId, attraction, price FROM orders WHERE orderUser=%s LIMIT %s OFFSET %s", [email, 4, page_range], 'all')
    if(maxPage == page):
        response = make_response({"data": data, "nextPage": "NULL"}, 200)
    elif(maxPage > page):
        response = make_response({"data": data, "nextPage": page+1}, 200)
    else:
        data = 'null'
        response = make_response({"error": True, "nextPage": "The end of the page"}, 400)
    return response