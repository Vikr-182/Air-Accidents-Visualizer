const T_VALUE = 52;

function compare(a, b) {
    if (a.value < b.value) return 1;
    if (a.value > b.value) return -1;
    return 0;
}


var margin = 100;
var width = 1300 - margin;

var height = 900 - margin;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1);

var x1 = d3.scale.ordinal()

var y = d3.scale.linear().range([height, 0]);


var color = d3.scale.ordinal()
    .range(["#ecc19c", "#5db9e3", "#ffc13b", "yellow", "#ecc19c", "#5db9e3", "#ffc13b", "#ecc19c", "#5db9e3", "#ffc13b"]);


var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));


var svg = d3.select("body").append("svg")
    .attr("width", width + margin)
    .attr("height", height + margin)
    .append("g")

    .attr("transform", "translate(" + "50,50)");





d3.csv("../hello.csv", function (data) {

    var keys = d3.keys(data[0]).filter(function (key) { return key !== "Name"; });
    console.log(keys)

    keys = ["X2011", "Y2011", "R2011"];

    data.forEach(function (d) {
        d.ages = keys.map(function (name) { return { name: name, value: +d[name] }; });
        console.log(d.ages)
    });

    x0.domain(data.map(function (d) { console.log(d.Name); return d.Name }));

    x1.domain(keys).rangeRoundBands([0, x0.rangeBand()]);
    console.log(x1.domain())

    y.domain([0, d3.max(data, function (d) { return d3.max(d.ages, function (d) { return d.value; }); })]);

    svg.append("g")
        .attr("class", "x axis")
        // .attr("transform", "rotate(-90)")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);


    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("value");





    var state = svg.selectAll(".state")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        // .attr("transform", "rotate(-90)")
        .attr("transform", function (d) { return "translate(" + x0(d.Name) + ",0)"; });




    state.selectAll(".rectu")
        .data(function (d) { console.log("yaaar anna " + d.ages); return d.ages; })
        .enter().append("rect")
        .attr("class", "rectu")
        .attr("width", x1.rangeBand())
        .attr("x", function (d) { return x1(d.name); })
        .attr("y", function (d) { console.log(y(d.value)); return y(d.value); })
        .attr("height", function (d) { return height - y(d.value); })
        .style("fill", function (d) { console.log("color here" + d.name); return color(d.name); })
        .on("mouseover.zero", function (d) {
            console.log(d.name)
            return tooltip.style("visibility", "visible").text(d.name + ": " + d.value);
        })
        .on("mouseover.one", function (d) {
            return this.style.fill = "#696969";
        })

        .on("mousemove.zero", function (d) {
            console.log("zero works too")
            return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px").text(d.name + ": " + eval("d.value"));
        })

        .on("mouseout.zero", function (d) {
            return tooltip.style("visibility", "hidden");
        })

        .on("mouseout.one", function (d) {
            console.log("==========================================")
            console.log(this);
            console.log(color[d.name]);
            return this.style.fill = color(d.name);
        });


    var legend = svg.selectAll(".legend")
        .data(keys.slice())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("circle")
        .attr("cx", width - 12)
        .attr("cy", 9)
        .attr("r", 9)
        // .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { console.log(d); return d; });






    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("font-family", "'Open Sans', sans-serif")
        .style("font-size", "12px")
        .style("z-index", "10")
        .style("visibility", "hidden");



    const buttons = d3.selectAll('input');
    buttons.on('change', function (d) {


        var year = this.value

        var bar = svg.selectAll(".rectu")
            .data(data);
        console.log(bar)
        console.log("just logged bar")

        bar.exit().remove();

        if (year == "x2011") { scalem = 5 }
        else if (year == "x2012") { scalem = 3.3333333333 }
        else if (year == "x2013") { scalem = 3.75 }

        console.log("why tbis thaidjgosfdghglfhb");
        var tex = svg.selectAll(".tick")
        //  .call(d3.axisBottom().scale(xScale))
        // .data(xScale)
        console.log(tex)
        tex.remove()


        // color = d3.scale.ordinal()
        //     .range(["#ecc19c", "#5db9e3", "#ffc13b"]);

        keys = ["X" + year, "Y" + year, "R" + year];

        data.forEach(function (d) {
            d.ages = keys.map(function (name) { return { name: name, value: +d[name] }; });
            console.log(d.ages)
        });

        x0.domain(data.map(function (d) { console.log(d.Name); return d.Name }));

        x1.domain(keys).rangeRoundBands([0, x0.rangeBand()]);
        console.log(x1.domain())

        y.domain([0, d3.max(data, function (d) { return d3.max(d.ages, function (d) { return d.value; }); })]);



        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);


        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("");





        var state = svg.selectAll(".state")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function (d) { return "translate(" + x0(d.Name) + ",0)"; });


        console.log("new y")






        state.selectAll(".rectu")
            .data(function (d) { console.log("yaaar anna " + d.ages); return d.ages; })
            .enter().append("rect")
            .on("mouseover.zero", function (d) {
                console.log(d.name)
                return tooltip.style("visibility", "visible").text(d.name + ": " + d.value);
            })
            .on("mouseover.one", function (d) {
                return this.style.fill = "#696969";
            })

            .on("mousemove.zero", function (d) {
                console.log("zero works too")
                return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px").text(d.name + ": " + eval("d.value"));
            })

            .on("mouseout.zero", function (d) {
                return tooltip.style("visibility", "hidden");
            })

            .on("mouseout.one", function (d) {
                console.log("==========================================")
                console.log(this);
                console.log(color[d.name]);
                return this.style.fill = color(d.name);
            });


        var lolol = svg.selectAll("rect")

        lolol.transition()
            .duration(00)
            .attr("width", x1.rangeBand())
            .attr("class", "rectu")
            .attr("x", function (d) { console.log("name ra " + x1(d.name)); return x1(d.name); })
            .attr("y", function (d) { console.log((d.value)); return y(d.value); })
            .attr("height", function (d) { return height - y(d.value); })
            .style("fill", function (d) { return color(d.name); });



        console.log("nothing so far")
        var legend = svg.selectAll(".legend")
        console.log(legend)
        legend.remove()


        legend = svg.selectAll(".legend")
            .data(keys)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) { console.log(i); return "translate(0," + i * 20 + ")"; });

        console.log("nothing so far")
        legend.append("circle")
            .attr("cx", width - 12)
            .attr("cy", 9)
            .attr("r", 9)
            // .attr("height", 18)
            .style("fill", color);


        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) { console.log(d); return d; });

        console.log("nothing so far")




    });

    console.log(data)
    

});
