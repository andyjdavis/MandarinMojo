//(function() {

window.game = window.game || { };

game.PlayerInfoManager = function() {
    this.highscores = [0,0,0,0,0,0];
    this.levels = [];
    this.problems = [];
    // 0, 30s, 2m, 10m, 1h, 24h, 7d
    this.delays = [0, 30000, 120000, 600000, 3600000, 86400000, 604800000];
};

game.PlayerInfoManager.prototype.addLevel = function(level) {
    for (var i in this.levels) {
        if (this.levels[i] == level) {
            return;
        }
    }
    this.levels.push(level);

    var delayindex = 2;
    var t = new Date().getTime() + this.delays[delayindex]; // now+2m seconds;

    var problem = null;
    for (var i in gWorld.problems[level - 1]) {
        problem = gWorld.problems[level - 1][i].clone();

        problem.delayindex = delayindex;
        problem.timedue = t;

        this.problems.push(problem);
    }

    this.sortProblems();
};
game.PlayerInfoManager.prototype.problemWrong = function() {
    var problem = this.problems[0];
    problem.delayindex = 0;
    problem.timedue = new Date().getTime() + this.delays[0];
    console.log("problem wrong so setting time delay to now + "+this.delays[0]);
    this.sortProblems();
}
game.PlayerInfoManager.prototype.problemCorrect = function() {
    var problem = this.problems[0];
    if (problem.delayindex < this.delays.length - 2) {
        problem.delayindex++;
    }
    problem.timedue = new Date().getTime() + this.delays[problem.delayindex];
    console.log("problem correct so setting time delay to now + "+this.delays[problem.delayindex]);

    this.sortProblems();
}
game.PlayerInfoManager.prototype.sortProblems = function() {
    this.problems.sort(function(a, b) {
        if (a.timedue < b.timedue) {
            return -1;
        }
        if (a.timedue > b.timedue) {
            return 1;
        }
        return 0;
    });
}
//}());
