//(function() {

// the onscreen representation of the character

window.game = window.game || { };

game.Character = function(pos, alignment, slotindex, iscorrect, character, pinyin, english) {
    game.Thing.call(this, pos, [32,32], [0, 0]);
    this.alignment = alignment;
    this.slotindex = slotindex;
    this.iscorrect = iscorrect;
    this.character = character;
    this.pinyin = pinyin;
    this.english = english;
    this.visible = false;

    this._fixSize();
}
game.Character.prototype = new game.Thing();
game.Character.prototype.constructor = game.Character;
 
game.Character.prototype.draw = function() {
    if (this.visible) {
        drawText(gContext, this.character, gWorld.textsize, 'yellow', this.pos[0], this.pos[1], 1.0, this.alignment);
    }
    if (gWorld.debug) {
        // Character position.
        drawRect(gContext, this.getCollisionPos()[0], this.getCollisionPos()[1], 2, 2);
        game.Thing.prototype.draw.call(this); // Draw bounding box.
    }

};
game.Character.prototype.update = function(dt) {
};
game.Character.prototype._fixSize = function() {
    this.size = this.footprint = [this.character.length * 24, 28];
}
game.Character.prototype.getCollisionPos = function() {
    if (this.alignment == 'right') {
        return [this.pos[0] - this.footprint[0], this.pos[1]];
    } else {
        return this.pos;
    }
}

//}());
