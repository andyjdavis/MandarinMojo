//(function() {

window.game = window.game || { };

game.State_Map = function() {
    this.cameraposition = [0, 0];
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
    }
};
game.State_Map.prototype.update = function(dt) {
    this.cameraposition[0] += 1;
    this.cameraposition[1] += 1;
};

//}());
