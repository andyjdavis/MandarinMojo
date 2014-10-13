//(function() {

window.game = window.game || { };

game.Projectile = function(pos, vel) {
    game.Thing.call(this, pos, [32,32], vel);
    this.frame = 0;
    this.maxframe = 7;
}
game.Projectile.prototype = new game.Thing();
game.Projectile.prototype.constructor = game.Projectile;
 
game.Projectile.prototype.draw = function() {
    var img = gWorld.images.getImage('fireball');
    if (img) {
        //debug
        //drawRect(gContext, this.pos[0]-1, this.pos[1]-1, this.size[0]+2, this.size[1]+2);
        var sourceWidth = 64;
        if (gWorld.loopCount % 3 == 0) {
            this.frame++;
        }
        if (this.frame > this.maxframe) {
            this.frame = 0;
        }
        var sourceX = sourceWidth * this.frame;
        //var sourceY = sourceWidth * (this.frame % 4);

        gContext.save(); // save current state
        
        var xtranslate = this.pos[0] + this.size[0]/2;
        var ytranslate = this.pos[1] + this.size[1]/2;
        gContext.translate(xtranslate, ytranslate);
        
        var angle = Math.atan2(this.vel[1], this.vel[0]) + Math.PI;
        gContext.rotate(angle); // rotate
        
        gContext.translate(-xtranslate, -ytranslate);
        gContext.drawImage(img, sourceX, 0, sourceWidth, sourceWidth, this.pos[0], this.pos[1], this.size[0], this.size[1]);
        gContext.restore(); // restore original states (no rotation etc)
    }
    //game.Thing.prototype.draw.call(this, drawpos);
};
game.Projectile.prototype.update = function(dt) {
    //this.pos[0] -= dt * 20;
    game.Thing.prototype.update.call(this, dt);
    
    if (this.pos[0] < 0 || this.pos[0] > gCanvas.width || this.pos[1] < 0 || this.pos[1] > gCanvas.height) {
        return false;
    }
    return true;
};

//}());
