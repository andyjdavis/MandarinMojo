//(function() {

window.game = window.game || { };

game.State_Overlay = function() {
    this.cameraPosition = null;
    this.bottomRight = null;
}
game.State_Overlay.prototype = new game.Thing();
game.State_Overlay.prototype.constructor = game.State_Overlay;

game.State_Overlay.prototype.end = function() {
};

game.State_Overlay.prototype.draw = function() {
    if (gWorld.map) {
        gWorld.map.draw(this.cameraPosition, this.bottomRight);
    }

    drawRect(gContext, 50, 50, gCanvas.width - 100, gCanvas.height - 100, 'green', 0.6);

    var y = 150;
    drawText(gContext, "High Scores", gWorld.textsize, 'white', gCanvas.width/2, y);
    for (var i in gWorld.playerinfo.highscores) {
        y += 40;
        drawText(gContext, "HSK "+(1.0 * i + 1)+"   "+gWorld.playerinfo.highscores[i], gWorld.textsize, 'white', gCanvas.width/2, y);
    }
};
game.State_Overlay.prototype.update = function(dt) {
};

//}());
