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
        this.player = new game.Player([50, 50]);
        gWorld.mapplayer = this.player;
    }

    gCanvas.width = gWorld.mapWidth;
    gCanvas.height = gWorld.mapHeight;

    gLeft.setAttribute('width', gWorld.mapWidth+'px');
}
game.State_Map.prototype = new game.Thing();
game.State_Map.prototype.constructor = game.State_Map;

game.State_Map.prototype.end = function() {
    //gWorld.mapplayer = this.player;
};

game.State_Map.prototype.draw = function() {
    if (gWorld.map) {
        gWorld.map.draw(this.cameraposition, this._getBottomRight());
    }
    this.player.draw(this.cameraposition);
};
game.State_Map.prototype._getBottomRight = function() {
    return [this.cameraposition[0] + gWorld.mapWidth, this.cameraposition[1] + gWorld.mapHeight];
}
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

    var speed = 300;
    var delta = speed * dt;

    // Do not scroll past the bottom and right edge of the map.
    if (this.cameraright || this.cameradown) {
        var bottomRight = this._getBottomRight();
        var mapBottomRight = [gWorld.map.jsonobj.tilewidth * gWorld.tileDisplayWidth,
                              gWorld.map.jsonobj.tileheight * gWorld.tileDisplayWidth];

        if (this.cameraright) {
            if (bottomRight[0] + delta > mapBottomRight[0]) {
                this.cameraright = false;
            }
        }
        if (this.cameradown) {
            if (bottomRight[1] + delta > mapBottomRight[1]) {
                this.cameradown = false;
            }
        }
    }

    if (this.cameraright) {
        this.cameraposition[0] += delta;
    } else if (this.cameraleft) {
        this.cameraposition[0] -= delta;
        this.cameraposition[0] = this.cameraposition[0] < 0 ? 0 : this.cameraposition[0];
    }
    if (this.cameradown) {
        this.cameraposition[1] += delta;
    } else if (this.cameraup) {
        this.cameraposition[1] -= delta;
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
