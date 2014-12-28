//(function() {

window.game = window.game || { };

game.State_Paused = function() {
    console.log('pausing');
    $("paused").style.visibility = 'visible';
}
game.State_Paused.prototype = new game.Thing();
game.State_Paused.prototype.constructor = game.State_Paused;

game.State_Paused.prototype.end = function() {
    console.log('unpausing');
    $("paused").style.visibility = 'hidden';
};

game.State_Paused.prototype.draw = function() {
};
game.State_Paused.prototype.update = function(dt) {
};

//}());
