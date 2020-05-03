import json


data = open("./req.json")
k= json.load(data)
#print (len(k))
print ("name,value,date,category")
for i in k:
    country = i 
    #print ("country =", country)
    for j in k[i]:
        if j != "2013" and j != "2019":
            print (country+","+str(k[i][j])+","+j+"-01-01,"+country)
#        print(j,":",k[i][j],end=" ")
#    print()
