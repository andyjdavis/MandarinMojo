import { Word } from "./Word"

export class Problem {
    public words: Word[]
    public timedue: number
    public delayindex: number

    constructor(words: Word[]) {
        this.words = words // words.slice(0);
        this.timedue = 0
        this.delayindex = 0
    }
    public clone() {
        return new Problem(this.words)
    }
    public getCorrectWord() {
        for (const i in this.words) {
            if (this.words[i].correct) {
                return this.words[i]
            }
        }
        return null
    }

}
