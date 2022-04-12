from flask import *
from app import app
from datetime import datetime
from app.model.orders_db import OrdersDb
from app.view.orders_view import Orders
from app.view.response_view import statusResponse
import jwt, math, requests

order_blueprint = Blueprint("order", __name__)
jwt_secret_key = app.config['JWT_SECRET_KEY']
partner_key = app.config['PARTNER_KEY']
merchant_id = app.config['MERCHANT_ID']

@order_blueprint.route('/api/orders', methods=['POST'])
def create_order():
    token = request.cookies.get("JWT")
    if(token):
        email = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])['email']
    else:
        return statusResponse.get_login_error()

    data = request.get_json()
    url = 'https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime'
    time = datetime.now()
    order_number = time.strftime("%Y%m%d%H%M%S")
    order = data['order']
    contact = order['contact']
    booking = order['trip']
    attraction = order['trip']['attraction']

    request_data = Orders.get_request_data(data, partner_key, merchant_id, order_number, contact)
    headers = Orders.get_request_headers(partner_key)
    
    response = requests.post(url, data=json.dumps(request_data), headers=headers)
    response_content = json.loads(response.content)

    try:
        if(response_content["status"] == 0):
            order_status = OrdersDb.create_order(order_number, contact, attraction, email)
            booking_status = OrdersDb.update_booking_to_order(booking, order, order_number)
            attraction_status = OrdersDb.update_attrction_to_order(attraction, order_number)
            update_status = OrdersDb.update_order_status(attraction)

            undelete_items = OrdersDb.get_undelete(email)
            if(undelete_items != []):
                for item in undelete_items:
                    delete_item = OrdersDb.delete_booking(item)
            response = Orders.get_success_payment(response_content)
        else:
            response = Orders.get_error_payment()
    except:
        response = statusResponse.get_server_error()
    return response

@order_blueprint.route('/api/orders/<int:orderNumber>', methods=['GET'])
def get_order(orderNumber):
    token = request.cookies.get("JWT")
    if(token):
        email = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])['email']
    else:
        return statusResponse.get_login_error()

    try:
        order_data = OrdersDb.get_order(orderNumber)
        id = order_data['orderItem']
        attraction_data = OrdersDb.get_attraction(id)
        response = Orders.get_success_order_list(order_data, attraction_data)
    except:
         response = statusResponse.get_server_error()
    return response

@order_blueprint.route('/api/orders', methods=['GET'])
def get_orders():
    token = request.cookies.get("JWT")
    if(token):
        email = jwt.decode(token, jwt_secret_key, algorithms=['HS256'])['email']
    else:
        return statusResponse.get_login_error()

    page = int(request.args.get('page', 0))
    count = OrdersDb.get_count(email)
    if(count % 4 == 0):
        maxPage = math.floor(count / 4) - 1
    else:
        maxPage = math.floor(count / 4)
    page_range = page * 4
    data = OrdersDb.get_order_list(email, page_range)
    
    try:
        if(maxPage == page):
            response = Orders.get_success_page_null(data)
        elif(maxPage > page):
            response = Orders.get_success_page_next(data, page)
        else:
            data = 'null'
            response = Orders.get_error_page_end()
    except:
        response = statusResponse.get_server_error()
    return response