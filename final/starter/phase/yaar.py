import json

with open("./cleaned_data.json") as f:
    data = json.load(f)

li = list(data.keys())
for v in range(len(li)):
    data[li[v]]["date"] = li[v]

f.close()


with open("./cleaned_data.json","w") as f:
    json.dump(data,f,indent=4,sort_keys=True)

