//(function() {

window.game = window.game || { };

game.Player = function(pos) {
    game.Thing.call(this, pos, [32, 48]);

    // Make the player's footprint bigger to make the top character appearing
    // over the top of the player less noticable.
    this.footprint = [this.size[0], this.size[1]/2];

    this.maxvel = 200;
    this.frame = 0;
    this.maxframe = 10;
    this.walking = false;
    this.goingleft = false;
    //this.div = createDiv("left_col", "images/player/p1_spritesheet.png", "32px", "32px", 'playerdiv');
    
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

game.Player.prototype.draw = function() {
    var img = gWorld.images.getImage('hero');
    if (!img) {
        return;
    }
    //game.Thing.prototype.draw.call(this, this.pos, 'hero');
    /*if (this.div.style.left != this.pos[0]+"px") {
        this.div.style.left = this.pos[0]+"px";
    }
    if (this.div.style.top != this.pos[1]+"px") {
        this.div.style.top = this.pos[1]+"px";
    }*/
    var sourceWidth = 72;
    var sourceHeight = 97;
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
            var flipAxis = this.pos[0] + this.size[0]/2;
            gContext.translate(flipAxis, 0);
            gContext.scale(-1, 1);
            gContext.translate(-flipAxis, 0);
        }

        gContext.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, this.pos[0], this.pos[1], this.size[0], this.size[1]);
        //this.div.style.backgroundPosition = "-"+sourceX+"px -"+sourceY+"px";

        if (this.goingleft) {
            gContext.restore();
        }
    } else {
        var sourceX = this.standingsourcelocations[0];
        var sourceY = this.standingsourcelocations[1];
        gContext.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, this.pos[0], this.pos[1], this.size[0], this.size[1]);
    }
}
game.Player.prototype.setvisibility = function(visibility) {
    //this.div.style.visibility = visibility;
}

game.Player.prototype.update = function(dt) {
    this.walking = false;
    this.goingleft = false;

    if (gWorld.keyState[87] || gWorld.keyState[38]) { //up
        //this.vel[1] = -this.maxvel;
        this.pos[1] = Math.round(this.pos[1] - this.maxvel * dt);
        this.walking = true;
    }
    if (gWorld.keyState[83] || gWorld.keyState[40]) { //down
        //this.vel[1] = this.maxvel;
        this.pos[1] = Math.round(this.pos[1] + this.maxvel * dt);
        this.walking = true;
    }
    if (gWorld.keyState[65] || gWorld.keyState[37]) { //left
        //this.vel[0] = -this.maxvel;
        this.pos[0] = Math.round(this.pos[0] - this.maxvel * dt);
        this.walking = true;
        this.goingleft = true;
    }
    if (gWorld.keyState[68] || gWorld.keyState[39]) { //right
        //this.vel[0] = this.maxvel;
        this.pos[0] = Math.round(this.pos[0] + this.maxvel * dt);
        this.walking = true;
    }
    //if (gWorld.keyState[32]) { //spacebar - guns
    //    this.shoot();
    //}
    
    if (this.pos[0] < 30) {
        this.pos[0] = 30;
    }
    if (this.pos[1] < 30) {
        this.pos[1] = 30;
    }
    if (this.pos[0] + this.size[0] > gCanvas.width - 30) {
        this.pos[0] = gCanvas.width - 30 - this.size[0];
    }
    if (this.pos[1] + this.size[1] > gCanvas.height - 30) {
        this.pos[1] = gCanvas.height - 30 - this.size[1];
    }
    //game.Thing.prototype.update.call(this, dt);
}

//}());

