import csv 
data  = open("./flat-stateofoccurrence-stats.csv",'r')
#data  = open("./anna_flat-stateofoperator-stats.csv",'r')
csvreader = csv.reader(data)

rows=[]
fields = next(csvreader)
for row in csvreader:
    rows.append(row)

#print('Field names are:' + ', '.join(field for field in fields)) 
#print('\nFirst 5 rows are:\n')
for row in rows[:5]:
#    print(row)
    # parsing each column of a row
    for col in row:
#        print (col,end="")
#        print("%10s"%col,end=" ")
        pass




#  country , total_accidents , total_fatal , total_death
final =  {}

for i in rows:
#    print (i[6])
    if i[0] > "2014" and i[0] < "2020":
        if i[6] in final.keys():
            final[i[6]]['total'] += int(i[1]) 
            final[i[6]]['fatal'] += int(i[3]) 
            final[i[6]]['death'] += int(i[2]) 
        else:
            final[i[6]] = {}
            final[i[6]]['total'] = int(i[1])
            final[i[6]]['fatal'] = int(i[3]) 
            final[i[6]]['death'] = int(i[2]) 

#print (final)


#sortedfinal = sorted(final.items(), key = lambda kv:(kv[1], kv[0]['death']))
sortedfinal = {k: v for k, v in sorted(final.items(), key=lambda item: item[1]['death'],reverse=True)}




#print((sortedfinal))







count =0 
print("Name,X2011,Y2011,R2011")
for i in sortedfinal:
    if count > 30:
        break
    if i != "" and i!="0":
        count+=1
#        print(i+","+str(final[i]['total'])+","+str(final[i]['fatal'])+","+str(0))
        print(i+","+str(final[i]['total'])+","+str(final[i]['fatal'])+","+str(final[i]['death']))

