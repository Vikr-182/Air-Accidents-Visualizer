import json

file = open("../../assets/static/airports.csv")
dic = {}

for lline in file:
    line = lline.split(",")
    if line[1] != '':
        line[1] = line[1].split("\"")[1]
        dic[line[1]] = {}
        dic[line[1]]["lattitude"] = line[4]
        dic[line[1]]["longtitude"] = line[5]
        dic[line[1]]["city"] = line[10][1:-1]
        dic[line[1]]["country"] = line[8][1:-1] 
        dic[line[1]]["type"] = line[2][1:-1]
        dic[line[1]]["name"] = line[3][1:-1]

file.close()
with open("../../assets/static/code_to_airport.json","w") as f:
    json.dump(dic,f,indent=4,sort_keys=True)
