//(function() {

window.game = window.game || { };

game.Map = function(jsonobj) {
    this.jsonobj = jsonobj;
    //alert(this.jsonobj.layers[0].name);

    this.objectlayer = "Object Layer";
    this.forebackground1layer = "foreground";
    this.impassablelayer = "impassable";
    this.background2layer = "backgrounddecoration";
    this.background1layer = "background";
};

game.Map.prototype.startDraw = function(cameraposition) {
    this.cameraposition = cameraposition;
    this.labels = [];
}

game.Map.prototype._drawTile = function(x, y, drawWidth, drawHeight, layerName) {
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
    var tileData = null;
    for (var i in this.jsonobj.layers) {
        layer = this.jsonobj.layers[i];
        if (layer.name != layerName) {
            continue;
        }
        layerFound = true;

        tileData = this._getTileData(layer, x, y);
        if (tileData == 0) {
            // Empty tile.
            break;
        }
        imageindex = tileData - 1;

        sourceWidth = this.jsonobj.tilesets[0].imagewidth / this.jsonobj.tilesets[0].tilewidth;
        sourceX = (imageindex % sourceWidth) * this.jsonobj.tilewidth;
        sourceY = parseInt(imageindex / sourceWidth) * this.jsonobj.tileheight;

        gContext.drawImage(img,
                                 sourceX,
                                 sourceY,
                                 this.jsonobj.tilewidth,
                                 this.jsonobj.tileheight,
                                 (x * drawWidth) - this.cameraposition[0],
                                 (y * drawHeight) - this.cameraposition[1],
                                 drawWidth,
                                 drawHeight);
    }
    if (!layerFound) {
        console.log(layerName + ' layer not found');
    }
}

game.Map.prototype.drawBackgroundTile = function(x, y, drawWidth, drawHeight) {
    this._drawTile(x, y, drawWidth, drawHeight, this.background1layer);
    this._drawTile(x, y, drawWidth, drawHeight, this.background2layer);
};

game.Map.prototype.drawImpassableTile = function(x, y, drawWidth, drawHeight) {
    this._drawTile(x, y, drawWidth, drawHeight, this.impassablelayer);
}

game.Map.prototype.drawForegroundTile = function(x, y, drawWidth, drawHeight) {
    this._drawTile(x, y, drawWidth, drawHeight, this.forebackground1layer);
}

game.Map.prototype.drawLabels = function() {
    this.labels[0] = {
        text: 'asdfddd',
        pos: [10, 20]
    }
    for (var i in this.labels) {
        label = this.labels[i];
        drawText(gContext, label.text, gWorld.textsize, gWorld.textcolor, label.pos[0], label.pos[1]);
    }
}

game.Map.prototype.getMapDimensions = function() {
    return [this.jsonobj.width, this.jsonobj.height];
}

game.Map.prototype.tilePassable = function(coords) {
    var layer = this._getLayer(this.impassablelayer);
    tileData = this._getTileData(layer, coords[0], coords[1]);
    return tileData == 0;
};
game.Map.prototype.getObjectLayer = function() {
    return this._getLayer(this.objectlayer);
};
game.Map.prototype._getLayer = function(layername) {
    for (var i in this.jsonobj.layers) {
        layer = this.jsonobj.layers[i];
        if (layer.name == layername) {
            return layer;
        }
    }
    return null;
};
game.Map.prototype._getTileData = function(layer, x, y) {
    return layer.data[x + this.jsonobj.width * y];
}

//}());
