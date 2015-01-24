//(function() {

window.game = window.game || { };

game.Player = function(pos, drawhealth) {
    game.Thing.call(this, pos, [32, 48]);
    this.drawhealth = drawhealth;

    this.maxvel = 200;
    this.frame = 0;
    this.maxframe = 10;
    this.walking = false;
    this.goingleft = false;

    this.health = 4;
    this.maxhealth = 4;
    this.lasthittime = null;
    
    // these came from images/player/p1_spritesheet.txt
    this.standingsourcelocations = [67, 196];
    this.walkingsourcelocations = [
        [0, 0],
        [73, 0],
        [146, 0],
        [0, 98],
        [73, 98],
        [146, 98],
        [219, 0],
        [292, 0],
        [219, 98],
        [365, 0],
        [292, 98],
    ];
}
game.Player.prototype = new game.Thing();
game.Player.prototype.constructor = game.Player;

game.Player.prototype.draw = function(cameraposition) {
    var img = gWorld.images.getImage('hero');
    if (!img) {
        return;
    }
    if (!cameraposition) {
        cameraposition = [0, 0];
    }

    var sourceWidth = 72;
    var sourceHeight = 92;//97;

    var drawX = this.pos[0] - cameraposition[0];
    var drawY = this.pos[1] - cameraposition[1];

    if (this.walking) {
        if (gWorld.loopCount % 2 == 0) {
            this.frame++;
        }
        if (this.frame > this.maxframe) {
            this.frame = 0;
        }
        var sourceX = this.walkingsourcelocations[this.frame][0];
        var sourceY = this.walkingsourcelocations[this.frame][1];

        if (this.goingleft) {
            gContext.save();
            var flipAxis = drawX + this.size[0]/2;
            gContext.translate(flipAxis, 0);
            gContext.scale(-1, 1);
            gContext.translate(-flipAxis, 0);
        }

        gContext.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, drawX, drawY, this.size[0], this.size[1]);

        if (this.goingleft) {
            gContext.restore();
        }
    } else {
        var sourceX = this.standingsourcelocations[0];
        var sourceY = this.standingsourcelocations[1];
        gContext.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, drawX, drawY, this.size[0], this.size[1]);
    }
    game.Thing.prototype.draw.call(this); // Draw bounding box.

    if (this.drawhealth) {
        var width = (this.health/this.maxhealth) * this.size[0];
        var opacity = 0.0;
        if (this.lasthittime) {
            var timepassed = new Date().getTime() - this.lasthittime;
            if (timepassed < 5000) {
                opacity = 1.0 - (timepassed/5000);
            }
        }
        if (opacity > 0) {
            drawRect(gContext, drawX, drawY + this.size[1], width, 4, 'green', opacity);
        }
    }
}
game.Player.prototype.setvisibility = function(visibility) {
    //this.div.style.visibility = visibility;
}
game.Player.prototype.hurt = function() {
    this.health--;
    this.lasthittime = new Date().getTime();
    gWorld.sounds.play("fail");
}
game.Player.prototype.resetHealth = function() {
    this.health = this.maxhealth;
}

game.Player.prototype.update = function(dt, bounds) {
    this.walking = false;
    this.goingleft = false;
    var lastpos = null;
    if (bounds) {
        lastpos = this.pos.slice(0);
    }

    //gWorld.keyState[87] ||
    if (gWorld.keyState[38]) { //up
        //this.vel[1] = -this.maxvel;
        this.pos[1] = Math.round(this.pos[1] - this.maxvel * dt);
        this.walking = true;
    }
    //gWorld.keyState[83] || 
    if (gWorld.keyState[40]) { //down
        //this.vel[1] = this.maxvel;
        this.pos[1] = Math.round(this.pos[1] + this.maxvel * dt);
        this.walking = true;
    }
    //gWorld.keyState[65] || 
    if (gWorld.keyState[37]) { //left
        //this.vel[0] = -this.maxvel;
        this.pos[0] = Math.round(this.pos[0] - this.maxvel * dt);
        this.walking = true;
        this.goingleft = true;
    }
    //gWorld.keyState[68] || 
    if (gWorld.keyState[39]) { //right
        //this.vel[0] = this.maxvel;
        this.pos[0] = Math.round(this.pos[0] + this.maxvel * dt);
        this.walking = true;
    }
    //if (gWorld.keyState[32]) { //spacebar - guns
    //    this.shoot();
    //}

    if (bounds) {
        if (this.pos[0] < bounds[0][0]) {
            this.pos[0] = lastpos[0];
        }
        if (this.pos[0] + this.size[0] > bounds[0][0] + bounds[1][0]) {
            this.pos[0] = bounds[0][0] + bounds[1][0] - this.size[0];
        }
        if (this.pos[1] < bounds[0][1]) {
            this.pos[1] = lastpos[1];
        }
        if (this.pos[1] + this.size[1] > bounds[0][1] + bounds[1][1]) {
            this.pos[1] = bounds[0][1] + bounds[1][1] - this.size[1];
        }
    }
    //game.Thing.prototype.update.call(this, dt);
}

//}());

