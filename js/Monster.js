//(function() {

window.game = window.game || { };

game.Monster = function(pos) {
    game.Thing.call(this, pos, [32,32]);
    this.div = createDiv("left_col", "images/monster.png", "30px", "32px");
}
game.Monster.prototype = new game.Thing();
game.Monster.prototype.constructor = game.Monster;
 
game.Monster.prototype.draw = function() {
    //game.Thing.prototype.draw.call(this, this.pos, 'monster');
    this.div.style.left = this.pos[0]+"px";
    this.div.style.top = this.pos[1]+"px";
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
    $("left_col").removeChild(this.div);
}

//}());
