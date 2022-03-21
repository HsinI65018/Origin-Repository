from flask import *
from app import app
from app import route

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=3000, debug=True)