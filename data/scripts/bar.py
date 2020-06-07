import csv
import json
with open("../../assets/static/airports.csv") as f:
    data = csv.reader(f,delimiter=',')
    cnt = 0
    data = list(data)
    dic = {}
    cid = {}
    for i in range(len(data)):
        if cnt is 0:
            print((data[i]))
        cnt = cnt + 1
        if dic.get(data[i][1]) is None:
            dic[data[i][1]] = {"country":data[i][8]}
        if cid.get(data[i][8]) is None:
            cid[data[i][8]] = []
        cid[data[i][8]].append(data[i][1])

    with open("../../assets/static/airport_to_country.json","w") as p:
        json.dump(dic,p,indent=4,sort_keys=True)

    with open("../../assets/static/country_to_airport.json","w") as q:
        json.dump(cid,q,indent=4,sort_keys=True)
