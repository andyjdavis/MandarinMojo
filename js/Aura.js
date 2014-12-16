//(function() {

window.game = window.game || { };

game.Aura = function(centerobj, color, lifespan, opacity) {
    this.centerobj = centerobj;
    this.color = color;
    this.lifespan = lifespan;
    this.opacity = opacity;
    
    this.widthRadians = 0.2 * Math.PI;
    this.angle = (1/3) * Math.PI;
    this.age = 0;
}
game.Aura.prototype = new game.Thing();
game.Aura.prototype.constructor = game.Aura;

game.Aura.prototype.draw = function() {
    if (!this.pos) {
        // update() hasn't run yet.
        return;
    }
    gContext.fillStyle = this.color;
    //this.pos = gWorld.player.pos;
    var h = gCanvas.width;
    
    var interval = Math.PI/2;
    for (var i = 0; i < 4; i++) {
        var drawAngle = this.angle + (interval*i)
        
        var x1 = h * Math.cos(drawAngle) + this.pos[0];
        var y1 = h * Math.sin(drawAngle) + this.pos[1]
        
        var x2 = h * Math.cos(drawAngle + this.widthRadians) + this.pos[0];
        var y2 = h * Math.sin(drawAngle + this.widthRadians) + this.pos[1];
        
        gContext.globalAlpha = this.opacity;
        gContext.beginPath();  
        gContext.moveTo(this.pos[0], this.pos[1]);  
        gContext.lineTo(x1, y2);
        gContext.lineTo(x2, y2);  

        gContext.fill();
        gContext.globalAlpha = 1.0;
    }
};
game.Aura.prototype.update = function(dt) {
    this.pos = [this.centerobj.pos[0] + this.centerobj.size[0]/2,
                this.centerobj.pos[1] + this.centerobj.size[1]/2];

    this.angle -= 2*dt;
    this.age += dt;
    return this.age < this.lifespan;
};

//}());
