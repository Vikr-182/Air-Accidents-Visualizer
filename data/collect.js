var data = require('./data.json')
var i;
var count = {}
for (i in data){
    if(count[data[i]['Operator:']] == undefined){
        count[data[i]['Operator:']] = 1;
    }
    else{
        count[data[i]['Operator:']]++;
    }
}
for(i in count){
    if(count[i] >= 2)
    console.log(i,count[i])
}
var airlines = ['Nepal Airlines','Air Greenland','Delta Air Lines','South Supreme Airlines','Air India','Trans Guyana Airways','Federal Air','Virgin Australia Regional','Myanmar Airways International','Aeroflot Russian International Airlines',
'Blue Bird Aviation','Golden Myanmar Airlines'];
var miliatry = ['United States Army','Yemen Air Force','United States Navy'];