//(function() {

window.game = window.game || { };

game.StateManager = function() {
    this.states = {
        LOADING: 0,
        PREGAME: 1,
        INGAME: 2,
        PAUSED: 3,
        BETWEENLEVELS: 4,
        END: 5
    };
    this.state = this.states.LOADING;
};

game.StateManager.prototype.setState = function(s) {
    this.state = s; //should be doing some checking here
};
game.StateManager.prototype.getState = function(s) {
    return this.state;
};

//}());
