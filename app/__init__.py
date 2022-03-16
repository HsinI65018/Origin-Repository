from flask import *

app=Flask(__name__, instance_relative_config=True)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config.from_pyfile('config.py')