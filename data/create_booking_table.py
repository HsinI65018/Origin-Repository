import mysql.connector
import config

connection = mysql.connector.connect(host='localhost',user=config.DB_USER, password=config.DB_PASSWORD,database=config.DB_NAME)
cursor = connection.cursor()

cursor.execute(
    "CREATE TABLE booking (bookingId INT PRIMARY KEY AUTO_INCREMENT, date VARCHAR(100), time VARCHAR(20), price INT, bookingItem INT, bookingUser VARCHAR(255), paymentStatus VARCHAR(10), FOREIGN KEY(bookingItem) REFERENCES attractions(id) ON DELETE SET NULL, FOREIGN KEY(bookingUser) REFERENCES member(email) ON DELETE CASCADE)"
)

connection.close()