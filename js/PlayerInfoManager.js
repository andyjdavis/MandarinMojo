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
game.PlayerInfoManager.prototype.problemWrong = function() {
    var wrong = this.problems.pop();
    // Scatter instances of the incorrectly answered problem.
    this.problems.splice(this.problems.length - getRandomInt(2, 6), 0, wrong);
    this.problems.splice(this.problems.length - getRandomInt(6, 15), 0, wrong);
    this.problems.splice(this.problems.length - getRandomInt(15, 25), 0, wrong);
    this.problems.splice(this.problems.length - getRandomInt(25, 100), 0, wrong);
    this.problems.splice(this.problems.length - getRandomInt(25, 150), 0, wrong);
}
game.PlayerInfoManager.prototype.problemCorrect = function() {
    var correct = this.problems.pop();
}
//}());
