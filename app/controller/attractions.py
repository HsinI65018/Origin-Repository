from flask import *
from app.model.db import get_db
import math

attraction_blueprint = Blueprint("attractions", __name__)

@attraction_blueprint.route('/api/attractions',methods=['GET'])
def attractions():
	headers = {
		"Content-Type": "application/json"
	}
	page = int(request.args.get('page',0))
	keyword = request.args.get('keyword','')

	try:
		count_data = get_db("SELECT COUNT(*) FROM attractions WHERE name LIKE %s", ['%'+keyword+'%'], 'all')[0]['COUNT(*)']
		page_range = int(page) * 12
		data = get_db("SELECT id,name,category,description,address,transport,mrt,latitude,longitude,images FROM attractions WHERE name LIKE %s LIMIT %s OFFSET %s", ['%'+keyword+'%', 12, page_range], 'all')
		for i in range(len(data)):
			data[i]['images'] = data[i]['images'].split('https')
			data[i]['images'] = ['https' + i for i in data[i]['images']][1:]
		
		if count_data % 12 == 0:
			max_Page = math.floor(count_data/12) - 1
		else:
			max_Page = math.floor(count_data/12)
		
		if page > max_Page:
			response = make_response({'error':True,'message':'The end of the page'}, 400)
		elif page == 0 and max_Page > 1:
			response = make_response({'nextPage':1,'data':data}, 200)
		elif (max_Page-page) == 0:
			response = make_response({'nextPage':'NULL','data':data}, 200)
		else:
			response = make_response({'nextPage':page+1,'data':data})
	except:
		response = make_response({'error':True,'message':'Error message from server'}, 500)

	response.headers = headers
	return response