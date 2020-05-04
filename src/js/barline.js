function draw_barline(){
var dataset = [
    ["2000",1.68,22008658],
    ["2001",1.62,22264220],
    ["2002",1.59,20817389],
    ["2003",1.13,21282617],
    ['2004',1.35,23752616],
    ['2005',1.40,24228965],
    ["2006",0.97,24843166],
    ["2007",1.15,26016011],
    ["2008",1.02,25498093],
    ["2009",0.88,26120525],
    ["2010",0.91,29637587],
    ["2011",1.05,30564579],
    ["2012",0.58,30771268],
    ["2013",0.74,31116727],
    ["2014",0.56,32340000],
    ["2015",0.30,33272000],
    ["2016",0.46,34579000],
    ["2017",0.28,36348000],
    ["2018",0.37,37795000],
    ["2019",0.51,39016500],
    ];

    var margin6 = { top: 20, right: 40, bottom: 50, left: 100 },
        width6 = get_width(12)/1.5,
        height6 = 300;

    var xScale = d3.scaleBand()
        .rangeRound([0, width6])
        .padding(0.1)
        .domain(dataset.map(function (d) {
            return d[0];
        }));
    yScale = d3.scaleLinear()
        .rangeRound([height6, 0])
        .domain([0, d3.max(dataset, (function (d) {
            return d[2];
        }))]);

    y1Scale = d3.scaleLinear()
        .rangeRound([height6, 0])
        .domain([0, d3.max(dataset, (function (d) {
            return d[1];
        }))]);


    var svg6 = d3.select("#bar_line").append("svg")
        .attr("width", width6 + margin6.left + margin6.right)
        .attr("height", height6 + margin6.top + margin6.bottom)
        .attr("viewBox","0 0 " + (width6).toString() + (height6).toString())
        .attr("id","barline")
        .attr("preserveAspectRatio","none")

        ;

    var g = svg6.append("g")
        .attr("transform", "translate(" + margin6.left + "," + margin6.top + ")");

    // axis-x
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height6 + ")")
        .call(d3.axisBottom(xScale));

    // axis-y
    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yScale));

    // g.append("g")
    //     .attr("class", "axis axis--y")
    //     .call(d3.axisRight(y1Scale));





    var y_axis = d3.axisRight()
            .scale(y1Scale);
        var rannarara = window.innerWidth < 800 ?  (get_width(12)*1.17/1.5).toString() : (get_width(12)*1.1/1.5).toString() ;
    svg6.append("g")
        .attr("transform", "translate("  + (rannarara).toString() + ", 20)")
        .call(y_axis);


    var bar = g.selectAll("rect")
        .data(dataset)
        .enter().append("g");

    var fnt = 0;
    // bar chart
    bar.append("rect")
        .attr("x", function (d) { return xScale(d[0]); })
        .attr("y", function (d) { return yScale(d[2]); })
        .attr("width", xScale.bandwidth()/1.4)
        .attr("height", function (d) { return height6 - yScale(d[2]); })
        .attr("class", function (d) {
            var s = "bar ";
            if (d[1] < 400) {
                return s + "bar1";
            } else if (d[1] < 800) {
                return s + "bar2";
            } else {
                return s + "bar3";
            }
        })
        .attr("id", function(d){ 
            fnt++;
            return "bar_" + fnt ;
        })
        ;

    // labels on the bar chart
    bar.append("text")
        .attr("dy", "1.3em")
        .attr("x", function (d) { return -yScale(d[2])-35; })
        // 
        .attr("y", function (d) { return xScale(d[0]) + xScale.bandwidth() / 2; })
        .attr("text-anchor", "middle")
        .attr("transform","rotate(-90)")
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "black")
        .text(function (d) {
            return d[2];
        });

    // line chart
    var line = d3.line()
        .x(function (d, i) { return xScale(d[0]) + xScale.bandwidth() / 2; })
        .y(function (d) { return y1Scale(d[1]); })
        .curve(d3.curveMonotoneX);

    bar.append("path")
        .attr("class", "line") // Assign a class for styling
        .attr("d", line(dataset)); // 11. Calls the line generator

    bar.append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function (d, i) { return xScale(d[0]) + xScale.bandwidth() / 2; })
        .attr("cy", function (d) { return y1Scale(d[1]); })
        .attr("r", 5);

    svg6.append("text")
    .attr("x",width6/2)
    .attr("y",height6*1.18)
    .text("Years")

    svg6.append("text")
    .attr("x",margin6.left)
    .attr("y",margin6.bottom)
    .text("Number of departures")
    .attr("transform","rotate(270,60,100)")

    svg6.append("text")
    .attr("x",width6 -  margin6.right)
    .attr("y",margin6.bottom)
    .text("Fatal Accidents")
    .attr("transform","rotate(90," + (width6 -  margin6.right - 60).toString() + "," + (margin6.bottom + 200).toString() + ")")
    }

draw_barline()