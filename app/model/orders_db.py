from app.model.utility import get_db

class OrdersDb:
    def create_order(order_number, contact, attraction, email):
        values = [order_number,0, contact['name'], contact['email'], contact['phone'], attraction['id'], email]
        order = get_db("INSERT INTO orders (orderId, paymentStatus, orderName, orderEmail, orderPhone, orderItem, orderUser)VALUES(%s, %s, %s, %s, %s, %s, %s)", values, 'none')
        return order

    def update_booking_to_order(booking, order, order_number):
        booking = get_db("UPDATE orders SET date=%s, time=%s ,price=%s WHERE orderId=%s", [booking['date'], booking['time'], order['price'], order_number], 'none')
        return booking

    def update_attrction_to_order(attraction, order_number):
        attraction = get_db("UPDATE orders SET image=%s WHERE orderId=%s", [attraction['image'], order_number], 'none')
        return attraction

    def update_order_status(attraction):
        update_order = get_db("UPDATE booking SET paymentStatus=0 WHERE bookingItem=%s", [attraction['id']], 'none')
        return update_order

    def get_undelete(email):
        items = get_db("SELECT bookingItem FROM booking WHERE bookingUser=%s AND paymentStatus=1", [email], 'all')
        return items

    def delete_booking(item):
        delete = get_db("DELETE FROM booking WHERE bookingItem=%s", [item['bookingItem']], 'none')
        return delete

    def get_order(orderNumber):
        order = get_db("SELECT orderId, paymentStatus, date, time ,price, orderName, orderEmail, orderPhone, orderItem, image FROM orders WHERE orderId=%s", [orderNumber], 'one')
        return order

    def get_attraction(id):
        attraction = get_db("SELECT name, address FROM attractions WHERE id=%s", [id], 'one')
        return attraction

    def get_count(email):
        count = get_db("SELECT COUNT(orderId) FROM orders WHERE orderUser=%s", [email], 'one')['COUNT(orderId)']
        return count

    def get_order_list(email, page_range):
        data = get_db("SELECT orderId, price, orderItem, name FROM orders JOIN attractions ON orderItem=id WHERE orderUSer=%s LIMIT %s OFFSET %s", [email, 4, page_range], 'all')
        return data 