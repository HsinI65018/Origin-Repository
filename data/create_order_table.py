import mysql.connector
import config

connection = mysql.connector.connect(host='localhost',user=config.DB_USER, password=config.DB_PASSWORD,database=config.DB_NAME)
cursor = connection.cursor()

cursor.execute(
    "CREATE TABLE orders (orderId VARCHAR(14) PRIMARY KEY, paymentStatus INT, orderItem INT, attraction VARCHAR(100), address VARCHAR(255), image VARCHAR(255),date VARCHAR(100), time VARCHAR(20), price INT, orderName VARCHAR(255), orderEmail VARCHAR(255), orderPhone VARCHAR(10), orderUser VARCHAR(255), FOREIGN KEY(orderItem) REFERENCES attractions(id) ON DELETE SET NULL, FOREIGN KEY(orderUser) REFERENCES member(email) ON DELETE CASCADE);"
)

connection.close()