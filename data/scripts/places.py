import json
import csv

with open("../cleaned_data.json") as f:
    data = json.load(f)

li = list(data.keys())
anna = {}

for i in range(len(li)):
    airport = data[li[i]]["Departure airport:"].split("(")[1].split(")")[0].split("/")
    airport = airport[len(airport) - 1]
    print(airport)
    if len(airport) is 4:
        if anna.get(airport) is None:
            anna[airport] = []
        anna[airport].append(li[i][0:4])

with open("../new_places.json") as g:
    places = json.load(g)

sasa = {}
for i in range(len(places["features"])):
    places["features"][i]["properties"]["years"] = []

for i in range(len(places["features"])):
    if anna.get(places["features"][i]["properties"]["code"]) is not None:
        places["features"][i]["properties"]["years"] = anna.get(places["features"][i]["properties"]["code"])

g.close()
with open("../tmc.json","w") as h:
    json.dump(places,h,indent=4,sort_keys=True)
