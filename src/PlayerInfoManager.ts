import { config } from "./config"
import { Problem } from "./Problem/Problem"
import { IWorld } from "./types"

export class PlayerInfoManager {
    public highscores: number[]
    public levels: any[]
    public problems: Problem[]
    public delays: number[]

    constructor() {
        this.highscores = [0, 0, 0, 0, 0, 0]
        this.levels = []
        this.problems = []
        // 0, 30s, 2m, 10m, 1h, 24h, 7d
        this.delays = [0, 30000, 120000, 600000, 3600000, 86400000, 604800000]
    }

    public addLevel(world: IWorld, level: any) {
        for (const i in this.levels) {
            if (this.levels[i] === level) {
                return
            }
        }
        this.levels.push(level)

        const delayindex = 2
        const t = new Date().getTime() + this.delays[delayindex] // now+2m

        let problem = null
        for (const problems of world.problems[level]) {
            problem = problems.clone()

            problem.delayindex = delayindex
            problem.timedue = t

            this.problems.push(problem)
        }
        if (world.debug) {
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

        this.sortProblems()
    }
    public getProblemsToGoCount() {
        let count = 0
        const now = new Date().getTime()
        // Remember, the next problem due is at the end of the array.
        for (let i = this.problems.length - 1; i > -1; i--) {
            if (this.problems[i].timedue < now) {
                count++
            } else {
                break
            }
        }
        return count
    }
    public problemWrong(problem: Problem) {
        const i = this._getProblemIndex(problem)

        this.problems[i].delayindex = 0

        const delay = this.delays[0]
        this.problems[i].timedue = new Date().getTime() + delay
        if (config.debug) {
            console.log("problem wrong so setting time delay to now + " + delay)
        }

        this.sortProblems()
    }
    public problemCorrect(problem: Problem) {
        const i = this._getProblemIndex(problem)

        if (this.problems[i].delayindex < this.delays.length - 2) {
            this.problems[i].delayindex++
        }
        const delay = this.delays[this.problems[i].delayindex]
        this.problems[i].timedue = new Date().getTime() + delay
        if (config.debug) {
            console.log("problem correct so setting time delay to now + " + delay)
        }

        this.sortProblems()
    }
    public _getProblemIndex(p: Problem): number {
        const correctWord = p.getCorrectWord()
        if (!correctWord) {
            return -1
        }
        const character = correctWord.character
        for (let i = 0; i < this.problems.length; i++) {
            const targetWord = this.problems[i].getCorrectWord()
            if (!targetWord) {
                continue
            }
            if (targetWord.character === character) {
                return i
            }
        }
        return -1
    }
    public sortProblems() {
        // Remember, highest time goes to the end so we can use pop()
        this.problems.sort((a, b) => {
            if (a.timedue > b.timedue) {
                return -1
            }
            if (a.timedue < b.timedue) {
                return 1
            }
            return 0
        })
    }
}
