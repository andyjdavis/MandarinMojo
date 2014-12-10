//(function() {

window.game = window.game || { };

game.StateManager = function() {
    this.states = {
        LOADING: 0,
        ARENAINTRO: 1,
        ARENA: 2,
        ARENAEND: 3,
        PAUSED: 4,
        MAP: 5,
    };
    this.setState(this.states.LOADING);
};

game.StateManager.prototype.setState = function(s) {
    this.state = s;

    if (this.stateengine) {
        this.stateengine.end();
    }
    switch(this.state) {
        case this.states.LOADING:
            this.stateengine = new game.State_Loading();
            break;
        case this.states.ARENAINTRO:
            this.stateengine = new game.State_ArenaIntro();
            break;
        case this.states.ARENA:
            this.stateengine = new game.State_Arena();
            break;
        case this.states.ARENAEND:
            this.stateengine = new game.State_ArenaEnd();
            break;
        case this.states.MAP:
            this.stateengine = new game.State_Map();
            break;
        default:
            console.log('unknown state:'+s);
    }
    this.stateengine.start();
};
game.StateManager.prototype.getState = function(s) {
    return this.state;
};

//}());
