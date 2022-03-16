from flask import *
from app import app
from mysql.connector import Error,pooling

connection_pool = pooling.MySQLConnectionPool(
	pool_name='attractions',
	pool_size=5,
	pool_reset_session=True,
	host='localhost',
	user=app.config["DB_USER"], 
	password=app.config["DB_PASSWORD"],
	database=app.config["DB_NAME"]
)

def get_db(sql,var,type):
	try:
		connection_object = connection_pool.get_connection()
		if connection_object.is_connected():
			cursor = connection_object.cursor(dictionary=True)
			cursor.execute(sql, tuple(var))
			if type == 'all':
				return cursor.fetchall()
			elif type == 'one':
				return cursor.fetchone()
			elif type == 'none':
				connection_object.commit()	
				return {200: 'commit successfully!'}	
	except Error as e:
		print(e)
	finally:
		if connection_object.in_transaction:
			connection_object.rollback()
		if connection_object.is_connected:
			cursor.close()
			connection_object.close()
			print('close db connection to connection pool')
            