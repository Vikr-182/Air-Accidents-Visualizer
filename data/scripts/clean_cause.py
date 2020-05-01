import json

with open("../cleaned_data.json") as f:
    data = json.load(f)

keys = list(data.keys())
for i in range(len(keys)):
    k = keys[i]
    if data[k].get("causes") is None:
        data[k]["causes"] = []
    data[k]["causes"] = list(filter( lambda x:x != "",data[k]["causes"]))

with open("../cleaned_data.json","w") as g:
    json.dump(data,g,indent=4,sort_keys=True)
