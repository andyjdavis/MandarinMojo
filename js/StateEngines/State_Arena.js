//(function() {

window.game = window.game || { };

game.State_Arena = function() {
}
game.State_Arena.prototype = new game.Thing();
game.State_Arena.prototype.constructor = game.State_Arena;

game.State_Arena.prototype.start = function() {
};
game.State_Arena.prototype.end = function() {
};

game.State_Arena.prototype.draw = function() {
    var img = gWorld.images.getImage('background');
    if (img) {
        gContext.drawImage(img, 0, 0);
    }
    if (gWorld.message) {
        gWorld.message.draw();
    }
    for (var i in gWorld.projectiles) {
        gWorld.projectiles[i].draw();
    }
    for (var i in gWorld.enemies) {
        gWorld.enemies[i].draw();
    }
    gWorld.player.draw();
    for (var i in gWorld.decorations) {
        gWorld.decorations[i].draw();
    }

    //drawText(gContext, s, gWorld.textsize, gWorld.textcolor, 10, 20);
    //drawText(gContext, gWorld.score, gWorld.textsize, gWorld.textcolor, 480, 20);
};
game.State_Arena.prototype.update = function(dt) {
};

//}());
