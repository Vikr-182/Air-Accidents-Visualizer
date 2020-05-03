var swidth = window.innerWidth / 1.2,
    height = 600,
    radius = 0.00003;
var re = [
    ["2000", "2001", "2002", "2003", "2004"],
    ["2005", "2006", "2007", "2008", "2009"],
    ["2010", "2011", "2012", "2013", "2014"],
    ["2015", "2016", "2017", "2018"]
]

var current = re[0];

var svg2 = d3.select("#my_anna").append("svg")
    .attr("width", swidth)
    .attr("height", height + 100)
    .attr("id", "scatter_anna");

var middl;
var init;
var ground;
function initialize_params(){
middl = height/2;
init = {
    " Taxi (TXI)": {
        "start": 0,
        "next": 0,
        "width": 10,
        "xst": 0,
        "xwid": swidth / 7,
        "k": 0
    },
    " Takeoff (TOF)": {
        "start": 0,
        "next": 100,
        "width": 50,
        "xst": swidth / 7,
        "xwid": swidth / 7,
        "k": 1
    },
    " Initial climb (ICL)": {
        "start": 100,
        "next": middl,
        "width": 100,
        "xst": 2 * swidth / 7,
        "xwid": swidth / 7,
        "k": 2
    },
    " En route (ENR)": {
        "start": middl,
        "next": middl,
        "width": 150,
        "xst": 3 * swidth / 7,
        "xwid": swidth / 7,
        "k": 3
    },
    " Approach (APR)": {
        "start": 100,
        "next": middl,
        "width": 100,
        "xst": 4 * swidth / 7,
        "xwid": swidth / 7,
        "k": 4
    },
    " Landing (LDG)": {
        "start": 0,
        "next": 100,
        "width": 50,
        "xst": 5 * swidth / 7,
        "xwid": swidth / 7,
        "k": 5
    },
    " Kyra": {
        "start": 0,
        "next": 0,
        "width": 20,
        "xst": 6 * swidth / 7,
        "xwid": swidth / 7,
        "k": 6
    }
}


ground = height;
}
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
        x = x - swidth / 7;
        var a = init[phase]["next"] * 49 / (swidth * swidth);
        // alert(a);
        // alert(a*swidth*swidth/49);
        var y = a * x * x;
        // alert(y);
        // alert((y + init[phase]["swidth"]).toString() + "ANNNA ")
        return [y, y + init[phase]["width"]];
    } else {
        // climb or approach phase, return y = - a. (x - 2*x0) * x
        x = x - 2 * swidth / 7;
        x0 = swidth / 7;
        a = (init[phase]["next"] - init[phase]["start"]) / (swidth / 7 * (swidth / 7 - 2 * x0));
        y = a * (x - 2 * x0) * x;
        return [y + init[phase]["start"], y + init[phase]["start"] + init[phase]["width"]];
    }
}
svg2.append("circle")
    .attr("cx", 5.5 * swidth / 7)
    .attr("cy", ground - 12)
    .attr("r", 2)
    .attr("fill", "green");

// alert(ground - 12);
// alert(ground - give_me_y(width - 5.5*width/7,5," Landing (LDG)")[1]);
var kera, gera, new_graph;
var node;
var retic;
var collisionForce, simulation;
var count = 0;
var th = 0;
collisionForce = d3.forceCollide(12);
simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-20))
    .force("collision", collisionForce.radius(function (d) {
        return d["radius"];
    }))

function draw_me(want_array) {
    queue()
        .defer(d3.json, "../assets/static/graph.json")
        .defer(d3.json, "../data/cleaned_data.json")
        .await(ready)

    function ready(error, graph, data_ra) {
        retic = data_ra;
        if (error) throw error;
        done();
    }

    function done() {
        var data_ra = retic;
        var ll;
        new_graph = new Array(0);
        kera = [];
        gera = [];
        count = count + 1;
        // alert(count);
        if (count > 1) {
            var bbbbb = "ads";
            // alert("RARA" + want_array);
        }
        for (ll in data_ra) {
            if (want_array.includes(data_ra[ll]["date"].slice(0, 4))) { // == "2001" || data_ra[ll]["date"].slice(0, 4) == "2000" || data_ra[ll]["date"].slice(0, 4) == "2002" || data_ra[ll]["date"].slice(0, 4) == "2003") {
                kera.push(data_ra[ll]["date"]);
                gera.push({
                    "name": data_ra[ll]["date"],
                    "total": (data_ra[ll]["Total:"]).split("/"),
                    "occupants": parseInt(data_ra[ll]["Total:"].split("/")[1].split(" ")[2]),
                    "fatalities": parseInt(data_ra[ll]["Total:"].split("/")[0].split(" ")[1]),
                    "phase": data_ra[ll]["Phase:"],
                    "damage": data_ra[ll]["Aircraft damage:"],
                    "date": data_ra[ll]["date"],
                    "operator": data_ra[ll]["Operator:"],
                    "phase": data_ra[ll]["Phase:"]
                })
                new_graph.push({
                    "name": data_ra[ll]["date"],
                    "total": (data_ra[ll]["Total:"]).split("/"),
                    "occupants": parseInt(data_ra[ll]["Total:"].split("/")[1].split(" ")[2]),
                    "fatalities": parseInt(data_ra[ll]["Total:"].split("/")[0].split(" ")[1]),
                    "phase": data_ra[ll]["Phase:"],
                    "damage": data_ra[ll]["Aircraft damage:"],
                    "date": data_ra[ll]["date"],
                    "operator": data_ra[ll]["Operator:"],
                    "phase": data_ra[ll]["Phase:"]
                });
            }
        }
        var maxi = d3.max(new_graph, function (d) {
            return d["fatalities"]
        });
        for (var j = 0; j < ((new_graph.length)); j++) {
            new_graph[j]["radius"] = 4 + 20 * new_graph[j]["fatalities"] / maxi;
        }
        // console.log("ME CALLED + " + kera[0])
        var node = svg2.selectAll("circle")
            .data(new_graph)
            .enter().append("circle")
            .attr("r", function (d) {
                return d["radius"];
            })
            .style("fill", function (d) {
                if (array[d["damage"]] == undefined) {
                    // console.log(d["damage"]);
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

        simulation
            .nodes(new_graph)
            .on("tick", tick);

        simulation.alpha(1).restart();


        function high() {
            $(this).css("cursor", "pointer");
            // console.log($(this).attr("id"));
            for (var sz = 0; sz < kera.length; sz++) {
                $("#" + kera[sz] + "MANNA").css("opacity", "0.3");
            }
            $(this).css("opacity", "1");
        }

        function unhigh() {
            for (var sz = 0; sz < kera.length; sz++) {
                $("#" + kera[sz] + "MANNA").css("opacity", "0.8");
            }
        }

        for (var sz = 0; sz < gera.length; sz++) {

            $("#" + gera[sz]["date"] + "MANNA").qtip({
                content: {
                    text: "Operator: " + gera[sz]["operator"] +
                        "<br>Phase: " + gera[sz]["phase"] +
                        "<br>Damage: " + gera[sz]["damage"] +
                        "<br>Fatalities: " + gera[sz]["fatalities"] +
                        "<br>Occupants: " + gera[sz]["occupants"] +
                        "<br>Date:" + gera[sz]["date"]
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
        var beticho = 750 * 7;
        // alert(swidth)
        // alert((give_me_x((" Landing (LDG)"))[0]*7)/width + "OUCH DHAK DHAK KARNE L");
        function tick() {
            node.attr("cx", function (d) {
                    // console.log(give_me_x(d["phase"]));
                    d.x = Math.max(give_me_x(d["phase"])[0] + radius, Math.min(give_me_x(d["phase"])[0] + give_me_x(d["phase"])[1] - radius, d.x));
                    if (d.x == (give_me_x(d["phase"])[0] + radius) || d.x == give_me_x(d["phase"])[0] + give_me_x(d["phase"])[1] - radius) {
                        // place it randomly
                        //  alert(give_me_x(d["phase"])[0] + radius  + Math.random()*width/7);
                        if (d["phase"] == " Landing (LDG)") {
                            // alert(d.x*7/swidth + "RARARARRARTARARAR");
                        }
                        d.x = give_me_x(d["phase"])[0] + radius + Math.random() * swidth / 7;
                        if (d["phase"] == " Landing (LDG)") {
                            // alert(d.x*7/swidth + "KAKSKAKAKKAKAKAKA");
                        }
                        return d.x = give_me_x(d["phase"])[0] + radius + Math.random() * swidth / 7;
                    }
                    if (d["phase"] == " Landing (LDG)") {
                        // alert(d.x*7/swidth + "KAKAKKAKAKAKAKAKAKAKA");
                    }
                    // if(d["phase"] ==  Landing (LDG)){
                    //     alert(d.x + "RARARARRARTARARAR");
                    // }                    
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
                        xx = swidth - xx // - swidth/7;
                        d.y = Math.min(ground - give_me_y(xx, 4, d["phase"])[0] - radius, Math.max(ground - give_me_y(xx, 4, d["phase"])[1] - radius, d.y));
                        if (d.y == ground - give_me_y(xx, 4, d["phase"])[0] - radius || d.y == ground - give_me_y(xx, 4, d["phase"])[1] - radius) {
                            d.y = ground - give_me_y(xx, 4, d["phase"])[0] - radius - Math.random() * (give_me_y(xx, 4, d["phase"])[1] - give_me_y(xx, 4, d["phase"])[0]);
                        }
                        return d.y;
                    }
                    if (d['phase'] == " Landing (LDG)") {
                        // console.log("iffing at =** ") 
                        // alert(xx*7/swidth);
                        xx = swidth - xx // - swidth/7;
                        d.y = Math.min(ground - give_me_y(xx, 5, d["phase"])[0] - radius, Math.max(ground - give_me_y(xx, 5, d["phase"])[1] - radius, d.y));
                        if (d.y == ground - give_me_y(xx, 5, d["phase"])[0] - radius || d.y == ground - give_me_y(xx, 5, d["phase"])[1] - radius) {
                            // alert("earlier" + d.y);
                            d.y = ground - give_me_y(xx, 5, d["phase"])[0] - radius - Math.random() * (give_me_y(xx, 5, d["phase"])[1] - give_me_y(xx, 5, d["phase"])[0]);
                            // alert("now" + d.y);
                        }
                        return d.y - 10;
                    } else {
                        xx = swidth - xx;
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
            .attr("id", "yaar");
    };
}

function draw_polygon() {
    // var start = 0;
    var interval = 20;
    svg2
        .append("polygon")
        .attr("points", (swidth / 7).toString() + "," + (ground).toString() + " " + (2 * swidth / 7).toString() + "," + (ground).toString() + " " + (2 * swidth / 7 - 10).toString() + "," + (ground + 30).toString() + " " + (1 * swidth / 7 - 10).toString() + "," + (ground + 30).toString())
        .attr("fill", "black"); //runway
    svg2
        .append("polygon")
        .attr("points", (swidth / 7 - 4).toString() + "," + (ground + 2).toString() + " " + (2 * swidth / 7 - 2).toString() + "," + (ground + 2).toString() + " " + (2 * swidth / 7 - 2).toString() + "," + (ground + 4).toString() + " " + (1 * swidth / 7 - 4).toString() + "," + (ground + 4).toString())
        .attr("fill", "white") //upper stripe
    svg2
        .append("polygon")
        .attr("points", (swidth / 7 - 8).toString() + "," + (ground + 25).toString() + " " + (2 * swidth / 7 - 8).toString() + "," + (ground + 25).toString() + " " + (2 * swidth / 7 - 9).toString() + "," + (ground + 27).toString() + " " + (1 * swidth / 7 - 9).toString() + "," + (ground + 27).toString())
        .attr("fill", "white") //lower stripe
    svg2
        .append("polygon")
        .attr("points", (5 * swidth / 7).toString() + "," + (ground).toString() + " " + (6 * swidth / 7).toString() + "," + (ground).toString() + " " + (6 * swidth / 7 + 10).toString() + "," + (ground + 30).toString() + " " + (5 * swidth / 7 + 10).toString() + "," + (ground + 30).toString())
        .attr("fill", "black"); //runway
    svg2
        .append("polygon")
        .attr("points", (5 * swidth / 7 + 1).toString() + "," + (ground + 2).toString() + " " + (6 * swidth / 7 + 4).toString() + "," + (ground + 2).toString() + " " + (6 * swidth / 7 + 4).toString() + "," + (ground + 4).toString() + " " + (5 * swidth / 7 + 1).toString() + "," + (ground + 4).toString())
        .attr("fill", "white"); //upper stripe
    svg2
        .append("polygon")
        .attr("points", (5 * swidth / 7 + 8).toString() + "," + (ground + 25).toString() + " " + (6 * swidth / 7 + 8).toString() + "," + (ground + 25).toString() + " " + (6 * swidth / 7 + 9).toString() + "," + (ground + 27).toString() + " " + (5 * swidth / 7 + 9).toString() + "," + (ground + 27).toString())
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
        .attr("points", (swidth - 10).toString() + "," + (ground - 80).toString() + " " + (swidth - 90).toString() + "," + (ground - 80).toString() + " " + (swidth - 70).toString() + "," + (ground - 50).toString() + " " + (swidth - 30).toString() + "," + (ground - 50).toString())
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("stroke-linecap", "rounded")
        .attr("class", "towerglass"); //tower -> glass
    // .style()

    svg2
        .append("polygon")
        .attr("points", (swidth - 70).toString() + "," + (ground - 50).toString() + " " + (swidth - 30).toString() + "," + (ground - 50).toString() + " " + (swidth - 30).toString() + "," + (ground).toString() + " " + (swidth - 70).toString() + "," + (ground).toString())
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("stroke-linecap", "rounded")
        .attr("class", "towerglass"); //tower -> base

    for (var start = 0; start < swidth / 7; start += 2 * interval) {
        svg2
            .append("polygon")
            .attr("points", (swidth / 7 - 5 + start).toString() + "," + (ground + 13.5).toString() + " " + (swidth / 7 - 5 + start + interval).toString() + "," + (ground + 13.5).toString() + " " + (swidth / 7 - 5 + start + interval - 1).toString() + "," + (ground + 16).toString() + " " + (swidth / 7 - 5 + start - 1).toString() + "," + (ground + 16).toString())
            .attr("fill", "white") // dashes 
            .attr("class", "rasca")
        svg2
            .append("polygon")
            .attr("points", (5 * swidth / 7 + 5 + start).toString() + "," + (ground + 13.5).toString() + " " + (5 * swidth / 7 + 5 + start + interval).toString() + "," + (ground + 13.5).toString() + " " + (5 * swidth / 7 + 5 + start + interval - 1).toString() + "," + (ground + 16).toString() + " " + (5 * swidth / 7 + 5 + start - 1).toString() + "," + (ground + 16).toString())
            .attr("fill", "white") //dashes
            .attr("class", "ralla")
    }

    svg2
        .append("polygon")
        .attr("points", (0).toString() + "," + (ground).toString() + " " + (7 * swidth / 7).toString() + "," + (ground).toString() + " " + (7 * swidth / 7).toString() + "," + (ground + 2).toString() + " " + (0).toString() + "," + (ground + 2).toString())
        .attr("fill", "black"); //runway


    svg2
        .append("image")
        .attr("x",swidth/2)
        .attr("y","326")
        .attr("width","50")
        .attr("height","50")
        .attr("href","https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTkVHoDYQYGJe6AZZS5IKtRHtA9Bv2OupJ2dMM-tV8wlHHyKh3v&usqp=CAU")
        .attr("id","my_plane_anna");

    var x_arr = [];
    var mapp = Object.keys(init);
    for(var ttt = 1;ttt < swidth*7/7;ttt += 1.5){
        var pop = give_me_y(ttt, Math.floor(ttt*7/swidth), mapp[Math.floor(ttt*7/swidth)])
        if(ttt >= swidth*4/7){
            pop =  give_me_y(swidth - ttt, Math.floor(ttt*7/swidth), mapp[Math.floor(ttt*7/swidth)]);
        }
        if (pop[0] > 0){
            pop[0] = pop[0]/1.3;       
        }
        x_arr.push([ttt,ground - pop[0]]);
    }
    // alert(x_arr.length);
    console.log(x_arr);
    var string = "M 0," + ground;
    for (var jk = 1; jk < x_arr.length; jk++) {
        string += "L" + x_arr[jk][0].toString() + "," + x_arr[jk][1].toString();
    }

    var keyss = Object.keys(init);
    var xxes = [];
    for (var bf = 0; bf < swidth; bf += 0.5) {
        xxes.push(bf);
    }
    for (var jp = 0; jp < xxes.length; jp++) {

    }
    for (var gt = 0; gt < swidth; gt += swidth / 7) {
        svg2
            .append("line")
            .attr("x1", gt)
            .attr("y1", 10)
            .attr("x2", gt)
            .attr("y1", ground)
            .style("stroke", "grey")
            .style("stroke-width", 3)
            .style("stroke-dasharray", "15, 6") // line
        var ranna = window.innerWidth > 1350 ? 15:7;
        svg2
            .append("text")
            .attr("x", swidth / ranna + gt)
            .attr("y", ground / 15)
            .text(keyss[Math.floor(gt * 7 / swidth)])
            .attr("class","labelra")
            .attr("font-size","10em")
        // .attr()

    }

    // draw_me(["2000"]);
    // draw_me(["2018"]);
    // draw_me(["2016"]);
    // print(count);

    // define the line

    svg2.append("path")
        .attr("class", "annaship")
        .attr("d", string)
        .attr("fill-opacity","0")
        .attr("stroke","green")
        .attr("stroke-width","5")
        ;
    

}

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

function myFunction2() {
    var x = parseInt(document.getElementById("mySelect2").value);
    current = x;
    initialize_params();
    d3.selectAll("circle").remove();
    d3.selectAll("polygon").remove();
    d3.selectAll("line").remove();
    d3.selectAll(".labelra").remove();
    d3.selectAll("image").remove();
    d3.selectAll(".annaship").remove();
    draw_me(re[x]);
    draw_polygon();
}
myFunction2();