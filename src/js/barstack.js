
function compare(a, b) {
    if (a.value < b.value) return 1;
    if (a.value > b.value) return -1;
    return 0;
}



//var datas = []

//var length = 0

var svg7 = d3.select("#bar_stack");

var margin7 = 200;
var width7 = svg7.attr("width") - margin7;

var height7 = svg7.attr("height") - margin7;

var xScale = d3.scaleBand().range([0, width7]).padding(0.4);

var yScale = d3.scaleLinear().range([height7, 0]);

var yr = "2012"
var g = svg7.append("g").attr("transform", "translate(" + 100 + "," + 100 + ")");
d3.csv("../../data/stack.csv", function (data) {


    yr = "2011"


    var a2011 = []
    var a2012 = []
    var a2013 = []

    var length = data.length
    //console.log(length)
    //console.log("catty")

    for (var i = 0; i < data.length; i++) {
        //console.log(data[i].year);

        var person = { Name: data[i].Name, xval: data[i].X2011, yval: data[i].Y2011, rval: data[i].R2011 };
        var person1 = { Name: data[i].Name, xval: data[i].X2012, yval: data[i].Y2012, rval: data[i].R2012 };
        var person2 = { Name: data[i].Name, xval: data[i].X2013, yval: data[i].Y2013, rval: data[i].R2013 };

        a2011.push(person)
        a2012.push(person1)
        a2013.push(person2)
        // console.log(data[i].value);
    }

    // console.log(Array.isArray(eval("a" + yr)))

    // console.log(eval("a" + yr).length)

    //datas.sort(function(a, b){if});

    eval("a" + yr).sort(function (a, b) {
        if (a.value < b.value) return 1;
        if (a.value > b.value) return -1;
        return 0;
    });

    for (var i = 0; i < eval("a" + yr).length; i++) {

        // console.log(eval("a" + yr).X2011)
        // console.log(eval("a" + yr).Name)


    }


    xScale.domain(data.map(function (d) { return d.Name; }));

    yScale.domain([0, d3.max(data, function (d) {
        // console.log(+eval("d.X" + yr) + +eval("d.Y" + yr) + +eval("d.Y" + yr) + +eval("d.R" + yr));
        return (+eval("d.X" + yr) + +eval("d.Y" + yr) + +eval("d.R" + yr));
    })]);

    //xScale.domain()

    //yScale.domain([0, 200]);



    svg7.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", 50)
        .attr("y", 50)
        .attr("font-size", "24px")
        .text("")



    var xaxis = g.append("g").call(d3.axisBottom().scale(xScale)).attr("transform", "translate(0," + height7 + ")");

    xaxis.append("text")
        .attr("y", height7 - 250)
        .attr("x", width7 - 100)
        .attr("text-anchor", "end")
        .attr("stroke", "blue")
        .text("Year");

    var yaxis = g.append("g").call(d3.axisLeft().scale(yScale).tickFormat(function (d) {
        return d;
    }).ticks(25));

    yaxis.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "blue")
        .text("");
    //.attr

    xaxis.selectAll("text").style("stroke", "blue");

    yaxis.selectAll("text").style("stroke", "blue");

    xaxis.selectAll("line").style("stroke", "purple");

    yaxis.selectAll("line").style("stroke", "green");


    //very important floating bars

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("fill", "yellow")
        .attr("x", function (d) { return xScale(d.Name); })
        .attr("y", function (d) {  return yScale(+eval("d.X" + yr) + +eval("d.Y" + yr) + +eval("d.R" + yr)); })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) { return height7 - +yScale(eval("d.R" + yr)); })
        .on("mouseover.one", function (d) {
            return tooltip.style("visibility", "visible").text(d.Name + ": " + eval("d.R" + yr));
        })
        .on("mouseover.two", function (d) {
            return this.style.fill = "#696969";
        })
        .on("mousemove", function (d) {
            return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px").text(d.Name + ":R: " + eval("d.R" + yr));
        })
        .on("mouseout.one", function (d) {
            return tooltip.style("visibility", "hidden");
        })
        .on("mouseout.two", function (d) {
            return this.style.fill = "yellow";
        });



    var gg = g.selectAll(".bar1");


    gg.data(data)
        .enter().append("rect")
        .attr("id", "#bar1")
        .attr("fill", "steelblue")
        .attr("class", "bar1")
        .attr("x", function (d) { return xScale(d.Name); })
        .attr("y", function (d) { return yScale(+eval("d.X" + yr) + +eval("d.Y" + yr)); })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) { return height7 - yScale(eval("d.Y" + yr)); })
        .on("mouseover.one", function (d) {
            return tooltip.style("visibility", "visible").text(d.Name + ": " + eval("d.Y" + yr));
        })
        .on("mouseover.two", function (d) {
            return this.style.fill = "#696969";
        })
        .on("mousemove", function (d) {
            return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px").text(d.Name + ":Y " + eval("d.Y" + yr));
        })
        .on("mouseout.one", function (d) {
            return tooltip.style("visibility", "hidden");
        })
        .on("mouseout.two", function (d) {
            return this.style.fill = "steelblue";
        });







    var ggg = g.selectAll(".bar2");


    ggg.data(data)
        .enter().append("rect")
        .attr("id", "#bar2")
        .attr("class", "bar2")
        .attr("fill", "orange")
        .attr("x", function (d) { return xScale(d.Name); })
        .attr("y", function (d) { return yScale(+eval("d.X" + yr)); })
        .attr("width", xScale.bandwidth())
        .attr("height", function (d) { return height7 - yScale(eval("d.X" + yr)); })
        .on("mouseover.one", function (d) {
            return tooltip.style("visibility", "visible").text(d.Name + ": " + eval("d.X" + yr));
        })
        .on("mouseover.two", function (d) {
            return this.style.fill = "#696969";
        })
        .on("mousemove", function (d) {
            return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px").text(d.Name + ":X " + eval("d.X" + yr));
        })
        .on("mouseout.onw", function (d) {
            return tooltip.style("visibility", "hidden");
        })
        .on("mouseout.two", function (d) {
            return this.style.fill = "orange";
        })
        ;


    var legend = svg7.selectAll(".legend")
        .data(["R", "Y", "X"])
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("circle")
        .attr("cx", width7 + 100)
        .attr("cy", 9)
        .attr("r", 9)
        // .attr("height", 18)
        .style("fill", function (d) {
            if (d == "R")
                return "yellow";
            else if (d == "Y")
                return "steelblue";
            else
                return "orange";
        });

    legend.append("text")
        .attr("x", width7 + 100 - 12)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) {
             return d; });











    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("font-family", "'Open Sans', sans-serif")
        .style("font-size", "12px")
        .style("z-index", "10")
        .style("visibility", "hidden");


    const buttons = d3.selectAll('input');
    buttons.on('change', function (d) {


        yr = this.value

        var bar = g.selectAll(".bar")
            .data(data);
        // console.log(bar)

        bar.exit().remove();//remove unneeded circles

        var bar1 = g.selectAll(".bar1")
            .data(data);
        // console.log(bar1)

        bar1.exit().remove();//remove unneeded circles


        var bar2 = g.selectAll(".bar2")
            .data(data);
        // console.log(bar2)

        bar2.exit().remove();//remove unneeded circles



        xScale.domain(data.map(function (d) { return d.Name; }));

        yScale.domain([0, d3.max(data, function (d) {
            // console.log(+eval("d.X" + yr) + +eval("d.Y" + yr) + +eval("d.Y" + yr) + +eval("d.R" + yr));
            return (+eval("d.X" + yr) + +eval("d.Y" + yr) + +eval("d.R" + yr));
        })]);











        // console.log("why tbis thaidjgosfdghglfhb");
        var tex = g.selectAll(".tick")
        //  .call(d3.axisBottom().scale(xScale))
        // .data(xScale)
        // console.log(tex)
        tex.remove()




        svg7.append("text")
            .attr("transform", "translate(100,0)")
            .attr("x", 50)
            .attr("y", 50)
            .attr("font-size", "24px")
            .text("")



        var xaxis = g.append("g").call(d3.axisBottom().scale(xScale)).attr("transform", "translate(0," + height7 + ")");

        xaxis.append("text")
            .attr("y", height7 - 250)
            .attr("x", width7 - 100)
            .attr("text-anchor", "end")
            .attr("stroke", "blue")
            .text("Year");

        var yaxis = g.append("g").call(d3.axisLeft().scale(yScale).tickFormat(function (d) {
            return d;
        }).ticks(25));

        yaxis.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-5.1em")
            .attr("text-anchor", "end")
            .attr("stroke", "blue")
            .text("");
        //.attr

        xaxis.selectAll("text").style("stroke", "blue");

        yaxis.selectAll("text").style("stroke", "blue");

        xaxis.selectAll("line").style("stroke", "purple");

        yaxis.selectAll("line").style("stroke", "green");







        // console.log("new y")
        bar.transition()
            .duration(500)
            // .data(data)
            // .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) { return xScale(d.Name); })
            .attr("y", function (d) { console.log("k"); return yScale(+eval("d.X" + yr) + +eval("d.Y" + yr) + +eval("d.R" + yr)); })
            .attr("width", xScale.bandwidth())
            .attr("height", function (d) { return height7 - yScale(eval("d.R" + yr)); })
            .attr("cx", function (d, i) {
                var spacing = 100 / (eval(data).length);
                return xScale + (i * spacing)
            })

        d3.select("text").text(yr + "  Z-data");


        // console.log("new y")
        bar1.transition()
            .duration(500)
            // .data(data)
            // .enter().append("rect")
            .attr("class", "bar1")
            .attr("x", function (d) { return xScale(d.Name); })
            .attr("y", function (d) { console.log("k"); return yScale(+eval("d.X" + yr) + +eval("d.Y" + yr)); })
            .attr("width", xScale.bandwidth())
            .attr("height", function (d) { return height7 - yScale(eval("d.Y" + yr)); })
            .attr("cx", function (d, i) {
                var spacing = 100 / (eval(data).length);
                return xScale + (i * spacing)
            })

        d3.select("text").text(yr + "  Z-data");



        // console.log("new y")
        bar2.transition()
            .duration(500)
            // .data(data)hie
            // .enter().append("rect")
            .attr("class", "bar2")
            .attr("x", function (d) { return xScale(d.Name); })
            .attr("y", function (d) { console.log("k"); return yScale(eval("d.X" + yr)); })
            .attr("width", xScale.bandwidth())
            .attr("height", function (d) { return height7 - yScale(eval("d.X" + yr)); })
            .attr("cx", function (d, i) {
                var spacing = 100 / (eval(data).length);
                return xScale + (i * spacing)
            })

        d3.select("text").text(yr + "  Z-data");

    });//end click function






});





// console.log("doggy")