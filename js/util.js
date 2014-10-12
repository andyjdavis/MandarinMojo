var $ = function(id) { return document.getElementById(id); };
var dc = function(tag) { return document.createElement(tag); };

function createDiv(parent, imagesrc, width, height, id) {
    var screen = $(parent);

    div = dc("div");
    if (id) {
        div.setAttribute("id", id);
    }
    div.style.position = "absolute";
    div.style.left = "0px";
    div.style.width = width;
    div.style.height = height;
    div.style.overflow = "hidden";
    
    div.style.backgroundImage = "url("+imagesrc+")";

    /*var img = new Image();
    img.src = imagesrc;
    img.style.position = "absolute";
    img.style.left = "0px";
    img.style.widght = width;
    img.style.height = height;

    div.appendChild(img);
    div.img = img;	// assign the image to a property so we have easy access to the image later*/
    screen.appendChild(div);
    
    return div;
}
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
function drawRect(context, x, y, width, height) {
    context.fillRect(x, y, width, height);
}
function drawBox(context, x, y, width, height, color) {
    context.beginPath();
    context.rect(x, y, width, height);
    context.lineWidth = 1;
    context.strokeStyle = color;
    context.stroke();
}
function drawText(context, text, font, style, x, y, opacity) {
    if (opacity) {
        gContext.globalAlpha = opacity;
    }
    context.font = font;
    context.fillStyle = style;
    context.fillText(text, x, y);
    if (opacity) {
        gContext.globalAlpha = 1.0;
    }
}
function angleToVector(ang) {
    return [Math.cos(ang), Math.sin(ang)]
}
function calcDistance(vect) {
    return Math.sqrt(Math.pow(vect[0], 2) + Math.pow(vect[1], 2));
}
function calcVector(p1, p2) {
    return [p1[0] - p2[0], p1[1] - p2[1]];
}
function calcNormalVector(p1, p2) {
    var vect = calcVector(p1, p2);
    var h = calcDistance(vect);
    vect[0] = vect[0] / h;
    vect[1] = vect[1] / h;
    return vect;
}
/*function getDrawPos(p) {
    return [p[0] - gCamera[0], p[1] - gCamera[1]];
}*/
function lockToScreen(thing) {
    _lockToScreen(thing, true);
    _lockToScreen(thing, false);
}
function _lockToScreen(thing, width) {
    var i = width?0:1;
    if (thing.pos[i] < 0) {
        thing.pos[i] = 0;
    } else if (thing.pos[i] + thing.size[i] > gCanvas.width) {
        thing.pos[i] = gCanvas.width - thing.size[i];
    }
}
