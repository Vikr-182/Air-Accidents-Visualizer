var data = require('../data.json')
var i;
var count = {}
var key = 'Operator:';
var kkey = key;
for (i in data)
{
    kkey = Object.keys(data[i])[Object.keys(data[i]).length-2];
    if(count[data[i][key]] == undefined){
        count[data[i][key]] = 1;
    }
    else{
        count[data[i][key]]++;
    }
}
var ff = new Array(0);
for(i in count){
	if(count[i] >= 10)
	{
		console.log(i,count[i])
	//	ff.push([i,count[i]])
	}
}
ff.sort()
for (v in ff){
	{
	//	console.log(ff[v][0],ff[v][1])
	}
}
var airlines = ['Nepal Airlines','Air Greenland','Delta Air Lines','South Supreme Airlines','Air India','Trans Guyana Airways','Federal Air','Virgin Australia Regional','Myanmar Airways International','Aeroflot Russian International Airlines',
'Blue Bird Aviation','Golden Myanmar Airlines'];
var miliatry = ['United States Army','Yemen Air Force','United States Navy'];
