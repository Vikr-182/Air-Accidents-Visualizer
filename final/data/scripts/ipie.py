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
services = ['Ambulance','Executive','Survey/research','Fire fighting']
passenger = ['Domestic Scheduled Passenger','Domestic Non Scheduled Passenger','International Scheduled Passenger','Int\'l Non Scheduled Passenger',' Passenger']
military = ['Military','Official state flight']
cargo = ['Cargo']
misc = ['Private','Parachuting','Illegal Flight','Ferry/positioning','Test','Training']

li = list(data.keys())
sdic = []
pdic = []
mdic = []
cdic = []
idic = []

for i in range(len(li)):
    k = li[i]
    n = data[k]["Nature:"]
    if n in services:
        sdic.append(k)
    elif n in passenger:
        pdic.append(k)
    elif n in military:
        mdic.append(k)
    elif n in cargo:
        cdic.append(k)
    elif n in misc:
        idic.append(k)


print(len(sdic))
print(len(pdic))
print(len(mdic))
print(len(cdic))
print(len(idic))

## FINAL JSON ###
anna = {}
anna["name"] = "flare"
anna["children"] = [
        {
            "name":"services",
            "children": []
        },
        {
            "name":"passenger",
            "children": []
        },
        {
            "name":"military",
            "children": []
        },
        {
            "name":"cargo",
            "children": []
        },
        {
            "name":"misc",
            "children": []
        }
]
for i in range(len(sdic)):
    val = {"name"}
