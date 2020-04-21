var data = require('./data.json')
var i;
var count = {}
var key = 'Operator:';
var kkey = 'Departure airport:'
for (i in data)
{
    kkey = Object.keys(data[i])[Object.keys(data[i]).length-2];
	key =kkey;
    if(count[data[i][key]] == undefined){
        count[data[i][key]] = 1;
    }
    else{
        count[data[i][key]]++;
    }
}
for(i in count){
	if(count[i] >= 10)
    console.log(i,count[i])
}
var airlines = ['Nepal Airlines','Air Greenland','Delta Air Lines','South Supreme Airlines','Air India','Trans Guyana Airways','Federal Air','Virgin Australia Regional','Myanmar Airways International','Aeroflot Russian International Airlines',
'Blue Bird Aviation','Golden Myanmar Airlines'];
var miliatry = ['United States Army','Yemen Air Force','United States Navy'];
