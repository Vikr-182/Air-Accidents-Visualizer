var width = 1250,
    height = 600,
    radius = 6;



var svg2 = d3.select("#my_anna").append("svg")
    .attr("width", width)
    .attr("height", height + 100);

var middl = height / 1.7;
var init = {
    " Taxi (TXI)": {
        "start": 0,
        "next": 0,
        "width": 10,
        "xst": 0,
        "xwid": width / 7,
        "k": 0
    },
    " Takeoff (TOF)": {
        "start": 0,
        "next": 100,
        "width": 100,
        "xst": width / 7,
        "xwid": width / 7,
        "k": 1
    },
    " Initial climb (ICL)": {
        "start": 100,
        "next": middl,
        "width": 100,
        "xst": 2 * width / 7,
        "xwid": width / 7,
        "k": 2
    },
    " En route (ENR)": {
        "start": middl,
        "next": middl,
        "width": 150,
        "xst": 3 * width / 7,
        "xwid": width / 7,
        "k": 3
    },
    " Approach (APR)": {
        "start": 100,
        "next": middl,
        "width": 100,
        "xst": 4 * width / 7,
        "xwid": width / 7,
        "k": 4
    },
    " Landing (LDG)": {
        "start": 0,
        "next": 100,
        "width": 150,
        "xst": 5 * width / 7,
        "xwid": width / 7,
        "k": 5
    },
    " Kyra": {
        "start": 0,
        next: 0,
        "width": 20,
        "xst": 6 * width / 7,
        "xwid": width / 7,
        "k": 6
    }
}


queue()
    .defer(d3.json, "../assets/static/graph.json")
    .defer(d3.json, "../data/cleaned_data.json")
    .await(ready)


function give_me_x(phase) {
    if (!Object.keys(init).includes(phase)) {
        phase = " Kyra"
    }
    return [init[phase]["xst"], init[phase]["xwid"]]
}

function give_me_y(x, k, phase) {
    if (!Object.keys(init).includes(phase)) {
        phase = " Kyra";
    }
    if (k == 0 || k == 3 || k == 6) {
        // taxi or enroute, return y = c
        return [init[phase]["start"], init[phase]["start"] + init[phase]["width"]]
    } else if (k == 1 || k == 5) {
        // takeoff or landing , return y = a . x^2 
        x = x - width / 7;
        var a = init[phase]["next"] * 49 / (width * width);
        var y = a * x * x;
        return [y, y + init[phase]["width"]];
    } else {
        // climb or approach phase, return y = - a. (x - 2*x0) * x
        x = x - 2 * width / 7;
        x0 = width / 7;
        a = (init[phase]["next"] - init[phase]["start"]) / (width / 7 * (width / 7 - 2 * x0));
        y = a * (x - 2 * x0) * x;
        return [y + init[phase]["start"], y + init[phase]["start"] + init[phase]["width"]];
    }
}

var ground = height;
var colors = ["#ffb3b5", "#ed7275", "#ff454a", "#eb2126"];
var array = {
    " Substantial": 1,
    " Destroyed": 3,
    " Damaged beyond repair": 2,
    " None": 0,
    " Minor": 0,
    " Unkown": 3,
    " Missing": 3
};

function ready(error, graph, data_ra) {

    if (error) throw error;
    var ll;
    var new_graph = new Array(0);
    var kera = [];
    var gera = [];
    for (ll in data_ra) {
        if (data_ra[ll]["date"].slice(0, 4) == "2001" || data_ra[ll]["date"].slice(0, 4) == "2000" || data_ra[ll]["date"].slice(0, 4) == "2002" || data_ra[ll]["date"].slice(0, 4) == "2003") {
            kera.push(data_ra[ll]["date"]);
            gera.push({
                "name": data_ra[ll]["date"],
                "total": (data_ra[ll]["Total:"]).split("/"),
                "fatalities": parseInt(data_ra[ll]["Total:"].split("/")[1].split(" ")[2]),
                "occupants": parseInt(data_ra[ll]["Total:"].split("/")[0].split(" ")[1]),
                "phase": data_ra[ll]["Phase:"],
                "damage": data_ra[ll]["Aircraft damage:"],
                "date": data_ra[ll]["date"],
                "operator": data_ra[ll]["Operator:"],
                "phase":data_ra[ll]["Phase:"]
            })
            new_graph.push({
                "name": data_ra[ll]["date"],
                "total": (data_ra[ll]["Total:"]).split("/"),
                "fatalities": parseInt(data_ra[ll]["Total:"].split("/")[1].split(" ")[2]),
                "occupants": parseInt(data_ra[ll]["Total:"].split("/")[0].split(" ")[1]),
                "phase": data_ra[ll]["Phase:"],
                "damage": data_ra[ll]["Aircraft damage:"],
                "date": data_ra[ll]["date"],
                "operator": data_ra[ll]["Operator:"],
                "phase":data_ra[ll]["Phase:"]
            });
        }
    }
    var maxi = d3.max(new_graph, function (d) {
        return d["fatalities"]
    });
    for (var j = 0; j < ((new_graph.length)); j++) {
        new_graph[j]["radius"] = 4 + 20 * new_graph[j]["fatalities"] / maxi;
    }
    // console.log(new_graph)
    var node = svg2.selectAll("circle")
        .data(new_graph)
        .enter().append("circle")
        .attr("r", function (d) {
            return d["radius"];
        })
        .style("fill", function (d) {
            if (array[d["damage"]] == undefined) {
                console.log(d["damage"]);
                return colors[0];
            }
            return colors[array[d["damage"]]];
        })
        .style("stroke", "black")
        .style("opacity", "0.8")
        .attr("id", function (d) {
            return d["date"] + "MANNA";
        })
        .on("mouseover", high)
        .on("mouseout", unhigh)

    var collisionForce = d3.forceCollide(12);
    var simulation = d3.forceSimulation()
        .force("charge", d3.forceManyBody().strength(-20))
        .force("collision", collisionForce.radius(function (d) {
            return d["radius"];
        }))
        .nodes(new_graph)
        .on("tick", tick);

    function high() {
        // alert("RARA");
        $(this).css("cursor", "pointer");
        
        for (var sz = 0; sz < kera.length; sz++) {
            $("#" + kera[sz] + "MANNA").css("opacity", "0.3");
        }
        $(this).css("opacity", "1");
        // return tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px").style("display","block").text(
        //             'Date:\t' + $(this)["date"] + '\n Operator:\t' + $(this)["operator"] +
        //              '<br>Phase:\t' + $(this)["phase"] +
        //             '<br>Fatalities:' + $(this)["fatalities"] +
        //              '<br>Occupants:' + $(this)["occupants"] +
        //              '<br>Damage:' + $(this)["damage"]);

    }

    function unhigh() {
        for (var sz = 0; sz < kera.length; sz++) {
            $("#" + kera[sz] + "MANNA").css("opacity", "0.8");
        }
    }

    for (var sz = 0; sz < gera.length; sz++) {

        $( "#" + gera[sz]["date"] + "MANNA").qtip({
            content: {
                text: "Operator: " + gera[sz]["operator"]
                + "<br>Phase: " + gera[sz]["phase"]
                + "<br>Damage: " + gera[sz]["damage"]
                + "<br>Fatalities: " + gera[sz]["fatalities"]
                + "<br>Occupants: " + gera[sz]["occupants"]
                + "<br>Date:" + gera[sz]["date"]
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


    function tick() {
        node.attr("cx", function (d) {
                // console.log(give_me_x(d["phase"]));
                d.x = Math.max(give_me_x(d["phase"])[0] + radius, Math.min(give_me_x(d["phase"])[0] + give_me_x(d["phase"])[1] - radius, d.x));
                if (d.x == (give_me_x(d["phase"])[0] + radius) || d.x == give_me_x(d["phase"])[0] + give_me_x(d["phase"])[1] - radius) {
                    // place it randomly
                    //  alert(give_me_x(d["phase"])[0] + radius  + Math.random()*width/7);
                    return d.x = give_me_x(d["phase"])[0] + radius + Math.random() * width / 7;
                }
                return d.x;
            })
            .attr("cy", function (d) {
                xx = d.x;
                if (d['phase'] == " Taxi (TXI)") {
                    // console.log("iffing at =** ") 
                    // alert(give_me_y(xx,0,d["phase"])[1]);
                    d.y = Math.min(ground - give_me_y(xx, 0, d["phase"])[0] - radius, Math.max(ground - give_me_y(xx, 0, d["phase"])[1] - radius, d.y));
                    if (d.y == ground - give_me_y(xx, 0, d["phase"])[0] - radius || d.y == ground - give_me_y(xx, 0, d["phase"])[1] - radius) {
                        d.y = ground - give_me_y(xx, 0, d["phase"])[0] - radius - Math.random() * (give_me_y(xx, 0, d["phase"])[1] - give_me_y(xx, 0, d["phase"])[0]);
                    }
                    return d.y;
                }
                if (d['phase'] == " Takeoff (TOF)") {
                    // console.log("iffing at =** ")
                    d.y = Math.min(ground - give_me_y(xx, 1, d["phase"])[0] - radius, Math.max(ground - give_me_y(xx, 1, d["phase"])[1] - radius, d.y));
                    if (d.y == ground - give_me_y(xx, 1, d["phase"])[0] - radius || d.y == ground - give_me_y(xx, 1, d["phase"])[1] - radius) {
                        d.y = ground - give_me_y(xx, 1, d["phase"])[0] - radius - Math.random() * (give_me_y(xx, 1, d["phase"])[1] - give_me_y(xx, 1, d["phase"])[0]);
                    }
                    return d.y;
                }
                if (d['phase'] == " Initial climb (ICL)") {
                    // console.log("iffing at =** ") 
                    d.y = Math.min(ground - give_me_y(xx, 2, d["phase"])[0] - radius, Math.max(ground - give_me_y(xx, 2, d["phase"])[1] - radius, d.y));
                    if (d.y == ground - give_me_y(xx, 2, d["phase"])[0] - radius || d.y == ground - give_me_y(xx, 2, d["phase"])[1] - radius) {
                        d.y = ground - give_me_y(xx, 2, d["phase"])[0] - radius - Math.random() * (give_me_y(xx, 2, d["phase"])[1] - give_me_y(xx, 2, d["phase"])[0]);
                    }
                    return d.y; //= Math.min(ground - give_me_y(xx,2,d["phase"])[0] - radius, Math.max(ground - give_me_y(xx,2,d["phase"])[1] - radius,d.y));
                }
                if (d['phase'] == " En route (ENR)") {
                    // console.log("iffing at =** ") 
                    d.y = Math.min(ground - give_me_y(xx, 3, d["phase"])[0] - radius, Math.max(ground - give_me_y(xx, 3, d["phase"])[1] - radius, d.y));
                    if (d.y == ground - give_me_y(xx, 3, d["phase"])[0] - radius || d.y == ground - give_me_y(xx, 3, d["phase"])[1] - radius) {
                        d.y = ground - give_me_y(xx, 3, d["phase"])[0] - radius - Math.random() * (give_me_y(xx, 3, d["phase"])[1] - give_me_y(xx, 3, d["phase"])[0]);
                    }
                    return d.y;
                }
                if (d['phase'] == " Approach (APR)") {
                    // console.log("iffing at =** ") 
                    xx = width - xx;
                    d.y = Math.min(ground - give_me_y(xx, 4, d["phase"])[0] - radius, Math.max(ground - give_me_y(xx, 4, d["phase"])[1] - radius, d.y));
                    if (d.y == ground - give_me_y(xx, 4, d["phase"])[0] - radius || d.y == ground - give_me_y(xx, 4, d["phase"])[1] - radius) {
                        d.y = ground - give_me_y(xx, 4, d["phase"])[0] - radius - Math.random() * (give_me_y(xx, 4, d["phase"])[1] - give_me_y(xx, 4, d["phase"])[0]);
                    }
                    return d.y;
                }
                if (d['phase'] == " Landing (LDG)") {
                    // console.log("iffing at =** ") 
                    xx = width - xx;
                    d.y = Math.min(ground - give_me_y(xx, 5, d["phase"])[0] - radius, Math.max(ground - give_me_y(xx, 5, d["phase"])[1] - radius, d.y));
                    if (d.y == ground - give_me_y(xx, 5, d["phase"])[0] - radius || d.y == ground - give_me_y(xx, 5, d["phase"])[1] - radius) {
                        d.y = ground - give_me_y(xx, 5, d["phase"])[0] - radius - Math.random() * (give_me_y(xx, 5, d["phase"])[1] - give_me_y(xx, 5, d["phase"])[0]);
                    }
                    return d.y;
                } else {
                    xx = width - xx;
                    d.y = Math.min(ground - give_me_y(xx, 6, d["phase"])[0] - radius, Math.max(ground - give_me_y(xx, 6, d["phase"])[1] - radius, d.y));
                    if (d.y == ground - give_me_y(xx, 6, d["phase"])[0] - radius || d.y == ground - give_me_y(xx, 6, d["phase"])[1] - radius) {
                        d.y = ground - give_me_y(xx, 6, d["phase"])[0] - radius - Math.random() * (give_me_y(xx, 6, d["phase"])[1] - give_me_y(xx, 6, d["phase"])[0]);
                    }
                    return d.y;
                }


            });

    }
    var tooltip = d3.select("body")
.append("div")
.style("position", "absolute")
.style("font-family", "sans-serif")
.style("font-size", "10px")
.style("z-index", "10")
.style("display", "none")
.attr("id","yaar")
;
};
// var start = 0;
var interval = 20;
svg2
    .append("polygon")
    .attr("points", (width / 7).toString() + "," + (ground).toString() + " " + (2 * width / 7).toString() + "," + (ground).toString() + " " + (2 * width / 7 - 10).toString() + "," + (ground + 30).toString() + " " + (1 * width / 7 - 10).toString() + "," + (ground + 30).toString())
    .attr("fill", "black"); //runway
svg2
    .append("polygon")
    .attr("points", (width / 7 - 4).toString() + "," + (ground + 2).toString() + " " + (2 * width / 7 - 2).toString() + "," + (ground + 2).toString() + " " + (2 * width / 7 - 2).toString() + "," + (ground + 4).toString() + " " + (1 * width / 7 - 4).toString() + "," + (ground + 4).toString())
    .attr("fill", "white") //upper stripe
svg2
    .append("polygon")
    .attr("points", (width / 7 - 8).toString() + "," + (ground + 25).toString() + " " + (2 * width / 7 - 8).toString() + "," + (ground + 25).toString() + " " + (2 * width / 7 - 9).toString() + "," + (ground + 27).toString() + " " + (1 * width / 7 - 9).toString() + "," + (ground + 27).toString())
    .attr("fill", "white") //lower stripe
svg2
    .append("polygon")
    .attr("points", (5 * width / 7).toString() + "," + (ground).toString() + " " + (6 * width / 7).toString() + "," + (ground).toString() + " " + (6 * width / 7 + 10).toString() + "," + (ground + 30).toString() + " " + (5 * width / 7 + 10).toString() + "," + (ground + 30).toString())
    .attr("fill", "black"); //runway
svg2
    .append("polygon")
    .attr("points", (5 * width / 7 + 1).toString() + "," + (ground + 2).toString() + " " + (6 * width / 7 + 4).toString() + "," + (ground + 2).toString() + " " + (6 * width / 7 + 4).toString() + "," + (ground + 4).toString() + " " + (5 * width / 7 + 1).toString() + "," + (ground + 4).toString())
    .attr("fill", "white"); //upper stripe
svg2
    .append("polygon")
    .attr("points", (5 * width / 7 + 8).toString() + "," + (ground + 25).toString() + " " + (6 * width / 7 + 8).toString() + "," + (ground + 25).toString() + " " + (6 * width / 7 + 9).toString() + "," + (ground + 27).toString() + " " + (5 * width / 7 + 9).toString() + "," + (ground + 27).toString())
    .attr("fill", "white"); //lower stripe

svg2
    .append("polygon")
    .attr("points", (10).toString() + "," + (ground - 80).toString() + " " + (90).toString() + "," + (ground - 80).toString() + " " + (70).toString() + "," + (ground - 50).toString() + " " + (30).toString() + "," + (ground - 50).toString())
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("stroke-linecap", "rounded")
    .attr("class", "towerglass"); //tower -> glass
// .style()

svg2
    .append("polygon")
    .attr("points", (70).toString() + "," + (ground - 50).toString() + " " + (30).toString() + "," + (ground - 50).toString() + " " + (30).toString() + "," + (ground).toString() + " " + (70).toString() + "," + (ground).toString())
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("stroke-linecap", "rounded")
    .attr("class", "towerglass"); //tower -> base

svg2
    .append("polygon")
    .attr("points", (width - 10).toString() + "," + (ground - 80).toString() + " " + (width - 90).toString() + "," + (ground - 80).toString() + " " + (width - 70).toString() + "," + (ground - 50).toString() + " " + (width - 30).toString() + "," + (ground - 50).toString())
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("stroke-linecap", "rounded")
    .attr("class", "towerglass"); //tower -> glass
// .style()

svg2
    .append("polygon")
    .attr("points", (width - 70).toString() + "," + (ground - 50).toString() + " " + (width - 30).toString() + "," + (ground - 50).toString() + " " + (width - 30).toString() + "," + (ground).toString() + " " + (width - 70).toString() + "," + (ground).toString())
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("stroke-linecap", "rounded")
    .attr("class", "towerglass"); //tower -> base

for (var start = 0; start < width / 7; start += 2 * interval) {
    svg2
        .append("polygon")
        .attr("points", (width / 7 - 5 + start).toString() + "," + (ground + 13.5).toString() + " " + (width / 7 - 5 + start + interval).toString() + "," + (ground + 13.5).toString() + " " + (width / 7 - 5 + start + interval - 1).toString() + "," + (ground + 16).toString() + " " + (width / 7 - 5 + start - 1).toString() + "," + (ground + 16).toString())
        .attr("fill", "white") // dashes 
        .attr("class", "rasca")
    svg2
        .append("polygon")
        .attr("points", (5 * width / 7 + 5 + start).toString() + "," + (ground + 13.5).toString() + " " + (5 * width / 7 + 5 + start + interval).toString() + "," + (ground + 13.5).toString() + " " + (5 * width / 7 + 5 + start + interval - 1).toString() + "," + (ground + 16).toString() + " " + (5 * width / 7 + 5 + start - 1).toString() + "," + (ground + 16).toString())
        .attr("fill", "white") //dashes
        .attr("class", "ralla")
}

svg2
    .append("polygon")
    .attr("points", (0).toString() + "," + (ground).toString() + " " + (7 * width / 7).toString() + "," + (ground).toString() + " " + (7 * width / 7).toString() + "," + (ground + 2).toString() + " " + (0).toString() + "," + (ground + 2).toString())
    .attr("fill", "black"); //runway

var x_arr = [];
x_arr.push([0,0])
x_arr.push([width/7,0])
x_arr.push([0,0])
x_arr.push([0,0])
x_arr.push([0,0])
x_arr.push([0,0])
x_arr.push([0,0])

var string = "M 0,0";
for(var jk = 1;jk < x_arr.length; jk++){
    string += "L" + x_arr[jk][0].toString() + "," +  x_arr[jk][1].toString();
}

var keyss = Object.keys(init);
var xxes = [];
for(var bf = 0;bf < width;bf += 0.5){
    xxes.push(bf);
}
for(var jp = 0;jp < xxes.length;jp++){
    
}
for(var gt = 0;gt < width;gt += width/7){
    svg2
    .append("line")
    .attr("x1",gt)
    .attr("y1",10)
    .attr("x2",gt)
    .attr("y1",ground)
    .style("stroke","grey")
    .style("stroke-width",3)
    .style("stroke-dasharray","15, 6")
    svg2
    .append("text")
    .attr("x",width/25 + gt)
    .attr("y",ground/15)
    .text(keyss[Math.floor(gt*7/width)])
    // .attr()

}


// define the line
var valueline = d3.line()
    .x([1, 20, 50])
    .y([1, 20, 50]);

svg2.append("path")
    .attr("class", "line")
    .attr("d", valueline);

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}


