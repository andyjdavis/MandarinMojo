//(function() {

window.game = window.game || { };

game.Monster = function(pos) {
    this.frame = 0;
    this.maxframe = 1;

    switch(getRandomInt(0, 2)) {
        case 0:
            this.sourcesize = [
                [72, 36],
                [75, 31]
            ];
            this.sourcelocations = [
                [0, 32],
                [0, 0],
            ];
            break;
        case 1:
            this.sourcesize = [
                [50, 28],
                [51, 26]
            ];
            this.sourcelocations = [
                [52, 125],
                [0, 125],
            ];
            break;
        case 2:
            this.sourcesize = [
                [54, 31],
                [57, 31]
            ];
            this.sourcelocations = [
                [143, 34],
                [67, 87],
            ];
            break;
    }

    game.Thing.call(this, pos, [32, 32]);
    //this.div = createDiv("left_col", "images/monster.png", "30px", "32px");
}
game.Monster.prototype = new game.Thing();
game.Monster.prototype.constructor = game.Monster;
 
game.Monster.prototype.draw = function() {
    //game.Thing.prototype.draw.call(this, this.pos, 'monster');
    //this.div.style.left = this.pos[0]+"px";
    //this.div.style.top = this.pos[1]+"px";
    var img = gWorld.images.getImage('monster');
    if (!img) {
        return;
    }

    if (gWorld.loopCount % 10 == 0) {
        this.frame++;
    }
    if (this.frame > this.maxframe) {
        this.frame = 0;
    }
    
    if (this.vel[0] > 0) {
        gContext.save();
        var flipAxis = this.pos[0] + this.size[0]/2;
        gContext.translate(flipAxis, 0);
        gContext.scale(-1, 1);
        gContext.translate(-flipAxis, 0);
    }
    
    var sourceX = this.sourcelocations[this.frame][0];
    var sourceY = this.sourcelocations[this.frame][1];
    var sourceWidth = this.sourcesize[this.frame][0];
    var sourceHeight = this.sourcesize[this.frame][1];
    //gContext.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, this.pos[0], this.pos[1], this.size[0], this.size[1]);
    gContext.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, this.pos[0], this.pos[1], sourceWidth/2, sourceHeight/2);

    if (this.vel[0] > 0) {
        gContext.restore();
    }
};
game.Monster.prototype.update = function(dt) {
    if (gWorld.player != undefined) {
        var vect = calcNormalVector(gWorld.player.pos, this.pos);
        var maxvar = 1200;
        this.vel[0] = maxvar * dt * vect[0];
        this.vel[1] = maxvar * dt * vect[1];
    }
    game.Thing.prototype.update.call(this, dt);
};
game.Monster.prototype.die = function() {
    //$("left_col").removeChild(this.div);
}

//}());
