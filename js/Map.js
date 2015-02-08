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
game.Map.prototype.draw = function(cameraposition, bottomRight, opacity) {
    if (opacity && gContext.globalAlpha != opacity) {
        gContext.save();
        gContext.globalAlpha = opacity;
    }

    this._startDraw(cameraposition, bottomRight);
    mapsize = this.getMapDimensions();
    for (var x = 0; x < mapsize[0]; x++) {
        for (var y = 0; y < mapsize[1]; y++) {
            this.drawBackgroundTile(x, y, gWorld.tileDisplayWidth, gWorld.tileDisplayWidth);
            this.drawImpassableTile(x, y, gWorld.tileDisplayWidth, gWorld.tileDisplayWidth);
            this.drawForegroundTile(x, y, gWorld.tileDisplayWidth, gWorld.tileDisplayWidth);
        }
    }
    this.drawLabels();
    if (opacity && gContext.globalAlpha != opacity) {
        gContext.restore();
    }
}

game.Map.prototype._startDraw = function(cameraposition, bottomRight) {
    this.cameraposition = cameraposition;
    this.bottomRight = bottomRight;
    this.labels = [];

    var objectlayer = this.getObjectLayer();
    for (var i in objectlayer.objects) {
        if (objectlayer.objects[i].properties.label) {
            this.labels.push({
                text: objectlayer.objects[i].properties.label,
                pos: [objectlayer.objects[i].x +  + objectlayer.objects[i].width/2,
                      objectlayer.objects[i].y + objectlayer.objects[i].height]});

        }
    }
}

game.Map.prototype._drawTile = function(x, y, drawWidth, drawHeight, layerName) {
    var layer = null,
    imageindex = null,
    sourceWidth = null,
    sourceX = null,
    sourceY = null;

    // Calc the draw position and check it is on screen.
    var drawX = (x * drawWidth) - this.cameraposition[0];
    var drawY = (y * drawHeight) - this.cameraposition[1];
    if (drawX < 0 - drawWidth || drawY < 0 - drawHeight) {
        return;
    }
    if (drawX > this.bottomRight[0] || drawY > this.bottomRight[0]) {
        return;
    }

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
                                 drawX,
                                 drawY,
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
    for (var i in this.labels) {
        label = this.labels[i];
        drawText(gContext,
                 label.text,
                 gWorld.textsize,
                 gWorld.textcolor,
                 label.pos[0] - this.cameraposition[0],
                 label.pos[1] - this.cameraposition[1]);
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
