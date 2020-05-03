$("#mySelect2").width(swidth/9);

$(window).resize(function(){
    $("#mySelect2").width(swidth/9);
    swidth = window.innerWidth/1.2;
    $("#scatter_anna").width(swidth);
    myFunction2(current);
    // alert(window.innerWidth);
})