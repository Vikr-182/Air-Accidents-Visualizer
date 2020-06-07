import json

dic = {}
with open("./data.json") as f:
    dic = json.load(f)

del_keys = []
keys = list(dic.keys())

for i in range(len(keys)):
    if keys[i] != "anna":
        if dic[keys[i]].get("Departure airport:") is not None and dic[keys[i]].get("Destination airport:") is not None:
            if dic[keys[i]]["Departure airport:"] is "-" or dic[keys[i]]["Destination airport:"] is "-":
                del_keys.append(keys[i])
            else:
                r = "1"
                if len(dic[keys[i]]["Departure airport:"].split("(")) < 2 or len(dic[keys[i]]["Destination airport:"].split("(")) < 2:
                    del_keys.append(keys[i])
                else:
                    anna = "ra"
                    if len(dic[keys[i]]["Departure airport:"].split("(")[1].split(")")[0]) <=3 :
                        del_keys.append(keys[i])
                    if len(dic[keys[i]]["Destination airport:"].split("(")[1].split(")")[0]) <=3 :
                        del_keys.append(keys[i])
        else:
            del_keys.append(keys[i])


del_keys = list(dict.fromkeys(del_keys))
print(len(del_keys))
for i in range(len(del_keys)):
    dic.pop(del_keys[i])

with open("./cleaned_data.json","w") as ff:
    json.dump(dic,ff,indent=4,sort_keys=True)
