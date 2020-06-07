var cv  = document.getElementById('cv'),
    ctx = cv.getContext('2d');

for(var i = 0; i <= 255; i++) {
    ctx.beginPath();
    
    var color = 'rgb(255, ' + (255 - i).toString() + ', ' + (255 - i).toString() + ')';
    ctx.fillStyle = color;
    
    ctx.fillRect(i * 2, 0, 2, 50);
}

cv.onclick = function(e) {
    var x = e.offsetX,
        y = e.offsetY,
        p = ctx.getImageData(x, y, 1, 1),
        x = p.data;
    
    alert('Color: rgb(' + x[0] + ', ' + x[1] + ', ' + x[2] + ')');
};