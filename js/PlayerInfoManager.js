//(function() {

window.game = window.game || { };

game.PlayerInfoManager = function() {
    this.highscores = [0,0,0,0,0,0];
    this.levels = [];
    this.problems = [];
};

game.PlayerInfoManager.prototype.addLevel = function(level) {
    for (var i in this.levels) {
        if (this.levels[i] == level) {
            return;
        }
    }
    this.levels.push(level);
    this.problems = this.problems.concat(gWorld.problems[level - 1]);
};
game.PlayerInfoManager.prototype.wordWrong = function() {
    var wrong = this.problems.pop();
    this.problems.splice(this.problems.length - getRandomInt(2, 6), 0, wrong);
}
//}());
