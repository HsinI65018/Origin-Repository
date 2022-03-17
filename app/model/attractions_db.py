from flask import *
from app.model.utility import get_db

class Attractions_db:
    def attraction(keyword, page_range):
        count_data = get_db("SELECT COUNT(*) FROM attractions WHERE name LIKE %s", ['%'+keyword+'%'], 'all')[0]['COUNT(*)']
        data = get_db("SELECT id,name,category,description,address,transport,mrt,latitude,longitude,images FROM attractions WHERE name LIKE %s LIMIT %s OFFSET %s", ['%'+keyword+'%', 12, page_range], 'all')
        return {'count_data':count_data, 'data':data}

    def single_attraction(attractionId):
        id = get_db("SELECT id FROM attractions WHERE id=%s",[attractionId],'one')
        data = get_db("SELECT id,name,category,description,address,transport,mrt,latitude,longitude,images FROM attractions WHERE id=%s", [attractionId], 'one')
        return {'id':id, 'data':data}