from flask import *
from mysql.connector import Error,pooling
import math

app=Flask(__name__, instance_relative_config=True)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config.from_pyfile('config.py')

connection_pool = pooling.MySQLConnectionPool(
	pool_name='attractions',
	pool_size=5,
	pool_reset_session=True,
	host='localhost',
	user=app.config["DB_USER"], 
	password=app.config["DB_PASSWORD"],
	database=app.config["DB_NAME"]
)

def get_db(sql,var,type):
	try:
		connection_object = connection_pool.get_connection()
		if connection_object.is_connected():
			cursor = connection_object.cursor(dictionary=True)
			cursor.execute(sql, tuple(var))
			if type == 'all':
				return cursor.fetchall()
			elif type == 'one':
				return cursor.fetchone()
			elif type == 'none':
				connection_object.commit()	
				return {200: 'commit successfully!'}	
	except Error as e:
		print(e)
	finally:
		if connection_object.in_transaction:
			connection_object.rollback()
		if connection_object.is_connected:
			cursor.close()
			connection_object.close()
			print('close db connection to connection pool')

# API
@app.route('/api/attractions',methods=['GET'])
def attractions():
	headers = {
		"Content-Type": "application/json"
	}
	page = int(request.args.get('page',0))
	keyword = request.args.get('keyword')
	
	try:
		if keyword is None:
			keyword = ''
		data = get_db("SELECT id,name,category,description,address,transport,mrt,latitude,longitude,images FROM attractions WHERE name LIKE %s", ['%'+keyword+'%'], 'all')
		for i in range(len(data)):
			data[i]['images'] = data[i]['images'].split('https')
			data[i]['images'] = ['https' + i for i in data[i]['images']][1:]

		if len(data) % 12 == 0:
			maxPage = math.floor(len(data)/12) - 1
		else:
			maxPage = math.floor(len(data)/12)
		
		if page > maxPage:
			response = make_response({'error':True,'message':'The end of the page'}, 400)
		elif page == 0:
			response = make_response({'nextPage':maxPage,'data':data[:12]}, 200)
		elif (maxPage-page) == 0:
			response = make_response({'nextPage':0,'data':data[12*page:]}, 200)
		else:
			response = make_response({'nextPage':maxPage-page,'data':data[12*page:12*page+12]})		
	except:
		response = make_response({'error':True,'message':'Error message from server'}, 500)

	response.headers = headers
	return response			

@app.route('/api/attraction/<int:attractionId>',methods=['GET'])
def single_attraction(attractionId):
	headers = {
		"Content-Type": "application/json"
	}
	id_ = get_db("SELECT id FROM attractions WHERE id=%s",[attractionId],'one')
	try:
		if id_ is None:
			response = make_response({'error':True,'message':'No.' + str(attractionId) + ' is not found'}, 400)
		else:
			data = get_db("SELECT id,name,category,description,address,transport,mrt,latitude,longitude,images FROM attractions WHERE id=%s", [attractionId], 'one')
			data['images'] = data['images'].split('https')
			data['images'] = ['https' + i for i in data['images']][1:]
			response = make_response({'data':data},200)
	except:		
		response = make_response({'error':True,'message':'Error message from server'}, 500)
	response.headers = headers
	return response	

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

app.run(port=3000)