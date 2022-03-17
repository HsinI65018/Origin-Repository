from flask import *
from app.model.attractions_db import Attractions_db
from app.view.attractions_view import Attraction_view

attractions_blueprint = Blueprint("attractions", __name__)

@attractions_blueprint.route('/api/attractions',methods=['GET'])
def attractions():
	headers = {
		"Content-Type": "application/json"
	}
	page = int(request.args.get('page',0))
	keyword = request.args.get('keyword','')
	page_range = int(page) * 12

	count_data = Attractions_db.attraction(keyword, page_range)['count_data']
	data = Attractions_db.attraction(keyword, page_range)['data']

	response = Attraction_view.attraction(data, count_data, page)

	response.headers = headers
	return response

@attractions_blueprint.route('/api/attraction/<int:attractionId>',methods=['GET'])
def single_attraction(attractionId):
	headers = {
		"Content-Type": "application/json"
	}
	
	id_ = Attractions_db.single_attraction(attractionId)['id']
	response = Attraction_view.single_attraction(id_, attractionId)

	response.headers = headers
	return response	