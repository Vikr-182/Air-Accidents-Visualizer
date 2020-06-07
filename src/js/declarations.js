	// width and height
	var swoosh = d3.line()
	.x(function (d) {
		return d[0]
	})
	.y(function (d) {
		return d[1]
	})
	.curve(d3.curveCardinal.tension(0))
// .tension(.0);

/////////////////////////////////////////////////////////////////////////////////////////////
var w;
var h;
var keys;
// scale globe to size of window
var scl;
var glow_scl;
var jag, pag;
var scale_sky;
var scale_sky2;
var scale_sky3;
var scale_sky4;
// map projection
var projection;
var glow_projection;
// path generator
var path;
var glow_path;
var sky;
var sky2;
var sky3;
var sky4;
// append svg
var svg;
// append g element for map
var map;

// enable drag
var gpos0, o0, gpos1, o1;
var sgpos0, so0, sgpos1, so1;
var glow_pos0, glow_o0, glow_gpos1, glow_o1;
var s2gpos0, s2o0, s2gpos1, s2o1;
var s3gpos0, s3o0, s3gpos1, s3o1;
var s4gpos0, s4o0, s4gpos1, s4o1;
var sag, dag;
var bag;
var links = [],
	arcLines = [];
var kaam = [];

function get_width(number){
    if(window.innerWidth < 768){ // Smaller screens, whatever the number, assign full width
        return window.innerWidth/1.2;
    }
    return window.innerWidth * (number / 12);
}
