//(function() {

window.game = window.game || { };

game.Explosion = function(pos) {
    game.Thing.call(this, pos, [32,32], [0, 0]);
    //this.birth = gWorld.loopCount;
    this.frame = 0;
    this.maxframe = 15;
}
game.Explosion.prototype = new game.Thing();
game.Explosion.prototype.constructor = game.Explosion;

game.Explosion.prototype.draw = function() {
    var img = gWorld.images.getImage('explosion');
    if (img) {
        //debug
        //drawRect(gContext, this.pos[0]-1, this.pos[1]-1, this.size[0]+2, this.size[1]+2);
        var sourceWidth = 64;
        if (gWorld.loopCount % 12 == 0) {
            this.frame++;
        }
        if (this.frame > this.maxframe) {
            //shouldnt happen... but yet....
            return;
        }
        var sourceX = sourceWidth * this.frame;
        var sourceY = sourceWidth * (this.frame % 4);
        gContext.drawImage(img, sourceX, sourceY, sourceWidth, sourceWidth, this.pos[0], this.pos[1], this.size[0], this.size[1]);
    }
    //game.Thing.prototype.draw.call(this, drawpos);
};
game.Explosion.prototype.update = function(dt) {
    game.Thing.prototype.update.call(this, dt);
    
    if (this.frame > this.maxframe) {
        return false;
    }
    return true;
};

//}());
