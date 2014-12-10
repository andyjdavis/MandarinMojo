//(function() {

window.game = window.game || { };

function onImageLoad() {
    gWorld.images.numImagesLoaded++;
}

game.ImageManager = function() {
    this.numImagesLoaded = 0;
    this.imagedict = {
        'background': "images/background.png",
        'hero': "images/player/p1_spritesheet.png",
        'fireball': "images/fireball.png",
        'monster': "images/enemies_spritesheet.png",
        'explosion': "images/explosion.png",
        'tiles': "maps/Tiny32-Complete-Spritesheet-Repack3.png",
    };
    this.images = Array(6);
    for (var name in this.imagedict) {
        this.images[name] = new Image();
        this.images[name].onload = onImageLoad;
        this.images[name].src = this.imagedict[name];
    }
};

game.ImageManager.prototype.getImage = function(name) {
    if (this.images.length == this.numImagesLoaded) {
        return this.images[name];
    } else {
        return null;
    }
};

//gImages = new game.ImageManager();

//}());
