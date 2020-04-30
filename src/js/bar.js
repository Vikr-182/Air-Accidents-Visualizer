var dic = {};
var color = {
    "AUS": "#fdc112",
    "IND": "#7aafde",
    "PAK": "#abc187",
    "NZ": "#a8a8a8",
    "SL": "#075a58",
    "ENG": "red",
    "ZIM": "orange",
    "WI": "#580b27",
    "SA": "#096e5a"
}
// Feel free to change or delete any of the code you see in this editor!
var svg3 = d3.select("#ly_anna").append("svg")
    .attr("width", 1400)
    .attr("height", 600);


var tickDuration = 500;

var top_n = 12;
var height = 600;
var width = 1350;

const margin = {
    top: 80,
    right: 0,
    bottom: 5,
    left: 0
};

let barPadding = (height - (margin.bottom + margin.top)) / (top_n * 5);

let title = svg3.append('text')
    .attr('class', 'title')
    .attr('y', 24)
    .html('Fatal Crashes by Country');

let subTitle = svg3.append("text")
    .attr("class", "subTitle")
    .attr("y", 55)
    .html("Number of crashes");

let caption = svg3.append('text')
    .attr('class', 'caption')
    .attr('x', width)
    .attr('y', height - 5)
    .style('text-anchor', 'end')

let ind = 0;
var years = new Array(0);

function getlastrating(ind) {
    if (ind != 0)
        return years[ind - 1];
    else {
        return years[ind];
    }
}

function colorme(item) {
    if (color[item] == undefined) {
        return "grey";
    } else {
        return color[item];
    }
}

queue()
    .defer(d3.csv, "https://raw.githubusercontent.com/Vikr-182/Test/master/batsmen_ratings_all091217.csv")
    .defer(d3.json, "../../data/cleaned_data.json")
    .defer(d3.json, "../../assets/static/airport_to_country.json")
    .defer(d3.json, "../../assets/static/country_to_airport.json")
    .await(ready)

function ready(error, data, clean, airport_to_country, country_to_airport) {
    //if (error) throw error;

    // console.log(data);
    var count = 0;
    var kic = {};
    var anna_years = [];
    for (var ii = 0; ii < 19; ii++) {
        var to = Math.floor(ii / 10);
        var bo = ii % 10;
        if (ii != 13) {
            anna_years.push("20" + to.toString() + bo.toString());
        }

    }
    // console.log(anna_years);
    var anna_ind = 0;
    var cata = new Array(0);
    var curryear = 0;
    var currrank = 0;
    var marked = new Array(5000);
    for (var g = 1877; g <= 2100; g++) {
        marked[g] = 0;
    }
    for (i in data) {
        if (data[i]["rate_date"] != undefined && data[i]["rating"] != undefined) {
            if (curryear == 0 || (curryear != data[i]["rate_date"].slice(0, 4)) || currrank < parseInt(data[i][
                    "rank"
                ])) {
                curryear = data[i]["rate_date"].slice(0, 4);
                if (!marked[parseInt(data[i]["rate_date"].slice(0, 4))]) {
                    marked[parseInt(data[i]["rate_date"].slice(0, 4))] = 1;
                    years.push(data[i]["rate_date"].slice(0, 4));
                }
                currrank = parseInt(data[i]["rank"])
                cata.push(data[i]);
                if (dic[data[i]["name"]] == undefined) {
                    dic[data[i]["name"]] = {}
                    dic[data[i]["name"]][curryear] = data[i]["rating"];
                } else {
                    dic[data[i]["name"]][curryear] = data[i]["rating"];
                }
            }
        }
    }
    // console.log(years);
    data = cata;
    // data.forEach(d => {
    //         d.rate_date = +d.rate_date.slice(0,4);
    // });

    data.forEach(d => {
        d.name = d.name;
        d.rating = +d.rating;
        d.rate_date = +d.rate_date.slice(0, 4);
        d.nations = d.nations;
        if (dic[d.name][years[ind] - 1 * ind] != undefined) {
            d.lastValue = +dic[d.name][years[ind] - 1 * ind];
        } else {
            d.lastValue = +d.rating;
        }
    });

    var h;
    var ee = "Departure airport:";
    var lala = new Array(0);
    var countries = [];
    var mark = {};
    for (h in clean) {
        var lend = clean[h][ee].split("(")[1].split(")")[0].split("/").length;
        var bro = clean[h][ee].split("(")[1].split(")")[0].split("/")[lend - 1];
        if (airport_to_country[bro] != undefined) {
            countries.push(airport_to_country[bro]["country"]);
        }
    }

    function rara(data) {
        return [...new Set(data)];
    }
    countries = rara(countries);
    // console.log(countries);
    for (var h = 0; h < countries.length; h++) {
        if (kic[countries[h]] == undefined) {
            kic[countries[h]] = {};
        }
        for (var b = 0; b < 20; b++) {
            var ta = Math.floor(b / 10);
            var po = b % 10;
            kic[countries[h]]["20" + ta.toString() + po.toString()] = 0;
        }
    }
    var n;
    for (n in clean) {
        var lend = clean[n][ee].split("(")[1].split(")")[0].split("/").length;
        var bro = clean[n][ee].split("(")[1].split(")")[0].split("/")[lend - 1];
        if (airport_to_country[bro] != undefined) {
            // now increase the count
            kic[airport_to_country[bro]["country"]][clean[n]["date"].slice(0, 4)]++;
        }
    }
    var final = [];
    console.log(kic);
    for (var b in kic) {
        // console.log(kic[b]);
        var ks = Object.keys(kic[b]);
        for (var pm = 0; pm < ks.length; pm++) {
            var reti = pm;
            if (pm == 0) {
                reti = 1;
            }
            final.push({
                "country": b,
                "year": ks[pm],
                "number": kic[b][ks[pm]],
                "lastValue": kic[b][ks[reti - 1]]
            });
        }
    }
    // console.log(final.length);
    let yearSlice = data.filter(d => d.rate_date == years[ind] && !isNaN(d.rating))
        .sort((a, b) => parseInt(b.rating) - parseInt(a.rating))
        .slice(0, top_n);

    let annaSlice = final.filter(d => d["year"] == anna_years[anna_ind] && !isNaN(d["number"]))
        .sort((a, b) => parseInt(b["number"]) - parseInt(a["number"]))
        .slice(0, top_n);
    for (var k = 0; k < annaSlice.length; k++) {
        annaSlice[k]["rank"] = k + 1;
    }

    // // yearSlice.forEach((d, i) => d.rank = i);

    console.log('annaSlice: ', annaSlice)
    console.log('yearSlice: ', yearSlice)

    let x = d3.scaleLinear()
        .domain([0, d3.max(annaSlice, d => d["number"])])
        .range([margin.left, width - margin.right - 65]);
    let y = d3.scaleLinear()
        .domain([top_n, 0])
        .range([height - margin.bottom, margin.top]);

    let xAxis = d3.axisTop()
        .scale(x)
        .ticks(width > 700 ? 5 : 2)
        .tickSize(-(height - margin.top - margin.bottom))
        .tickFormat(d => d3.format(',')(d));

    svg3.append('g')
        .attr('class', 'axis xAxis')
        .attr('transform', `translate(0, ${margin.top})`)
        .call(xAxis)
        .selectAll('.tick line')
        .classed('origin', d => d == 0);

    svg3.selectAll('rect.bar')
        .data(annaSlice, d => d["country"])
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', x(0) + 1)
        .attr('width', d => x(d["number"]) - x(0) - 1)
        .attr('y', d => y(d["rank"]) + 5)
        .attr('height', y(1) - y(0) - barPadding)
        .style('fill', "green");

    svg3.selectAll('text.label')
        .data(annaSlice, d => d["country"])
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d["number"]) - 8)
        .attr('y', d => y(d["rank"]) + 5 + ((y(1) - y(0)) / 2) + 1)
        .style('text-anchor', 'end')
        .html(d => (d["country"]));

    svg3.selectAll('text.valueLabel')
        .data(annaSlice, d => d["country"])
        .enter()
        .append('text')
        .attr('class', 'valueLabel')
        .attr('x', d => x(d["number"]) + 5)
        .attr('y', d => y(d["rank"]) + 5 + ((y(1) - y(0)) / 2) + 1)
        .text(d => d["number"]);

    let yearText = svg3.append('text')
        .attr('class', 'yearText')
        .attr('x', width - margin.right)
        .attr('y', height - 25)
        .style('text-anchor', 'end')
        .html(~~anna_years[anna_ind])
        .call(halo, 10);

    let ticker = d3.interval(e => {
        yearSlice = data.filter(d => d.rate_date == years[ind] && !isNaN(d.rating))
            .sort((a, b) => parseInt(b.rating) - parseInt(a.rating))
            .slice(0, top_n);
        annaSlice = final.filter(d => d["year"] == anna_years[anna_ind] && !isNaN(d["number"]))
            .sort((a, b) => parseInt(b["number"]) - parseInt(a["number"]))
            .slice(0, top_n);

        for (var b = 0; b < annaSlice.length; b++) {
            annaSlice[b]["rank"] = b + 1;
        }
        x.domain([0, d3.max(annaSlice, d => d["number"])]);

        svg3.select('.xAxis')
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .call(xAxis);

        let bars = svg3.selectAll('.bar').data(annaSlice, d => d["country"]);

        bars
            .enter()
            .append('rect')
            .attr('class', d => `bar ${d["country"].replace(/\s/g,'_')}`)
            .attr('x', x(0) + 1)
            .attr('width', d => x(d["number"]) - x(0) - 1)
            .attr('y', d => y(top_n + 1) + 5)
            .attr('height', y(1) - y(0) - barPadding)
            .style('fill', "green")
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('y', d => y(d["rank"]) + 5);

        bars
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('width', d => x(d["number"]) - x(0) - 1)
            .attr('y', d => y(d["rank"]) + 5);

        bars
            .exit()
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('width', d => x(d["number"]) - x(0) - 1)
            .attr('y', d => y(top_n + 1) + 5)
            .remove();

        let labels = svg3.selectAll('.label')
            .data(annaSlice, d => d["country"]);

        labels
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('x', d => x(d["number"]) - 8)
            .attr('y', d => y(top_n + 1) + 5 + ((y(1) - y(0)) / 2))
            .style('text-anchor', 'end')
            .html(d => (d["country"]))
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('y', d => y(d["rank"]) + 5 + ((y(1) - y(0)) / 2) + 1);


        labels
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('x', d => x(d["number"]) - 8)
            .attr('y', d => y(d["rank"]) + 5 + ((y(1) - y(0)) / 2) + 1);

        labels
            .exit()
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('x', d => x(d["number"]) - 8)
            .attr('y', d => y(top_n + 1) + 5)
            .remove();

        svg3.selectAll('.valueLabel')
            .text(
                function (d) {
                    return d["number"];
                }
            )
        let valueLabels = svg3.selectAll('.valueLabel').data(annaSlice, d => d["country"]);

        valueLabels
            .enter()
            .append('text')
            .attr('class', 'valueLabel')
            .attr('x', d => x(d["number"]) + 5)
            .attr('y', d => y(top_n + 1) + 5)
            .text(d => d["number"])
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('y', d => y(d["rank"]) + 5 + ((y(1) - y(0)) / 2) + 1);

        valueLabels
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('x', d => x(d["number"]) + 5)
            .attr('y', d => y(d["rank"]) + 5 + ((y(1) - y(0)) / 2) + 1)
            .tween("text", function (d) {
                let i = d3.interpolateRound(d["lastValue"], d["number"]);
                return function (t) {
                    this.textContent = (i(t));
                };
            });


        valueLabels
            .exit()
            .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('x', d => x(d["number"]) + 5)
            .attr('y', d => y(top_n + 1) + 5)
            .remove();
        console.log(annaSlice);
        yearText.html(~~anna_years[anna_ind]);
        // alert(ind);
        if (anna_ind == anna_years.length - 1) ticker.stop();
        anna_ind = ((anna_ind) + 1);
    }, tickDuration * 5);

};

const halo = function (text, strokeWidth) {
    text.select(function () {
            return this.parentNode.insertBefore(this.cloneNode(true), this);
        })
        .style('fill', '#ffffff')
        .style('stroke', '#ffffff')
        .style('stroke-width', strokeWidth)
        .style('stroke-linejoin', 'round')
        .style('opacity', 1);

}