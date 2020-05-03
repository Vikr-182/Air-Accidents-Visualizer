function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}


const request = require('request')
const fs = require('fs')
const cheerio = require('cheerio')
var pages = require('./pages.json')
var params = require('./parameters.json')
var num = params["num"];
var start = params["start"];


var years = new Array(0);
for(var j = 0; j < num; j++){
	years.push(start + j);
}
var bodies = new Array(0);

// Setting limits
var total = 0;
for(var b = 0; b < num; b++){
	console.log(pages[years[b].toString()])
	total += pages[years[b].toString()];
}

console.log(Object.keys(pages).length)
console.log(total)
console.log("anna")
// Called midway
function anna(item){
	bodies.push(item);
	console.log(bodies.length)
	if(bodies.length == total){
		// end game
		console.log(Object.keys(dic).length)
		fs.writeFile("./object.json", JSON.stringify(dic,null,4), (err) => {
			if (err) {
				console.error(err);
				return;
			};
			console.log("File has been created");
		});

	}
}

var mn = {
	"JAN" : "01",
	"FEB" : "02",
	"MAR" : "03",
	"APR" : "04",
	"MAY" : "05",
	"JUN" : "06",
	"JUL" : "07",
	"AUG" : "08",
	"SEP" : "09",
	"OCT" : "10",
	"NOV" : "11",
	"DEC" : "12"
} 

var dic = {}


for(var i = 0; i < num; i++){
	for(var h = 0; h < pages[years[i].toString()]; h++){
		var req_string = "";
		if(h == 0){
			req_string = 'https://aviation-safety.net/database/dblist.php?Year=' + years[i].toString();
		}
		else{
			req_string = 'https://aviation-safety.net/database/dblist.php?Year=' + years[i].toString() + "&lang=" + "&page=" + (h+1).toString(); 
		}
		try{
			request(req_string, function(err, res, body) {
				const $ = cheerio.load(body);
				string = $('.list a').text().slice(3)
				for (var ii = 0; ii < string.length; ii+= 11){
					date = string.slice(ii, ii + 2);
					month = string.slice(ii + 3,ii + 6);
					year = string.slice(ii + 7, ii + 11)
					if (dic[year.toString() + mn[month] + date] == undefined){
						dic[year.toString() + mn[month] + date] = 0;
					}
					else{
						dic[year.toString() + mn[month] + date]++;
					}
				}
				anna(body);
			});
			sleep(10);
		}
		catch{
			anna(1);	
		}
	}
}
