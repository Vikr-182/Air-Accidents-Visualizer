import json

'''
{ "type": "Feature", "properties": { "scalerank": 0, "labelrank": 1, "featurecla": "Populated place", "name": "Los Angeles", "nameascii": "Los Angeles", "adm0name": "United States of America", "adm0_a3": "USA", "adm1name": "California", "iso_a2": "US", 
    "note": null, "latitude": 33.989978250199997, "longitude": -118.179980511, "changed": 0.0, "namediff": 0, "diffnote": null, "pop_max": 12500000, "pop_min": 3694820, "pop_other": 142265, "rank_max": 14, "rank_min": 12, "geonameid": 5368361.0, "meganame": "Los Angeles-Long Beach-Santa Ana", "ls_name": "Los Angeles1", "ls_match": 1, "checkme": 0 }, "geometry": { "type": "Point", "coordinates": [ -118.181926369940413, 33.991924108765431 ] } }
'''

with open("code_to_airport.json") as g:
    c = json.load(g)

keys = list(c.keys())

dic = {}
dic["type"] = "FeatureCollection"
dic["features"] = []
for i in range(len(keys)):
    dic["features"].append(
        { 
            "type": "Feature", 
            "properties": { 
                "scalerank": 0, 
                "labelrank": 1, 
                "featurecla": "Populated place", 
                "name": c[keys[i]]["city"], 
                "nameascii": "Los Angeles", 
                "adm0name": "United States of America", 
                "adm0_a3": "USA", 
                "adm1name": "California", 
                "iso_a2": "US", 
                "note": '', 
                "latitude": c[keys[i]]["lattitude"], 
                "longitude": c[keys[i]]["longtitude"], 
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
                "checkme": 0 
                }, 
            "geometry": { 
                "type": "Point", 
                "coordinates": [ c[keys[i]]["lattitude"], c[keys[i]]["longtitude"] ] 
                } 
            }
        )

with open("./new_places.json","w") as h:
    json.dump(dic,h,indent=4,sort_keys=True)
