import json

criminal = ['Hijack', 'Hijacker(s) escaped', 'Hijacker(s) overpowered by occupants', 'Plane stormed', 'Shot down from the ground', 'Sabotage'];
external = ['Runway excursion', 'Flightcrew incapacitation', 'Runway mishap', 'Runway incursion', 'Mid air collision', 'Missing', 'Bird strike', 'Ground collision', 'Collision with vehicle', 'Collision with person or animal on the ground', 'Passenger door failure', 'Collision with airport equipment', 'Destroyed on ground', 'Hangar / ground fire', 'Collision with pole or wires', 'Collision with approach or runway lights'];
loss_of_con = ['Loss of control', 'Forced landing on runway', 'Ditching', 'Forced landing outside airport', 'Emergency landing', 'Controlled Flight Into Terrain (CFIT) - Mountain', 'Controlled Flight Into Terrain (CFIT) - Ground', 'Damaged on the ground', 'Cause undetermined', 'Loss of control (presumed)'];
mechanical = ['All engine powerloss', 'Ditching', 'Horizontal stabilizer', 'Fuel exhaustion', 'Prop/turbine blade separation', 'Fuel starvation', 'Uncontained engine failure', 'Wrong installation of parts', 'Navigational error', 'Landing gear collapse', 'Wing failure', 'Inflight fire', 'Electrical system problem', 'Fuselage failure', 'Rudder issue', 'Tire failure', 'Engine fire', 'Cargo fire/smoke', 'Engine separation', 'Tail failure', 'Locked rudders/ailerons/gustlock', 'Airframe failure', 'Fuel contamination', 'Autopilot issues', 'Elevator issue', 'Engine reverse issue', 'Hydraulic system problem', 'Issue with flap(s)'];
pilot = ['Centre of Gravity outside limits', 'Wrong takeoff configuration (flaps/trim)', 'Undershoot/overshoot', 'Heavy landing', 'Tailstrike', 'Gear-up landing', 'VFR flight in IMC', 'Loss of situational awareness', 'Landing or takeoff on wrong runway', "Flightcrew member's alcohol, drug usage", 'Rejected takeoff', 'Overloaded', 'Distraction in cockpit', 'Cargo door failure', 'Shutdown of wrong engine', "Flightcrew's failure to monitor instruments", 'Premature gear retraction on take-off', 'Wheel(s) up landing', 'Flightcrew  un(der)qualified', 'Normal landing', 'Controlled Flight Into Terrain (CFIT) - Water', 'Landing after unstabilized approach', 'Non-adherence to procedures', 'Insufficient rest / fatigue', 'Improper flap/slat usage', 'Premature descent', 'Bounced on landing', 'High speed landing', "Failure to follow AD and SB's", 'Wrong altimeter setting', 'Late landing', "Flightcrew member's mental condition"];
weather = ['Icing', 'Windshear/downdraft', 'Lightningstrike', 'Low visibility', 'Precipitation-induced flame-out', 'Turbulence', 'Thunderstorm'];


data = open("./cleaned_data.json","r")

k = json.load(data)

crimnum={'Taxi':0,'Takeoff':0,'Init. climb':0,'En route':0,'Approach':0,'Landing':0,'Kyra':0}
extnum={'Taxi':0,'Takeoff':0,'Init. climb':0,'En route':0,'Approach':0,'Landing':0,'Kyra':0}
lossnum={'Taxi':0,'Takeoff':0,'Init. climb':0,'En route':0,'Approach':0,'Landing':0,'Kyra':0}
mechnum={'Taxi':0,'Takeoff':0,'Init. climb':0,'En route':0,'Approach':0,'Landing':0,'Kyra':0}
pilotnum={'Taxi':0,'Takeoff':0,'Init. climb':0,'En route':0,'Approach':0,'Landing':0,'Kyra':0}
weathernum={'Taxi':0,'Takeoff':0,'Init. climb':0,'En route':0,'Approach':0,'Landing':0,'Kyra':0}
unknownum={'Taxi':0,'Takeoff':0,'Init. climb':0,'En route':0,'Approach':0,'Landing':0,'Kyra':0}


crimlist=[]
extlist=[]
losslsit=[]
mechlist=[]
pilotlist=[]
weatherlist=[]
unknownlist=[]

"""
                    
                    if (d['Phase:'] == " Taxi (TXI)"){
                        // console.log("iffing at =** ") 
                        return Math.random()*width/7 + 10 ;   
                    }
                    if (d['Phase:'] == " Takeoff (TOF)"){
                        // console.log("iffing at =** ") 
                        return Math.random()*width/7 + width/7 + 10 ;   
                    }
                    if (d['Phase:'] == " Initial climb (ICL)"){
                        // console.log("iffing at =** ") 
                        return Math.random()*width/7 + 2*width/7 + 10 ;   
                    }
                    if (d['Phase:'] == " En route (ENR)"){
                        // console.log("iffing at =** ") 
                        return Math.random()*width/7 + 3*width/7 + 10 ;   
                    }
                    if (d['Phase:'] == " Approach (APR)"){
                        // console.log("iffing at =** ") 
                        return Math.random()*width/7 + 4*width/7 + 10 ;   
                    }
                    if (d['Phase:'] == " Landing (LDG)"){
                        // console.log("iffing at =** ") 
                        return Math.random()*width/7 + 5*width/7 + 10 ;   
                    }            
                    else{
                        console.log("elsing at = "+d['Phase:'])
                        return Math.random()*width/7 + 6*width/7 + 10 ;   
                    }
"""

for i in k :
    if k[i]['causes'] == []:
        cause = 'Unknown'
    else :
        cause = k[i]['causes'][0]


    if cause == 'Unknown':
        unknownlist.append(k[i])
    elif cause in external:
        extlist.append(k[i])
    elif cause in criminal:
        crimlist.append(k[i])
    elif cause in pilot:
        pilotlist.append(k[i])
    elif cause in mechanical:
        mechlist.append(k[i])
    elif cause in weather:
        weatherlist.append(k[i])
    elif cause in loss_of_con:
        losslsit.append(k[i])
#    print (cause)










def makedict(causelist,causedic):
    for d in causelist:
        if (d['Phase:'] == " Taxi (TXI)"):
            causedic['Taxi']+=1
        if (d['Phase:'] == " Takeoff (TOF)"):
            causedic['Takeoff'] += 1
        if (d['Phase:'] == " Initial climb (ICL)"):
            causedic['Init. climb']+=1
        if (d['Phase:'] == " En route (ENR)"):
            causedic['En route'] +=1
        if (d['Phase:'] == " Approach (APR)"):
            causedic['Approach'] +=1
        if (d['Phase:'] == " Landing (LDG)"):
            causedic['Landing'] +=1
        else:
            causedic['Kyra']+=1
    print (causedic,sum(causedic.values()))


print("ext")
makedict(extlist,extnum)
print("crim")
makedict(crimlist,crimnum)
print("pilot")
makedict(pilotlist,pilotnum)
print("unk")
makedict(unknownlist,unknownum)
print("mechanical")
makedict(mechlist,mechnum)
print("loss_of_con")
makedict(losslsit,lossnum)
print("weather")
makedict(weatherlist,weathernum)








