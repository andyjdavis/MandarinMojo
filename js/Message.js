//(function() {

window.game = window.game || { };

game.Message = function(message) {
    //game.Thing.call(this, pos, [32,32], [0, 0]);
    this.age = 0;
    this.maxage = 2;
    this.message = message;
    //this.div = createDiv("left_col", "images/Message.png", "32px", "32px");
    
    //Messages dont move
    //this.div.style.left = this.pos[0]+"px";
    //this.div.style.top = this.pos[1]+"px";
}
game.Message.prototype = new game.Thing();
game.Message.prototype.constructor = game.Message;

game.Message.prototype.draw = function() {
    drawText(gContext, "Bonus!", '44pt Arial', 'yellow', 170, 200, 0.1);
    drawText(gContext, this.message, '44pt Arial', 'yellow', 135, 270, 0.1);
};
game.Message.prototype.update = function(dt) {
    //game.Thing.prototype.update.call(this, dt);
    this.age += dt;
    if (this.age > this.maxage) {
        return false;
    }
    return true;
};

//}());
