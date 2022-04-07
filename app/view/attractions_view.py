from app.model.attractions_db import Attractions_db
from flask import *
import math

class Attraction_view:
    def attraction(data, count_data, page):
        try:
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
                response = make_response({'nextPage':page+1,'data':data}, 200)
        except:
            response = make_response({'error':True,'message':'Error message from server'}, 500)

        return response

    def single_attraction(id_, attractionId):
        try:
            if id_ is None:
                response = make_response({'error':True,'message':'No.' + str(attractionId) + ' is not found'}, 400)
            else:
                data = Attractions_db.single_attraction(attractionId)['data']
                data['images'] = data['images'].split('https')
                data['images'] = ['https' + i for i in data['images']][1:]
                response = make_response({'data':data},200)
        except:		
            response = make_response({'error':True,'message':'Error message from server'}, 500)

        return response            
