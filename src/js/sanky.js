function draw_sanky() {
  // set the dimensions and margins of the graph
  var margin8 = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    },
    width8 = window.innerWidth / 1.5 - margin8.left - margin8.right,
    height8 = 1150 - margin8.top - margin8.bottom;

  // append the svg object to the body of the page
  var svg8 = d3.select("#my_anna_dataviz").append("svg")
    //    .attr("transform","rotate(-270)")
    .attr("width", width8 + margin8.left + margin8.right)
    .attr("height", height8 + margin8.top + margin8.bottom)
    // .attr("viewBox", "0 0 " + (width8 + margin8.left + margin8.right).toString() + (height8 + margin8.top + margin8.bottom).toString())
    .attr("id", "sanky_annara")
    .append("g")
    .attr("id","sanky_anna")
    .attr("transform",
      "translate(" + margin8.left + "," + margin8.top + ")");

  // Color scale used
  var color8 = d3.scaleOrdinal(d3.schemeCategory20);

  // Set the sankey diagram properties
  var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(90)
    .size([width8, height8]);

  colorscale = d3.scaleOrdinal(["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"]);
  colorscale.domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])


  // load the data
  d3.json("../../data/loca.json", function (error, graph) {

    // Constructs a new Sankey generator with the default settings.
    sankey
      .nodes(graph.nodes)
      .links(graph.links)
      .layout(1);

    // add in the links
    var link8 = svg8.append("g")
      .selectAll(".linkk")
      .data(graph.links)
      .enter()
      .append("path")
      .attr("class", "linkk")
      .attr("d", sankey.link())
      .style("stroke", function (d) {
        console.log("yoyoyyo")
        console.log(colorscale(d.target['node']));
        return d.color = color8(d.target['name'].replace(/ .*/, ""));
        //return colorscale(d.target['node']);
      })
      .style("stroke-width", function (d) {
        console.log(d);
        return Math.max(1, d.dy);
      })
      .sort(function (a, b) {
        return b.dy - a.dy;
      });

    // add in the nodes
    var node8 = svg8.append("g")
      .selectAll(".nodee")
      .data(graph.nodes)
      .enter().append("g")
      .attr("class", "nodee")
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
      .call(d3.drag()
        .subject(function (d) {
          return d;
        })
        .on("start", function () {
          this.parentNode.appendChild(this);
        })
        .on("drag", dragmove));

    // add the rectangles for the nodes
    node8
      .append("rect")
      .attr("height", function (d) {
        return d.dy;
      })
      .attr("width", sankey.nodeWidth())
      .style("fill", function (d) {
        return d.color = color8(d.name.replace(/ .*/, ""));
      })
      .style("stroke", function (d) {
        return d3.rgb(d.color).darker(2);
      })
      // Add hover text
      .append("title")
      .text(function (d) {
        return d.name + "\n" + "There is " + d.value + " stuff in this node";
      });

    // add in the title for the nodes
    node8
      .append("text")
      .attr("x", -6)
      .attr("y", function (d) {
        return d.dy / 2;
      })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function (d) {
        return d.name;
      })
      .filter(function (d) {
        return d.x < width8 / 2;
      })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

    // the function for moving the nodes
    function dragmove(d) {
      d3.select(this)
        .attr("transform",
          "translate(" +
          d.x + "," +
          (d.y = Math.max(
            0, Math.min(height8 - d.dy, d3.event.y))) + ")");
      sankey.relayout();
      link8.attr("d", sankey.link());
    }

  });

}
draw_sanky();