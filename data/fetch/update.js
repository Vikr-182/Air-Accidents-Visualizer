let fs = require('fs')
let request = require('request')
let cheerio = require('cheerio')
let clean = require('../cleaned_data.json')
function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}
var st = 2400;
var aaa = Object.keys(clean).length;
//aaa = 2400;
console.log(aaa)
var bet = new Array(0);

function write_to(item){
	bet.push(item)
	if(bet.length != (aaa-st)){
		return;
	}
	fs.writeFile("../cleaned_data.json", JSON.stringify(clean,null,4), (err) => {
		if (err) {
			console.error(err);
			return;
		};
		console.log("File has been created");
	});
}


for (var i = st; i < Object.keys(clean).length && i < aaa; i++){
	var key = Object.keys(clean)[i];	
	var value = 0;
	for(var j = 0; j <= value; j++){
		console.log('https://aviation-safety.net/database/record.php?id=' + key )
		console.log("NOW\t " + i.toString())
		request( 'https://aviation-safety.net/database/record.php?id=' + key , function(err, res, body) {
			{
				try{

					const $ = cheerio.load(body);
					var jpp = $(".captionhr")//.slice(0,1);
					var gha = 1;
					var arre = []
					var jp;
					for(var gg = 0;gg < jpp.length;gg++){
						console.log(jpp.slice(gg,gg+1).text())
						if(jpp.slice(gg,gg+1).text() == "Classification:"){
							jp = jpp.slice(gg,gg+1);	
						}
					}
					while (gha == 1){
						jp = jp.next()
						if (jp.prop("tagName") != "A" && jp.prop("tagName")!="BR")
						{
							gha = 0;
						}
						else
						{
							arre.push(jp.text());
							console.log(jp.text());
						}
					}
					console.log($(".captionhr").slice(0,1).next().prop("tagName"))
					//	var shi = $(".captionhr").slice(0,1).next();
					var ioo = res.request.uri.href;
					ioo = ioo.slice(-10);
					//console.log(ioo)
					clean[ioo]["causes"] = arre;
					//				console.log(key,arre)
				}
				catch{
					console.log(res.request.uri.href)
				}
			}
			write_to(body);
		})
		sleep(10);
	}
}
