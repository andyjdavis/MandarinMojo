//(function() {

window.game = window.game || { };

game.State_ArenaEnd = function() {
    this.decorations = null;
    this.level = 0;
    this.wordcount = 0;
    this.got = 0;
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
    drawText(gContext, "You got "+this.got+"/"+this.wordcount, gWorld.textsize, gWorld.textcolor, gCanvas.width/2, 150);

    var perc = this.got / this.wordcount;
    var s = '';
    if (perc == 1.0) {
        s = "Arena complete!";
    } else if (perc < 0.5) {
        s = 'You have much to learn';
    } else if (perc < 0.8) {
        s = 'The student has not yet become the master';
    } else {
        s = 'Victory is near at hand';
    }
    drawText(gContext, s, gWorld.textsize, gWorld.textcolor, gCanvas.width/2, 270);

    drawText(gContext, "Press e to exit the arena", gWorld.textsize, gWorld.textcolor, gCanvas.width/2, 390);
    for (var i in this.decorations) {
        this.decorations[i].draw();
    }
};
game.State_ArenaEnd.prototype.update = function(dt) {
};
game.State_ArenaEnd.prototype.onKeyDown = function(event) {
    // "e"
    if (event.keyCode == 69) {
        gWorld.state.setState(gWorld.state.states.MAP);
    }
}

//}());
