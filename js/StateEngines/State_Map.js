//(function() {

window.game = window.game || { };

game.State_Map = function() {
    this.cameraposition = [0, 0];
    this.player = new game.Player([gCanvas.width/2, gCanvas.height/2]);
}
game.State_Map.prototype = new game.Thing();
game.State_Map.prototype.constructor = game.State_Map;

game.State_Map.prototype.start = function() {
    var xmlhttp = new XMLHttpRequest();
    var url = "maps/32test.json";

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var jsonobj = JSON.parse(xmlhttp.responseText);
            gWorld.map = new game.Map(jsonobj);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
};
game.State_Map.prototype.end = function() {
};

game.State_Map.prototype.draw = function() {
    if (gWorld.map) {
        mapsize = gWorld.map.getMapDimensions();
        for (var x = 0; x < mapsize[0]; x++) {
            for (var y = 0; y < mapsize[1]; y++) {
                gWorld.map.drawBackgroundTile(x, y, 32, 32, this.cameraposition);
                gWorld.map.drawImpassableTile(x, y, 32, 32, this.cameraposition);
                gWorld.map.drawForegroundTile(x, y, 32, 32, this.cameraposition);
            }
        }
        this.player.draw(this.cameraposition);
    }
};
game.State_Map.prototype.update = function(dt) {
    this.player.update(dt);

    var canvasWidth = gCanvas.width;
    if (this.player.pos[0] - this.cameraposition[0] > (canvasWidth * 0.7)) {
        this.cameraposition[0] += 2;
    } else if (this.cameraposition[0] > 0 && this.player.pos[0] - this.cameraposition[0] < (canvasWidth * 0.3)) {
        this.cameraposition[0] -= 2;
    }
};

//}());
