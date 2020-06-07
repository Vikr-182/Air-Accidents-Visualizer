var iw = 380;
var ih = 400;
var svg5 = d3.select("#plane").append("svg")
    .attr("width", 1100)
    .attr("height", 600)
    .attr("id","my_plane")
    ;
var ht = 0;
var cnnt = 0;
for( var tr = 130;tr <= 355;tr += 15){
    svg5.append("rect")
    .attr("x",185)
    .attr("y",tr)
    .attr("width",10)
    .attr("height",10)
    .attr("fill","grey")
    .attr("stroke","black")
    .attr("id",cnnt + "pass");
    cnnt = cnnt + 1;
    svg5.append("rect")
    .attr("x",205)
    .attr("y",tr)
    .attr("width",10)
    .attr("height",10)
    .attr("fill","grey")
    .attr("stroke","black")
    .attr("id",cnnt + "pass");
    cnnt = cnnt + 1;
}
// svg5.append("rect")
// .attr("x",230)
// .attr("y",29)
// .attr("width",10)
// .attr("height",10)
// .attr("fill","grey")
// .attr("stroke","black")
// .attr("id",cnnt + "pass");

// cnnt = cnnt + 1;

// svg5.append("rect")
// .attr("x",234)
// .attr("y",50)
// .attr("width",10)
// .attr("height",10)
// .attr("fill","grey")
// .attr("stroke","black")
// .attr("id",cnnt + "pass");

// cnnt = cnnt + 1;

// svg5.append("rect")
// .attr("x",210)
// .attr("y",29)
// .attr("width",10)
// .attr("height",10)
// .attr("fill","grey")
// .attr("stroke","black")
// .attr("id",cnnt + "pass");

// cnnt = cnnt + 1;

// svg5.append("rect")
// .attr("x",206)
// .attr("y",50)
// .attr("width",10)
// .attr("height",10)
// .attr("fill","grey")
// .attr("stroke","black")
// .attr("id",cnnt + "pass");

// cnnt = cnnt + 1;

// svg5.append("rect")
// .attr("x",210)
// .attr("y",69)
// .attr("width",10)
// .attr("height",10)
// .attr("fill","grey")
// .attr("stroke","black")
// .attr("id",cnnt + "pass");

// cnnt = cnnt + 1;

// svg5.append("rect")
// .attr("x",232)
// .attr("y",69)
// .attr("width",10)
// .attr("height",10)
// .attr("fill","grey")
// .attr("stroke","black")
// .attr("id",cnnt + "pass");

for(var r = 0; r < cnnt; r++){
    $("#" + r + "pass").on("mouseover",hello)
}

function hello(){
    $(this).css("cursor","pointer");
}

function thank_you(item){
    alert(item.passengers);
}