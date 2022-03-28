import mysql.connector
import config

connection = mysql.connector.connect(host='localhost',user=config.DB_USER, password=config.DB_PASSWORD,database=config.DB_NAME)
cursor = connection.cursor()

cursor.execute(
    "CREATE TABLE booking (orderId INT PRIMARY KEY AUTO_INCREMENT, date VARCHAR(100), time VARCHAR(20), price INT, orderItem INT, orderUser VARCHAR(255), FOREIGN KEY(orderItem) REFERENCES attractions(id) ON DELETE SET NULL, FOREIGN KEY(orderUser) REFERENCES member(email) ON DELETE CASCADE)"
)

connection.close()