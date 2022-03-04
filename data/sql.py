import json
import mysql.connector
import config

json_data = open("taipei-attractions.json").read()
json_obj = json.loads(json_data)
json_result = json_obj['result']['results']
con = mysql.connector.connect(host='localhost',user=config.DB_USER, password=config.DB_PASSWORD,database=config.DB_NAME)
cursor = con.cursor()

def filter_jpg (arr):
    new_images = []
    for i in range(len(arr)):
        if arr[i][-3:]== 'jpg' or arr[i][-3:]== 'JPG':
            new_images.append(arr[i])
        else:
            continue        
    return new_images

for item in json_result:
    id = item["_id"]
    name = item["stitle"]
    category = item["CAT2"]
    description = item["xbody"]
    address = item['address'],
    transport = item["info"],
    mrt = item["MRT"],
    latitude =item["latitude"],
    longitude = item["longitude"],
    images = item["file"].split('https')

    images = ['https' + i for i in images][1:]
    result = ''.join(filter_jpg(images))
 
    cursor.execute("INSERT INTO attractions (id,name,category,description,address,transport,mrt,latitude,longitude,images) VALUE(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)" 
    ,(id,name,category,description,address[0],transport[0],mrt[0],float(latitude[0]),float(longitude[0]),result))
    

con.commit()
con.close()

