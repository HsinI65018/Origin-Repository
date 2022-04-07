from flask import *
from app import app
from app.controller import attractions, user, booking, orders
from flask_jwt_extended import *

app.register_blueprint(attractions.attractions_blueprint)
app.register_blueprint(user.user_blueprint)
app.register_blueprint(booking.booking_blueprint)
app.register_blueprint(orders.order_blueprint)

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")
@app.route("/member")
def member():
	return render_template("member.html")