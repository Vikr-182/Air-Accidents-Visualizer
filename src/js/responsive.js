$("#mySelect2").width(swidth/9);

$(window).resize(function(){
    console.log(window.innerWidth);
    $("#mySelect2").width(swidth/9);
    swidth = window.innerWidth/1.4;
    $("#scatter_anna").width(swidth);
    myFunction();
    myFunction2(current);
    $("#bar_race_annara").attr("width",window.innerWidth/1.1);
    $("#bar_race_annara").attr("height",window.innerWidth*0.5/1.1);
    d3.select("#barline").remove();
    d3.select("#bar_stack").selectAll("g").remove();
    d3.select("#bar_stack").selectAll("text").remove();
    d3.select("#my_anna_dataviz").selectAll("#sanky_annara").remove();
    draw_sanky();
    draw_barline();
    draw_barstacked();
    // $("#cv").attr("width",window.innerWidth/1)
})

