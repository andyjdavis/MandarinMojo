//(function() {

window.game = window.game || { };

game.State_Loading = function() {
}
game.State_Loading.prototype = new game.Thing();
game.State_Loading.prototype.constructor = game.State_Loading;

game.State_Loading.prototype.end = function() {
};

game.State_Loading.prototype.draw = function() {
    //drawInstructions(false);
    var total = gWorld.sounds.sounds.length + gWorld.images.images.length;
    var loaded = gWorld.sounds.numSoundsLoaded + gWorld.images.numImagesLoaded;
    if (loaded < total) {
        //gContext.clearRect(0, 0, gCanvas.width, gCanvas.height);
        var text = "Loading...    "+loaded+"/"+total;
        drawText(gContext, text, gWorld.textsize, gWorld.textcolor, gCanvas.width/2, 400);
        //return;
    } else {
        gWorld.state.setState(gWorld.state.states.MAP);
    }
};
game.State_Loading.prototype.update = function(dt) {
};

//}());
