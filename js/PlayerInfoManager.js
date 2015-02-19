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
    if (gWorld.debug) {
        /*console.log('revew queue length:'+this.problems.length);
        console.log(this.problems[0].getCorrectWord().character);
        console.log(this.problems[1].getCorrectWord().character);
        console.log(this.problems[2].getCorrectWord().character);

        console.log('marking problem 2 correct');
        this.problemCorrect(this.problems[2]);
        this.sortProblems();
        console.log(this.problems[0].getCorrectWord().character);
        console.log(this.problems[1].getCorrectWord().character);
        console.log(this.problems[2].getCorrectWord().character);

        console.log('marking problem 1 wrong');
        this.problemWrong(this.problems[1]);
        this.sortProblems();
        console.log(this.problems[0].getCorrectWord().character);
        console.log(this.problems[1].getCorrectWord().character);
        console.log(this.problems[2].getCorrectWord().character);

        console.log('marking problem 2 correct');
        this.problemCorrect(this.problems[2]);
        this.sortProblems();
        console.log(this.problems[0].getCorrectWord().character);
        console.log(this.problems[1].getCorrectWord().character);
        console.log(this.problems[2].getCorrectWord().character);*/
    }

    this.sortProblems();
};
game.PlayerInfoManager.prototype.problemWrong = function(problem) {
    var i = this._getProblemIndex(problem);

    this.problems[i].delayindex = 0;
    var delay = this.delays[0];
    this.problems[i].timedue = new Date().getTime() + delay;
    console.log("problem wrong so setting time delay to now + "+delay);

    this.sortProblems();
}
game.PlayerInfoManager.prototype.problemCorrect = function(problem) {
    var i = this._getProblemIndex(problem);

    if (this.problems[i].delayindex < this.delays.length - 2) {
        this.problems[i].delayindex++;
    }
    var delay = this.delays[this.problems[i].delayindex];
    this.problems[i].timedue = new Date().getTime() + delay;
    console.log("problem correct so setting time delay to now + "+delay);

    this.sortProblems();
}
game.PlayerInfoManager.prototype._getProblemIndex = function(p) {
    var character = p.getCorrectWord().character;
    for (var i in this.problems) {
        if (this.problems[i].getCorrectWord().character == character) {
            return i;
        }
    }
}
game.PlayerInfoManager.prototype.sortProblems = function() {
    // Remember, highest time goes to the end so we can use pop()
    this.problems.sort(function(a, b) {
        if (a.timedue > b.timedue) {
            return -1;
        }
        if (a.timedue < b.timedue) {
            return 1;
        }
        return 0;
    });
}
//}());
