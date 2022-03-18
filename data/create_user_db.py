import mysql.connector
import config

connection = mysql.connector.connect(host='localhost',user=config.DB_USER, password=config.DB_PASSWORD,database=config.DB_NAME)
cursor = connection.cursor()

cursor.execute(
    "CREATE TABLE member (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255))"
)

connection.close()