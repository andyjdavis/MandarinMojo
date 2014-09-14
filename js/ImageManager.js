//(function() {

window.game = window.game || { };

function onImageLoad() {
    gWorld.images.numImagesLoaded++;
}

game.ImageManager = function() {
    this.numImagesLoaded = 0;
    this.imagedict = {
        //'background': "images/background.png",
        'hero': "images/hero.png",
        'fireball': "images/fireball.png",
        'monster': "images/monster.png",
        'explosion': "images/explosion.png"
    };
    this.images = Array(4);
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
