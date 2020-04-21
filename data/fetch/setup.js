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
var params = require('./parameters.json')
var num = params["num"];
var start = params["start"];


var years = new Array(0);
for(var j = 0; j < num; j++){
	years.push(start + j);
}
var bodies = new Array(0);
function anna(item){
	bodies.push(item);
	console.log(bodies.length)
	if(bodies.length == num){
		// end game
		console.log(Object.keys(dic).length)
		fs.writeFile("./pages.json", JSON.stringify(pages,null,4), (err) => {
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
var pages = {}


for(var i = 0; i < num; i++){
	request('https://aviation-safety.net/database/dblist.php?Year=' + years[i].toString(), function(err, res, body) {
		const $ = cheerio.load(body);
		string = $('.list a').text().slice(3)
		var year = 0;
		for (var ii = 0; ii < string.length; ii+= 11){
			date = string.slice(ii, ii + 2);
			month = string.slice(ii + 3,ii + 6);
			year = string.slice(ii + 7, ii + 11)
			pages[year] = Math.floor($(".pagenumbers").children().length/2);
			console.log("AAAAAAAAAAAAAAAAAAA " + $(".pagenumbers").children().length + "OOOOOOOOOOOOOOOOO")
		}
		anna(body);
	});
}
