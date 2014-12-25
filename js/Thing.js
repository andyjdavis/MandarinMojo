//(function() {

window.game = window.game || { };

game.Thing = function(pos, size, vel) {
    this.pos = pos;
    this.size = size;
    if (this.size != undefined) {
        this.footprint = [this.size[0], this.size[1]/3];
    }

    if (vel == undefined) {
        this.vel = [0, 0];
    } else {
        this.vel = vel;
    }
    this.angle = 0; //radians
};
game.Thing.prototype.update = function(dt) {
    if (this.vel == undefined) {
        return;
    }
    if (this.vel[0] != 0 || this.vel[1] != 0) {
        var deltaX = this.vel[0] * dt;
        var deltaY = this.vel[1] * dt;
        this.pos[0] += deltaX;
        this.pos[1] += deltaY;
    }
    
    //lockToScreen(this, false);
};
game.Thing.prototype.draw = function(drawpos, imageName) {
    var pos = this.pos;
    if (this.getCollisionPos) {
        pos = this.getCollisionPos();
    }
    drawBox(gContext, pos[0], pos[1], this.footprint[0], this.footprint[1], 'red');

    var img = gWorld.images.getImage(imageName);
    if (img) {
        gContext.drawImage(img, drawpos[0], drawpos[1]);
    }
};
/*game.Thing.prototype.getCenter = function() {
    return [this.pos[0]+(this.size/2), this.pos[1]+(this.size/2)];
};*/
/*game.Thing.prototype.containsPoint = function(p) {
    var v = calcVector(p, this.getCenter());
    var dist = calcDistance(v);
    if (dist <= this.size/2) {
        return true;
    } else {
        return false;
    }
};*/
game.Thing.prototype.collideThing = function(other) {
    var thispos = this.pos;
    if (this.getCollisionPos) {
        thispos = this.getCollisionPos();
    }
    var otherpos = other.pos;
    if (other.getCollisionPos) {
        otherpos = other.getCollisionPos();
    }

    if (thispos[0] + this.size[0] < otherpos[0]
        || thispos[0] > otherpos[0] + other.footprint[0]
        || thispos[1] > otherpos[1] + other.size[1]
        || thispos[1] + this.size[1] < otherpos[1] + other.size[1] - other.footprint[1]) {
        
        return false;
    } else {
        return true;
    }
}
/*game.Thing.prototype.circleCollide = function(otherThing) {
    var p1 = [this.pos[0] + this.size/2, this.pos[1] + this.size/2];
    var p2 = [otherThing.pos[0] + otherThing.size/2, otherThing.pos[1] + otherThing.size/2];
    var dist = calcDistance(calcVector(p1, p2));
    return dist < this.size/2 + otherThing.size/2;
};*/
/*game.Thing.prototype.damage = function(n) {
    this.health -= n;
    if (this.health <= 0) {
        console.log('dead');
    }
};*/

//}());
