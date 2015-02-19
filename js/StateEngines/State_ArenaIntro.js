//(function() {

window.game = window.game || { };

game.State_ArenaIntro = function() {
    this.level = 0;
    this.wordindex = 0;
    this.wordcount = 0;

    gCanvas.width = gWorld.arenaWidth;
    gCanvas.height = gWorld.arenaHeight;

    gLeft.setAttribute('width', gWorld.arenaWidth+'px');
}
game.State_ArenaIntro.prototype = new game.Thing();
game.State_ArenaIntro.prototype.constructor = game.State_ArenaIntro;

game.State_ArenaIntro.prototype.end = function() {
};

game.State_ArenaIntro.prototype.draw = function() {
    var img = gWorld.images.getImage('background');
    if (img) {
        gContext.drawImage(img, 0, 0);
    }
    x = gCanvas.width/2;

    // Can't use this.wordcount as it is set on the arena by setLevel().
    if (this.level == 0 && gWorld.playerinfo.problems.length == 0) {
        drawText(gContext, "Your review queue is empty", gWorld.textsize, gWorld.textcolor, x, 150);
        drawText(gContext, "Attempt a HSK level and words will be added", gWorld.textsize, gWorld.textcolor, x, 180);
        drawText(gContext, "Press e to exit the review arena", gWorld.textsize, "white", x, 340);
    } else {
        drawText(gContext, "Collect the correct characters", gWorld.textsize, gWorld.textcolor, x, 150);

        var s = "Avoid the critters";
        if (this.level == 0) {
            s = "Review in safety. No monsters here.";
        }
        drawText(gContext, s, gWorld.textsize, gWorld.textcolor, x, 180);

        //drawText(gContext, "Press m to mute sound effects", gWorld.textsize, gWorld.textcolor, x, 240);
        drawText(gContext, "p to pause", gWorld.textsize, gWorld.textcolor, x, 310);
        drawText(gContext, "s if there is a problem with speech", gWorld.textsize, "white", x, 340);
        drawText(gContext, "e to begin (and e to exit to the map)", gWorld.textsize, "white", x, 370);
    }
};
game.State_ArenaIntro.prototype.update = function(dt) {
};
game.State_ArenaIntro.prototype.onKeyDown = function(event) {
    // "e"
    if (event.keyCode == 69) {
        // Can't use this.wordcount as it is set on the arena by setLevel().
        if (this.level == 0 && gWorld.playerinfo.problems.length == 0) {
            var state = gWorld.state.setState(gWorld.state.states.MAP);
        } else {
            var state = gWorld.state.setState(gWorld.state.states.ARENA);
            state.wordindex = this.wordindex;
            state.wordcount = this.wordcount;
            state.setLevel(this.level);
        }
    }
};

//}());
