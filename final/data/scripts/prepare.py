import json

with open("../cleaned_data.json") as f:
    dic = json.load(f)

with open("../../assets/static/code_to_airport.json") as h:
    hic = json.load(h)

array = []
keys = list(dic.keys())
for i in range(0,len(keys)):
    if len(dic[keys[i]].get("Departure airport:").split("(")[1].split(")")[0]) is 4 and len(dic[keys[i]].get("Destination airport:").split("(")[1].split(")")[0]) is 4:
        array.append(dic[keys[i]].get("Departure airport:").split("(")[1].split(")")[0])
        array.append(dic[keys[i]].get("Destination airport:").split("(")[1].split(")")[0])
    elif len(dic[keys[i]].get("Departure airport:").split("(")[1].split(")")[0].split("/")) >= 2 and len(dic[keys[i]].get("Destination airport:").split("(")[1].split(")")[0].split("/")) >= 2:
        array.append(dic[keys[i]].get("Departure airport:").split("(")[1].split(")")[0])
        array.append(dic[keys[i]].get("Destination airport:").split("(")[1].split(")")[0].split("/")[1])

anna = {}
anna["type"] = "FeatureCollection"
anna["features"] = []
c = hic
keys = array
for i in range(len(array)):
    if c.get(array[i]) is not None and len(c[keys[i]]["lattitude"].split(".")) >= 2 and len(c[keys[i]]["longtitude"].split(".")) >= 2:
        if c[array[i]]["city"] is "":
            c[array[i]]["city"] = c[array[i]]["name"]
        anna["features"].append(
                { 
                    "type": "Feature", 
                    "properties": { 
                        "scalerank": 0, 
                        "labelrank": 1, 
                        "featurecla": "Populated place", 
                        "name": c[array[i]]["city"], 
                        "nameascii": "Los Angeles", 
                        "adm0name": "United States of America", 
                        "adm0_a3": "USA", 
                        "adm1name": "California", 
                        "iso_a2": "US", 
                        "note": '', 
                        "latitude": float(c[keys[i]]["lattitude"]), 
                        "longitude": float(c[keys[i]]["longtitude"]), 
                        "changed": 0.0, 
                        "namediff": 0, 
                        "diffnote": '', 
                        "pop_max": 12500000, 
                        "pop_min": 3694820, 
                        "pop_other": 142265, 
                        "rank_max": 14, 
                        "rank_min": 12, 
                        "geonameid": 5368361.0, 
                        "meganame": "Los Angeles-Long Beach-Santa Ana", 
                        "ls_name": "Los Angeles1", 
                        "ls_match": 1, 
                        "checkme": 0 ,
                        "code":array[i]
                        }, 
                    "geometry": { 
                        "type": "Point", 
                        "coordinates": [  float(c[keys[i]]["longtitude"]),float(c[keys[i]]["lattitude"]) ] 
                        } 
                    }
                )
                

with open("../new_places.json","w") as mm:
    json.dump(anna,mm,indent=4,sort_keys=True)
