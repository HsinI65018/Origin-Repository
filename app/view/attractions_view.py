from flask import *

class Attractions:
    def get_success_first_page(data):
        response = make_response({'nextPage':1,'data':data}, 200)
        return response

    def get_success_page_null(data):
        response = make_response({'nextPage':'NULL','data':data}, 200)
        return response

    def get_success_page_next(page, data):
        response = make_response({'nextPage':page+1,'data':data}, 200)
        return response

    def get_page_end():
        response = make_response({'error':True,'message':'The end of the page'}, 400)
        return response

    def get_id_error(attractionId):
        response = make_response({'error':True,'message':'No.' + str(attractionId) + ' is not found'}, 400)
        return response

    def get_success(data):
        response = make_response({'data':data},200)
        return response
