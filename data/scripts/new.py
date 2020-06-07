import json
with open("../cleaned_data.json") as f:
    data = json.load(f)
'''
Ferry/positioning, Domestic Scheduled Passenger, Military, Ambulance
Domestic Non Scheduled Passenger, Cargo, Private, Test, Executive,
International Scheduled Passenger, Int\'l Non Scheduled Passenger,
 Unknown, Training, Illegal Flight, Official state flight, Passenger,
 Parachuting. Survey/research, Fire fighting,  Agricultural
 '''

li = list(data.keys())

operator={}
for i in range(len(li)):

    k = li[i]
    try :
        n = data[k]["Nature:"]
        oper = data[k]["Operator:"]
        if oper in operator.keys():
            operator[oper]+=1
        else:
            operator[oper]=1
    except :
        pass

with open("./kyakya.json","w") as ddd:
    json.dump(operator,ddd,indent=4,sort_keys=True)
