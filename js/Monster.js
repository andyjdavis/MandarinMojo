//(function() {

window.game = window.game || { };

game.Monster = function(pos, type) {
    this.type = type;
    this.frame = 0;
    this.maxframe = 1;

    switch(this.type) {
        case 0:
            // Fly.
            this.lives = 1;
            this.sourcesize = [
                [72, 36],
                [75, 31]
            ];
            this.sourcelocations = [
                [0, 32],
                [0, 0],
            ];
            this.deadsize = [59, 33];
            this.deadlocation = [143, 0];
            break;
        case 1:
            // Blob.
            this.lives = 2;
            this.sourcesize = [
                [50, 28],
                [51, 26]
            ];
            this.sourcelocations = [
                [52, 125],
                [0, 125],
            ];
            this.deadsize = [59, 12];
            this.deadlocation = [0, 112];
            break;
        case 2:
            // Snail.
            this.lives = 3;
            this.sourcesize = [
                [54, 31],
                [57, 31]
            ];
            this.sourcelocations = [
                [143, 34],
                [67, 87],
            ];
            this.deadsize = [44, 30];
            this.deadlocation = [148, 118];
            break;
    }

    game.Thing.call(this, pos, [32, 32]);
}
game.Monster.prototype = new game.Thing();
game.Monster.prototype.constructor = game.Monster;
 
game.Monster.prototype.draw = function(camerapos) {
    var img = gWorld.images.getImage('monster');
    if (!img) {
        return;
    }

    if (this.isDead()) {
        var sourceX = this.deadlocation[0];
        var sourceY = this.deadlocation[1];
        var sourceWidth = this.deadsize[0];
        var sourceHeight = this.deadsize[1];
        gContext.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, this.pos[0]+camerapos[0], this.pos[1]+camerapos[1], sourceWidth/2, sourceHeight/2);
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
    gContext.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, this.pos[0]+camerapos[0], this.pos[1]+camerapos[1], sourceWidth/2, sourceHeight/2);

    if (this.vel[0] > 0) {
        gContext.restore();
    }

    game.Thing.prototype.draw.call(this); // Draw bounding box.
};
game.Monster.prototype.update = function(dt, player) {
    if (this.isDead() && Date.now() > this.timeDied + 2000) {
        return false;
    }
    if (this.isDead()) {
        return true;
    }
    if (player != undefined) {
        var vect = calcNormalVector(player.pos, this.pos);
        var maxvar = null;
        switch(this.type) {
            case 0:
                // Fly.
                maxvar = 2500;
                break;
            case 1:
                // Blob.
                maxvar = 1600;
                break;
            case 2:
                // Snail.
                maxvar = 1000;
                break;
        }
        this.vel[0] = maxvar * dt * vect[0];
        this.vel[1] = maxvar * dt * vect[1];
    }
    game.Thing.prototype.update.call(this, dt);
    return true;
};
game.Monster.prototype.die = function() {
    //$("left_col").removeChild(this.div);
};
game.Monster.prototype.hit = function() {
    this.lives--;
    if (this.isDead()) {
        this.timeDied = Date.now();
    }
};
game.Monster.prototype.isDead = function() {
    return this.lives <= 0;
}

//}());
