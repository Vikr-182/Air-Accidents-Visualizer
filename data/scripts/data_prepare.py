import json

with open("../data.json") as f:
    data = json.load(f)

li = data.keys()
li = list(li)
for i in range(len(li)):
    data[li[i]]["date"] = li[i]

f.close()
with open("../data.json") as f:
    json.dump(data,f,indent=4,sort_keys=True)
