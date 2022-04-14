from app.model.utility import get_db

class AttractionDb:
    def count_attractions(keyword):
        count = get_db("SELECT COUNT(*) FROM attractions WHERE name LIKE %s", ['%'+keyword+'%'], 'all')[0]['COUNT(*)']
        return count

    def get_attractions(keyword, page_range):
        values = ['%'+keyword+'%', 12, page_range]
        data = get_db("SELECT id,name,category,description,address,transport,mrt,latitude,longitude,images FROM attractions WHERE name LIKE %s LIMIT %s OFFSET %s", values, 'all')
        return data

    def get_id(attractionId):
        id = get_db("SELECT id FROM attractions WHERE id=%s",[attractionId],'one')
        return id

    def get_attraction(attractionId):
        data = get_db("SELECT id,name,category,description,address,transport,mrt,latitude,longitude,images FROM attractions WHERE id=%s", [attractionId], 'one')
        return data