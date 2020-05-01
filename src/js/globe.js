	// width and height
	var w = $(".col-md-8").width()*19/20;
	var h = 500;
	var keys = [];
	// scale globe to size of window
	var scl = Math.min(w, h) / 2.5;
	scl = 220;
	var glow_scl = scl * 1.1;
	var jag, pag;
	var scale_sky = 305;
	var scale_sky2 = 265;
	var scale_sky3 = 245;
	var scale_sky4 = 225;
	// map projection
	var projection = d3.geoOrthographic()
	    .scale(scl)
	    .clipAngle(90)
	    .translate([w / 2, h / 2]);

	var glow_projection = d3.geoOrthographic()
	    .scale(glow_scl)
	    .clipAngle(90)
	    .translate([w / 2, h / 2]);

		// path generator
	var path = d3.geoPath()
	    .projection(projection)
	    .pointRadius(2);;

	var glow_path = d3.geoPath()
	    .projection(glow_projection)
	    .pointRadius(2);;

	var sky = d3.geoOrthographic()
	    .translate([w / 2, h / 2])
	    .clipAngle(90)
	    .scale(scale_sky);

	var sky2 = d3.geoOrthographic()
	    .translate([w / 2, h / 2])
	    .clipAngle(90)
	    .scale(scale_sky2);

	var sky3 = d3.geoOrthographic()
	    .translate([w / 2, h / 2])
	    .clipAngle(90)
	    .scale(scale_sky3);

	var sky4 = d3.geoOrthographic()
	    .translate([w / 2, h / 2])
	    .clipAngle(90)
		.scale(scale_sky4);
		
	// append svg
	var svg = d3.select("#svgDiv")
	    .append("svg")
	    .attr("width", w)
		.attr("height", h)
		.attr("class","beti");

	// append g element for map
	var map = svg.append("g");

	// enable drag
	var drag = d3.drag()
	    .on("start", dragstarted)
	    .on("drag", dragged);

	var gpos0, o0, gpos1, o1;
	var sgpos0, so0, sgpos1, so1;
	var glow_pos0, glow_o0, glow_gpos1, glow_o1;
	var s2gpos0, s2o0, s2gpos1, s2o1;
	var s3gpos0, s3o0, s3gpos1, s3o1;
	var s4gpos0, s4o0, s4gpos1, s4o1;

	svg.call(drag);

	var sag, dag;
	var swoosh = d3.line()
	    .x(function (d) {
	        return d[0]
	    })
	    .y(function (d) {
	        return d[1]
	    })
	    .curve(d3.curveCardinal.tension(0))
	// .tension(.0);

	var bag;
	var links = [],
	    arcLines = [];
		function draw_globe(item) {

	    queue()
	        .defer(d3.json,
	            "../assets/static/world-110m.json"
	        )
	        .defer(d3.json, "../data/places.json")
	        .defer(d3.json, "../data/tmc.json")
	        .defer(d3.json, "../assets/static/code_to_airport.json")
	        .defer(d3.json, "../data/cleaned_data.json")
	        .await(ready);
	    // enable zoom
	    var zoom = d3.zoom()
	        .scaleExtent([0.75, 50]) //bound zoom
	        .on("zoom", zoomed);

	    svg.call(zoom);


	    function ready(error, json, places, new_places, code_to_airport, cleaned_data) {
	        sag = json;
			dag = places;
			var gag = new_places;
			bag = new_places;
			console.log(bag["features"].length)
			var cnt = 0;
			var use = [];
			for(var gh = 0;gh < bag["features"].length;gh++){
				if(bag["features"][gh]["properties"]["years"].includes(item)){
					use.push(bag["features"][gh]);
				}
			}
			// alert(use.length);
			bag["features"]= use;
			pag = cleaned_data;
	        var count = 0;
	        // console.log(code_to_airport["VIDP"])
			map.append("rect")
				.attr("class","coverbox")
				.attr("width",$("svg").width())
				.attr("height",$("svg").height())
				.attr("stroke-width",5)
				.attr("stroke","black")
				.attr("fill-opacity","1")

			map.append("path")
	            .datum({
	                type: "Sphere"
	            })
	            .attr("class", "glow")
	            .attr("d", glow_path);

			map.append("path")
	            .datum({
	                type: "Sphere"
	            })
	            .attr("class", "ocean")
	            .attr("d", path);

	        map.append("path")
	            .datum(topojson.merge(json, json.objects.countries.geometries))
	            .attr("class", "land")
	            .attr("d", path);

	        draw_points(places);

	        map.append("path")
	            .datum(topojson.mesh(json, json.objects.countries, function (a, b) {
	                return a !== b;
	            }))
	            .attr("class", "boundary")
	            .attr("d", path);

	        // spawn links between cities as source/target coord pairs
	        // places.features.forEach(function (a) {
	        // 	places.features.forEach(function (b) {
	        // 		if (a !== b && (a.properties.name == "Mumbai")) {
	        // 			links.push({
	        // 				source: a.geometry.coordinates,
	        // 				target: b.geometry.coordinates
	        // 			});
	        // 		}
	        // 	});
	        // });
	        var ip;
	        var cnt = 0;
	        for (ip in cleaned_data) {
	            cnt = cnt + 1;
	            if (cnt < 10000000 && ip.slice(0, 4) == item) {
	                // console.log(cleaned_data[ip]["Departure airport:"].split(")")[0].split("(")[1].split("/"))
	                // console.log(cleaned_data[ip]["Departure airport:"].split(")")[0].split("(")[1].split("/"))
	                var keu, leu;
	                if (cleaned_data[ip]["Departure airport:"].split(")")[0].split("(")[1].split("/").length > 1) {
	                    keu = cleaned_data[ip]["Departure airport:"].split(")")[0].split("(")[1].split("/")[1];
	                } else if (cleaned_data[ip]["Departure airport:"].split(")")[0].split("(")[1].split("/")[0].length ==
	                    4) {
	                    keu = cleaned_data[ip]["Departure airport:"].split(")")[0].split("(")[1].split("/")[0]
	                } else {
	                    continue;
	                }
	                if (cleaned_data[ip]["Destination airport:"].split(")")[0].split("(")[1].split("/").length > 1) {
	                    leu = cleaned_data[ip]["Destination airport:"].split(")")[0].split("(")[1].split("/")[1];
	                } else if (cleaned_data[ip]["Destination airport:"].split(")")[0].split("(")[1].split("/")[0].length ==
	                    4) {
	                    leu = cleaned_data[ip]["Destination airport:"].split(")")[0].split("(")[1].split("/")[0]
	                } else {
	                    continue;
	                }
	                if (code_to_airport[keu] != undefined && code_to_airport[leu] != undefined && keu != leu) {
	                    keys.push(ip);
	                    links.push({
	                        source: [parseFloat(code_to_airport[keu]["longtitude"]), parseFloat(code_to_airport[
	                            keu][
	                            "lattitude"
	                        ])],
	                        target: [parseFloat(code_to_airport[leu]["longtitude"]), parseFloat(code_to_airport[
	                            leu][
	                            "lattitude"
	                        ])],
	                        date: ip,
	                        damage: cleaned_data[ip]["Aircraft damage:"],
	                        fate: cleaned_data[ip]["Aircraft fate:"],
	                        patanahikya: cleaned_data[ip]["C/n / msn:"],
	                        crew: cleaned_data[ip]["Crew:"], //: "Fatalities: 0 / Occupants: 17",
	                        engines: cleaned_data[ip]["Engines:"],
	                        firstflight: cleaned_data[ip]["First flight:"],
	                        flightnum: cleaned_data[ip]["Flightnumber:"],
	                        location: cleaned_data[ip][
	                            "Location:"
	                        ], // "Harare Airport (HRE) ( \u00a0 Zimbabwe) \n",
	                        nature: cleaned_data[ip]["Nature:"], //: "International Scheduled Passenger",
	                        operator: cleaned_data[ip]["Operator:"], //: "EgyptAir",
	                        passengers: [cleaned_data[ip]["Total:"].split("/")[0].split(" ")[1],cleaned_data[ip]["Total:"].split("/")[1].split(" ")[2]], //: "Fatalities: 0 / Occupants: 76",
	                        // crew: [cleaned_data[ip]["Crew:"].split("/")[0].split(" ")[1],cleaned_data[ip]["Passengers:"].split("/")[1].split(" ")[2]], //: "Fatalities: 0 / Occupants: 76",
	                        phase: cleaned_data[ip]["Phase:"], //: " Landing (LDG)",
	                        registration: cleaned_data[ip]["Registration:"], //: " SU-GAO",
	                        time: cleaned_data[ip]["Time:"], //: "ca 22:45",
	                        total: cleaned_data[ip]["Total:"], //: "Fatalities: 0 / Occupants: 93 ",
	                        type: cleaned_data[ip]["Type:"] //: "Boeing 767-366ER"						
	                    })

	                }
	            }
	        }
	        // console.log(links);


	        // build geoJSON features from links array
	        links.forEach(function (e, i, a) {
	            var feature = {
	                "type": "Feature",
	                "geometry": {
	                    "type": "LineString",
	                    "coordinates": [e.source, e.target]
	                }
	            }
	            arcLines.push(feature)
	        })
	        draw();
	        draw_points(bag);
	        jag = places;
	        // bag = jag;
	    }
	}


	function add_qtip() {
	    for (var i = 0; i < keys.length; i++) {
	        ip = keys[i];
	        cleaned_data = pag;
	        $("#" + keys[i]).qtip({
	            content: {
	                text: 'Date:\t' + ip.slice(0, 8) + '<br>Operator:\t' + cleaned_data[ip]["Operator:"] +
	                    '<br>Phase:\t' + cleaned_data[ip]["Phase:"] +
	                    '<br>Departure Airport:' + cleaned_data[ip]["Departure airport:"] +
	                    '<br>Destination Airport:' + cleaned_data[ip]["Destination airport:"] +
	                    '<br>Type:' + cleaned_data[ip]["Type:"]
	            },
	            style: {
	                classes: "qtip-bootstrap qtip-rounded qtip-shadow"
	            },
	            position: {
	                target: 'mouse', // my target,
	                adjust: {
	                    mouse: true
	                }
	            }
	        });
	    }
	}

	function flying_arc(pts) {
	    var source = pts.source,
	        target = pts.target;

	    var mid = location_along_arc(source, target, .5);
		var dist = d3.geoDistance(source,target);
		var result;
		if(dist >= 0.8)
		{
			result = [projection(source),sky(mid),projection(target)];
		}
		else if(dist >= 0.4)
		{
			result = [projection(source),sky2(mid),projection(target)];
		}
		else if(dist >= 0.1)
		{
			result = [projection(source),sky3(mid),projection(target)];
		}
		else
		{
			result = [projection(source),sky4(mid),projection(target)];
		}
	    // console.log((start) + "BRO RA");
		// console.log(source + "E RARARARA" + target + "E KAKAKKAKA" + "CHHUUCHUHCU \t" + dist);
		return result;
	}

	function location_along_arc(start, end, loc) {
	    var interpolator = d3.geoInterpolate(start, end);
	    return interpolator(loc)
	}


	function dragstarted() {
	    gpos0 = projection.invert(d3.mouse(this));
	    glow_gpos0 = glow_projection.invert(d3.mouse(this));
	    sgpos0 = sky.invert(d3.mouse(this));
	    s2gpos0 = sky.invert(d3.mouse(this));
	    s3gpos0 = sky.invert(d3.mouse(this));
	    s4gpos0 = sky.invert(d3.mouse(this));
	    o0 = projection.rotate();
	    glow_o0 = glow_projection.rotate();
		so0 = sky.rotate();
		s2o0 = sky.rotate();
		s3o0 = sky.rotate();
		s4o0 = sky.rotate();
		
		draw();
	    draw_points(bag);

	}

	function dragged() {
	    gpos1 = projection.invert(d3.mouse(this));
	    glow_gpos1 = glow_projection.invert(d3.mouse(this));
	    sgpos1 = sky.invert(d3.mouse(this));
	    s2gpos1 = sky.invert(d3.mouse(this));
	    s3gpos1 = sky.invert(d3.mouse(this));
	    s4gpos1 = sky.invert(d3.mouse(this));
	    o0 = projection.rotate();
	    glow_o0 = projection.rotate();
	    so0 = sky.rotate();
	    s2o0 = sky2.rotate();
	    s3o0 = sky3.rotate();
	    s4o0 = sky4.rotate();
	    o1 = eulerAngles(gpos0, gpos1, o0);
	    glow_o1 = eulerAngles(glow_gpos0, glow_gpos1, glow_o0);
	    so1 = eulerAngles(sgpos0, sgpos1, so0);
	    s2o1 = eulerAngles(s2gpos0, s2gpos1, s2o0);
	    s3o1 = eulerAngles(s3gpos0, s3gpos1, s3o0);
	    s4o1 = eulerAngles(s4gpos0, s4gpos1, s4o0);
	    projection.rotate(o1);
	    glow_projection.rotate(glow_o1);
	    sky.rotate(o1);
	    sky2.rotate(o1);
	    sky3.rotate(o1);
	    sky4.rotate(o1);

	    map.selectAll("path").attr("d", path);
	    map.selectAll(".glow").attr("d", glow_path);
	    // map.selectAll("path").remove();
	    draw();
	    draw_points(bag);

	}

	function func(item) {
	    // console.log(item);
	}

	// functions for zooming
	function zoomed() {
	    projection.scale(d3.event.transform.translate(projection).k * scl)
	    sky.scale(d3.event.transform.translate(sky).k * scale_sky)
	    sky2.scale(d3.event.transform.translate(sky2).k * scale_sky2)
	    sky3.scale(d3.event.transform.translate(sky3).k * scale_sky3)
	    sky4.scale(d3.event.transform.translate(sky4).k * scale_sky4)
	    glow_projection.scale(d3.event.transform.translate(glow_projection).k * glow_scl)
	    map.selectAll("path").attr("d", path);
	    map.selectAll(".glow").attr("d", glow_path);
	    draw();
	    draw_points(bag);
	}

	function draw_points(new_places) {
	    d3.selectAll(".points").remove();
	    svg.append("g").attr("class", "points")
	        .selectAll("text").data(new_places.features)
	        .enter().append("path")
	        .attr("class", "point")
	        .attr("d", path)
	        .attr("id", function (d) {
	            return d["properties"]["code"]
	        });
	    // .on("mouseover", function (d) {
	    // 	func(d);
	    // });
	}

	function draw() {
	    d3.selectAll(".flyers").remove();
	    d3.selectAll(".arcs").remove();
	    svg.append("g").attr("class", "arcs")
	        .selectAll("path").data(arcLines)
	        .enter().append("path")
	        .attr("class", "arc")
	        .attr("d", path)

	    svg.append("g").attr("class", "flyers")
	        .selectAll("path").data(links)
	        .enter().append("path")
	        .attr("class", "flyer")
	        .attr("d", function (d) {
	            return swoosh(flying_arc(d))
	        })
	        .attr("opacity", function (d) {
	            return fade_at_edge(d);
	        })
	        .attr("id", function (d) {
	            return d.date;
	        })
	        .on("mouseover", function (d) {
				$("#" + d.date).css("cursor", "pointer");
				console.log(d.passengers);
				var actual = cnnt *  d.passengers[0]/d.passengers[1];
				// alert(actual);
				for(var ps = 0; ps < Math.floor(actual); ps++){
					$("#" + ps + "pass").css("fill","blue");
				}
				$("#fatalities").text(d.passengers[0]);
				$("#occupants").text(d.passengers[1]);
			})
	        .on("mouseout", function (d) {
				$("#" + d.date).css("cursor", "pointer");
				for(var ps = 0; ps < cnnt; ps++){
					$("#" + ps + "pass").css("fill","grey");
				}
				$("#fatalities").text("");
				$("#occupants").text("");
			});
	    add_qtip();
	}

	function fade_at_edge(d) {
	    var centerPos = projection.invert([w / 2, h / 2]),
	        start, end;
	    // function is called on 2 different data structures..
	    if (d.source) {
	        start = d.source,
	            end = d.target;
	    } else {
	        start = d.geometry.coordinates[0];
	        end = d.geometry.coordinates[1];
	    }
	    // console.log((start) + "BRO RA");
	    var start_dist = d3.geoDistance(
	            centerPos,
	            start
	        ),
	        end_dist = d3.geoDistance(
	            centerPos,
	            end
	        );
	    var dist = start_dist > end_dist ? start_dist : end_dist;
	    // console.log("AC" + start + "\tP" + centerPos + "\tP" + end +"\t||" + start_dist + "\tL" + end_dist)
	    if (dist > 1.57) { // on the other side of the globe
	        return 0.0005;
	    } else {
	        return (1 - (dist / (1.5 * 1.57)));
	    }
	}
	function myFunction(){
		var x = document.getElementById("mySelect").value;
		d3.selectAll(".land").remove();
		d3.selectAll(".ocean").remove();
		d3.selectAll(".boundary").remove();
		d3.selectAll(".glow").remove();
		d3.selectAll(".flyers").remove();
		d3.selectAll(".arcs").remove();
		d3.selectAll(".coverbox").remove();

		draw_globe(x);
	}
	myFunction();