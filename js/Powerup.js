//(function() {

window.game = window.game || { };

game.Powerup = function(pos) {
    game.Thing.call(this, pos, [32,32], [0, 0]);
    this.start = new Date().getTime();
    this.lifespan = 7000;
}
game.Powerup.prototype = new game.Thing();
game.Powerup.prototype.constructor = game.Powerup;

game.Powerup.prototype.draw = function(camerapos) {
    var img = gWorld.images.getImage('powerup');
    if (img) {
        //debug
        //drawRect(gContext, this.pos[0]-1, this.pos[1]-1, this.size[0]+2, this.size[1]+2);
        var sourceWidth = 35;
        var sourceX = 0;
        var sourceY = 0;
        gContext.drawImage(img, sourceX, sourceY, sourceWidth, sourceWidth, this.pos[0]+camerapos[0], this.pos[1]+camerapos[1], this.size[0], this.size[1]);
    }
    //game.Thing.prototype.draw.call(this, drawpos);
};
game.Powerup.prototype.update = function(dt) {
    //game.Thing.prototype.update.call(this, dt);
    
    if (new Date().getTime() - this.start > this.lifespan) {
        return false;
    }
    return true;
};

//}());
