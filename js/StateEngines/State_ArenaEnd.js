//(function() {

window.game = window.game || { };

game.State_ArenaEnd = function() {
}
game.State_ArenaEnd.prototype = new game.Thing();
game.State_ArenaEnd.prototype.constructor = game.State_ArenaEnd;

game.State_ArenaEnd.prototype.start = function() {
};
game.State_ArenaEnd.prototype.end = function() {
};

game.State_ArenaEnd.prototype.draw = function() {
    var img = gWorld.images.getImage('background');
    if (img) {
        gContext.drawImage(img, 0, 0);
    }

    //drawText(gContext, "Chinese Character Challenge", gWorld.textsize, gWorld.textcolor, gCanvas.width/5, 100);
    drawText(gContext, "You got "+gWorld.score+" in a row.", gWorld.textsize, gWorld.textcolor, gCanvas.width/2, 150);
    drawText(gContext, "Your best score is "+gWorld.bestscore, gWorld.textsize, gWorld.textcolor, gCanvas.width/2, 190);
    if (gWorld.newbest) {
        drawText(gContext, "New best score!!", gWorld.textsize, gWorld.textcolor, gCanvas.width/2, 270);
        if (gWorld.score > 30) {
            drawText(gContext, "Press t to tell twitter", gWorld.textsize, gWorld.textcolor, gCanvas.width/2, 310);
        }
    }
    drawText(gContext, "Press e to play again", gWorld.textsize, gWorld.textcolor, gCanvas.width/2, 390);
    for (var i in gWorld.decorations) {
        gWorld.decorations[i].draw();
    }
};
game.State_ArenaEnd.prototype.update = function(dt) {
};

//}());
