import json


data = open("./cleaned_data.json","r")

k = json.load(data)

for i in k :
    print (k[i])
