//(function() {

window.game = window.game || { };

game.State_ArenaPassed = function() {
    this.decorations = null;
    this.level = 0;
}
game.State_ArenaPassed.prototype = new game.Thing();
game.State_ArenaPassed.prototype.constructor = game.State_ArenaPassed;

game.State_ArenaPassed.prototype.end = function() {
};

game.State_ArenaPassed.prototype.draw = function() {
    var img = gWorld.images.getImage('background');
    if (img) {
        gContext.drawImage(img, 0, 0);
    }

    var s = "You have passed HSK "+this.level+"!!";
    if (this.level == 0) {
        s = 'Review complete';
    }
    drawText(gContext, s, gWorld.textsize, gWorld.textcolor, gCanvas.width/2, 150);
    drawText(gContext, "Press e to exit the arena", gWorld.textsize, gWorld.textcolor, gCanvas.width/2, 390);
    for (var i in this.decorations) {
        this.decorations[i].draw();
    }
};
game.State_ArenaPassed.prototype.update = function(dt) {
};
game.State_ArenaPassed.prototype.onKeyDown = function(event) {
    // "e" to exit
    if (event.keyCode == 69) {
        gWorld.state.setState(gWorld.state.states.MAP);
    }
}

//}());
