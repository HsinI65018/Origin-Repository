from flask import *
from app.model.attractions_db import AttractionDb
from app.view.attractions_view import Attractions
from app.view.response_view import statusResponse
import math

attractions_blueprint = Blueprint("attractions", __name__)

@attractions_blueprint.route('/api/attractions',methods=['GET'])
def get_attractions():
	page = int(request.args.get('page',0))
	keyword = request.args.get('keyword','')
	page_range = int(page) * 12

	count = AttractionDb.count_attractions(keyword)
	data = AttractionDb.get_attractions(keyword, page_range)

	for i in range(len(data)):
		data[i]['images'] = data[i]['images'].split('https')
		data[i]['images'] = ['https' + i for i in data[i]['images']][1:]

	if count % 12 == 0:
		max_Page = math.floor(count/12) - 1
	else:
		max_Page = math.floor(count/12)
	try:
		if page > max_Page:
			response = Attractions.get_page_end()
		elif page == 0 and max_Page > 1:
			response = Attractions.get_success_first_page(data)
		elif (max_Page-page) == 0:
			response = Attractions.get_success_page_null(data)
		else:
			response = Attractions.get_success_page_next(page, data)
	except:
		response = statusResponse.get_server_error()
	return response

@attractions_blueprint.route('/api/attraction/<int:attractionId>',methods=['GET'])
def get_attraction(attractionId):
	id_ = AttractionDb.get_id(attractionId)
	if id_ is None:
		response = Attractions.get_id_error(attractionId)
		return response
		
	try:
		data = AttractionDb.get_attraction(attractionId)
		data['images'] = data['images'].split('https')
		data['images'] = ['https' + i for i in data['images']][1:]
		response = Attractions.get_success(data)
	except:		
		response = statusResponse.get_server_error()
	return response	