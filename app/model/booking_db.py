from app.model.utility import get_db

class BookingDb:
    def get_id(email):
        id = get_db("SELECT bookingItem FROM booking WHERE bookingUser=%s AND paymentStatus=1", [email], 'all')[-1]
        return id

    def get_attraction(id):
        attraction = get_db("SELECT name, address, images FROM attractions WHERE id=%s", [id], 'one')
        return attraction

    def get_booking(id):
        booking = get_db("SELECT date, time, price, bookingUser FROM booking WHERE bookingItem=%s", [id], 'one')
        return booking

    def create_booking(id, date, time, price, email):
        values = [id, date, time, price, email, 1]
        data = get_db("INSERT INTO booking (bookingItem, date, time, price, bookingUser, paymentStatus)VALUES(%s, %s, %s, %s, %s, %s)", values, 'none')
        return data

    def get_items(email):
        data = get_db("SELECT bookingItem FROM booking WHERE bookingUser=%s", [email], 'all')
        return data

    def delete_booking(id):
        delete = get_db("DELETE FROM booking WHERE bookingItem=%s AND paymentStatus=1", [id], 'none')
        return delete