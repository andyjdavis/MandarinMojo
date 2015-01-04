//(function() {

window.game = window.game || { };

game.State_Map = function() {
    this.cameraposition = [0, 0];

    this.cameraright = false;
    this.cameraleft = false;
    this.cameraup = false;
    this.cameradown = false;

    var xmlhttp = new XMLHttpRequest();
    var url = "maps/mandarinmojo.json";

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var jsonobj = JSON.parse(xmlhttp.responseText);
            gWorld.map = new game.Map(jsonobj);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    if (gWorld.mapplayer) {
        this.player = gWorld.mapplayer;
    } else {
        this.player = new game.Player([gCanvas.width/2, gCanvas.height/2]);
        gWorld.mapplayer = this.player;
    }
}
game.State_Map.prototype = new game.Thing();
game.State_Map.prototype.constructor = game.State_Map;

game.State_Map.prototype.end = function() {
    //gWorld.mapplayer = this.player;
};

game.State_Map.prototype.draw = function() {
    if (gWorld.map) {
        mapsize = gWorld.map.getMapDimensions();
        for (var x = 0; x < mapsize[0]; x++) {
            for (var y = 0; y < mapsize[1]; y++) {
                gWorld.map.drawBackgroundTile(x, y, gWorld.tileDisplayWidth, gWorld.tileDisplayWidth, this.cameraposition);
                gWorld.map.drawImpassableTile(x, y, gWorld.tileDisplayWidth, gWorld.tileDisplayWidth, this.cameraposition);
                gWorld.map.drawForegroundTile(x, y, gWorld.tileDisplayWidth, gWorld.tileDisplayWidth, this.cameraposition);
            }
        }
        this.player.draw(this.cameraposition);
    }
};
game.State_Map.prototype.update = function(dt) {
    var lastpos = this.player.pos.slice(0);
    this.player.update(dt);
    if (this.checkCollisions()) {
        gWorld.mapplayer.pos = lastpos;
        return;
    }

    if (this.player.pos[0] - this.cameraposition[0] > (gCanvas.width * 0.8)) {
        this.cameraright = true;
    } else if (this.cameraposition[0] > 0 && this.player.pos[0] - this.cameraposition[0] < (gCanvas.width * 0.2)) {
        this.cameraleft = true;
    }
    if (this.player.pos[1] - this.cameraposition[1] > (gCanvas.height * 0.8)) {
        this.cameradown = true;
    } else if (this.cameraposition[1] > 0 && this.player.pos[1] - this.cameraposition[1] < (gCanvas.height * 0.2)) {
        this.cameraup = true;
    }

    var speed = 6;
    if (this.cameraright) {
        this.cameraposition[0] += speed;
    } else if (this.cameraleft) {
        this.cameraposition[0] -= speed;
        this.cameraposition[0] = this.cameraposition[0] < 0 ? 0 : this.cameraposition[0];
    }
    if (this.cameradown) {
        this.cameraposition[1] += speed;
    } else if (this.cameraup) {
        this.cameraposition[1] -= speed;
        this.cameraposition[1] = this.cameraposition[1] < 0 ? 0 : this.cameraposition[1];
    }

    if (this.player.pos[0] - this.cameraposition[0] < (gCanvas.width * 0.25)) {
        this.cameraright = false;
    } else if (this.player.pos[0] - this.cameraposition[0] > (gCanvas.width * 0.75)) {
        this.cameraleft = false;
    }
    if (this.player.pos[1] - this.cameraposition[1] < (gCanvas.height * 0.25)) {
        this.cameradown = false;
    } else if (this.player.pos[1] - this.cameraposition[1] > (gCanvas.height * 0.75)) {
        this.cameraup = false;
    }
};
game.State_Map.prototype.checkCollisions = function() {
    if (!gWorld.map) {
        return false;
    }
    var objectlayer = gWorld.map.getObjectLayer();
    for (var i in objectlayer.objects) {
        if (objectlayer.objects[i].type == 'arena') {
            if (this.checkCollisionWithPlayer(objectlayer.objects[i])) {
                // Enter the arena.
                var state = gWorld.state.setState(gWorld.state.states.ARENAINTRO);
                state.level = objectlayer.objects[i].properties.level;
                state.wordindex = objectlayer.objects[i].properties.wordindex;
                state.wordcount = objectlayer.objects[i].properties.wordcount;
                return true;
            }
        }
    }

    pos1 = this._getMapCoords(this.player.pos);
    pos2 = this._getMapCoords([this.player.pos[0] + this.player.size[0], this.player.pos[1] + this.player.size[1]]);
    if (!gWorld.map.tilePassable(pos1) || !gWorld.map.tilePassable(pos2)) {
        return true;
    }

    return false;
};
game.State_Map.prototype._getMapCoords = function(pos) {
    return [Math.floor(pos[0] / gWorld.tileDisplayWidth),
            Math.floor(pos[1] / gWorld.tileDisplayWidth)];
};
game.State_Map.prototype.checkCollisionWithPlayer = function(obj) {
    if (this.player.pos[0] + this.player.size[0] < obj.x
        || this.player.pos[0] > obj.x + obj.width
        || this.player.pos[1] + this.player.size[1] < obj.y
        || this.player.pos[1] > obj.y + obj.height
    ) {
        return false;
    }
    return true;
}

//}());
