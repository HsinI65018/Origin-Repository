from flask import *
from app.model.db import get_db

single_attraction_blueprint = Blueprint("single_attraction", __name__)

@single_attraction_blueprint.route('/api/attraction/<int:attractionId>',methods=['GET'])
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