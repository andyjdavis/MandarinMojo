//(function() {

window.game = window.game || { };

game.State_ArenaIntro = function() {
    this.level = 0;
    this.wordindex = 0;
    this.wordcount = 0;
}
game.State_ArenaIntro.prototype = new game.Thing();
game.State_ArenaIntro.prototype.constructor = game.State_ArenaIntro;

game.State_ArenaIntro.prototype.start = function() {
};
game.State_ArenaIntro.prototype.end = function() {
};

game.State_ArenaIntro.prototype.draw = function() {
    var img = gWorld.images.getImage('background');
    if (img) {
        gContext.drawImage(img, 0, 0);
    }

    x = gCanvas.width/2;
    drawText(gContext, "Mandarin Mojo", gWorld.textsize, gWorld.textcolor, x, 100);
    drawText(gContext, "Collect the correct characters", gWorld.textsize, gWorld.textcolor, x, 210);
    drawText(gContext, "Avoid the critters", gWorld.textsize, gWorld.textcolor, x, 240);
    drawText(gContext, "Use the arrow keys to move", gWorld.textsize, gWorld.textcolor, x, 270);
    drawText(gContext, "Press m to mute sound effects", gWorld.textsize, gWorld.textcolor, x, 300);
    drawText(gContext, "Press p to pause", gWorld.textsize, gWorld.textcolor, x, 330);

    drawText(gContext, "Press e to begin", gWorld.textsize, "white", x, 400);

    //gWorld.player.draw();
};
game.State_ArenaIntro.prototype.update = function(dt) {
};
game.State_ArenaIntro.prototype.onKeyDown = function(event) {
    // "e"
    if (event.keyCode == 69) {
        var state = gWorld.state.setState(gWorld.state.states.ARENA);
        console.log('supplying '+this.level);
        state.setLevel(this.level);
        state.wordindex = this.wordindex;
        state.wordcount = this.wordcount;
    }
};

//}());
