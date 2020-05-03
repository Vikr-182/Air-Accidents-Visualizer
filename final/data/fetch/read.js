let fs = require('fs')
let data = require('./object.json')
let request = require('request')
let cheerio = require('cheerio')
let params = require('./parameters.json')
function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}
console.log(data["20140110"])

var dic = require('./data.json')
var bic = {
	"1" : "Time",
	"2" : "Type",
	"3" : "Operator",
	"4" : "Registration",
	"5" : "C/n/msn",
	"6" : "FirstFlight",
	"7" : "Engines",
	"8" : "Crew",
	"9" : "Passengers",
	"10" : "Total",
	"11" : "Damage",
	"12" : "Fate",
	"13" : "Location",
	"14" : "Phase",
	"15" : "Nature",
	"16" : "Departure",
	"17" : "Destination",
	"18" : "Flightnumber"
}
var check = new Array(0);
var num = 0;
var bbb = Object.keys(data).length;
var st = 2000;
var aaa = bbb;
for (var l = st; l < aaa; l++){
	num += (data[Object.keys(data)[l]]+1);
}
console.log(num)
function anna(item){
	if(item != undefined)
	{
		check.push(item);
	}
	else{
		check.push("anna");
	}
	console.log("\n LEN:\t" + check.length.toString());
	if( check.length >= (29)){
		fs.writeFile("./data.json", JSON.stringify(dic,null,4), (err) => {
			if (err) {
				console.error(err);
				return;
			};
			console.log("File has been created");
		});
	}
	//console.log(dic);
}
for (var i = st; i < Object.keys(data).length && i < aaa; i++){
	var key = Object.keys(data)[i];	
	var value = data[key];
	for(var j = 0; j <= value; j++){
		console.log('https://aviation-safety.net/database/record.php?id=' + key + '-' + j.toString())
		console.log("NOW\t " + i.toString())
		request( 'https://aviation-safety.net/database/record.php?id=' + key + '-' + j.toString(), function(err, res, body) {
			{
				const $ = cheerio.load(body);
				var reti = 1;
				var count = 0;
				var karr = new Array(0);
				var tttu = $('.caption').map(function(pp,el){
					karr.push($(this).text())
					count = count + 1;
				})
				count = 0;
				var ranna = 0;
				//console.log(karr)
				var kkkey  = res.request.uri.href;
				var ro = kkkey.length - 1;
				kkkey = kkkey.slice(ro-9,ro+1)
				dic[kkkey] = {}
				var betu = $('.caption').nextAll().map(function(pp,el){
					count = count + 1;
					if( $(this).attr("class") == "desc")
					{
						//console.log($(this).text() + "\tHI\n")
						if( dic[kkkey] == undefined){
							dic[kkkey] = {};
						}
						dic[kkkey][karr[count]] = $(this).text();
					}
				})
			}
				anna(body);
		})
		sleep(1000);
	}
}
