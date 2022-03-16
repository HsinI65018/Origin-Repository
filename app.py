from flask import *
from app import app
from app.controller import attractions, single_attraction

app.register_blueprint(attractions.attractions_blueprint)
app.register_blueprint(single_attraction.single_attraction_blueprint)

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

app.run(host='0.0.0.0',port=3000, debug=True)