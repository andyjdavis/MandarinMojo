//(function() {

window.game = window.game || { };

game.Map = function(jsonobj) {
    this.jsonobj = jsonobj;
    //alert(this.jsonobj.layers[0].name);

    this.background1layer = "background";
    this.background2layer = "backgrounddecoration";
    //this.impassablelayer = "impassable";
    this.forebackground1layer = "foreground";

    /*this.numImagesLoaded = 0;
    this.imagedict = {
        'tiles': "basictiles_2.png"
    };
    this.images = Array(1);
    for (var name in this.imagedict) {
        this.images[name] = new Image();
        this.images[name].onload = onImageLoad;
        this.images[name].src = this.imagedict[name];
    }*/
};

game.Map.prototype._drawTile = function(x, y, drawWidth, drawHeight, layerName, cameraposition) {
    var layer = null,
    imageindex = null,
    sourceWidth = null,
    sourceX = null,
    sourceY = null;

    var img = gWorld.images.getImage('tiles');
    if (!img) {
        return;
    }

    var layerFound = false;
    for (var i in this.jsonobj.layers) {
        layer = this.jsonobj.layers[i];
        if (layer.name != layerName) {
            continue;
        }
        layerFound = true;
        imageindex = layer.data[x + this.jsonobj.width * y] - 1;

        sourceWidth = this.jsonobj.tilesets[0].imagewidth / this.jsonobj.tilesets[0].tilewidth;
        sourceX = (imageindex % sourceWidth) * this.jsonobj.tilewidth;
        sourceY = parseInt(imageindex / sourceWidth) * this.jsonobj.tileheight;

        //gWorld.context.drawImage(img,
        gContext.drawImage(img,
                                 sourceX,
                                 sourceY,
                                 this.jsonobj.tilewidth,
                                 this.jsonobj.tileheight,
                                 (x * drawWidth) - cameraposition[0],
                                 (y * drawHeight) - cameraposition[1],
                                 drawWidth,
                                 drawHeight);
    }
    if (!layerFound) {
        console.log(layerName + ' layer not found');
    }
}

game.Map.prototype.drawBackgroundTile = function(x, y, drawWidth, drawHeight, cameraposition) {
    this._drawTile(x, y, drawWidth, drawHeight, this.background1layer, cameraposition);
    this._drawTile(x, y, drawWidth, drawHeight, this.background2layer, cameraposition);
};

game.Map.prototype.drawImpassableTile = function(x, y, drawWidth, drawHeight, cameraposition) {
    //this._drawTile(x, y, drawWidth, drawHeight, this.impassablelayer);
}

game.Map.prototype.drawForegroundTile = function(x, y, drawWidth, drawHeight, cameraposition) {
    this._drawTile(x, y, drawWidth, drawHeight, this.forebackground1layer, cameraposition);
}

game.Map.prototype.getMapDimensions = function() {
    return [this.jsonobj.width, this.jsonobj.height];
}

game.Map.prototype.tilePassable = function(x, y) {
};

//gImages = new game.ImageManager();

//}());
