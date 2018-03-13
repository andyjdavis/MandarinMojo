import { hsk, IHskPhrase } from "./lang"
import { Problem } from "./Problem/Problem"
import { Word } from "./Problem/Word"
import { getRandomInt, shuffleArray } from "./util"

export interface IWordManagerOptions {
    traditional: boolean,
    debug: boolean,
    hsk1?: true,
    hsk2?: true,
    hsk3?: true,
    hsk4?: true,
    hsk5?: true,
    hsk6?: true,
}

export class WordManager {
    public loadProblems(options: IWordManagerOptions): Problem[][] {
        const wordobjects: Word[][] = []
        const problems: Problem[][] = Array()

        for (let i = 1; i <= 6; i++) {
            // const name = "HSK" + i.toString()
            wordobjects[i] = []
            // console.log(`${name} ${getParameterByName(name)}`)
            // if (getParameterByName(name)) {
            wordobjects[i].push(...this.load(i, options.traditional))
            // }
            // console.log(JSON.stringify(wordobjects[i]))
        }

        let correctwordcharcount = 0
        let wrongword = null
        let wordarray = null
        let attempts = 0

        for (let i = 1; i <= 6; i++) {
            const totalwordcount = wordobjects[i].length
            problems[i] = Array()

            let lengthNotMatch = 0

            // tslint:disable-next-line:forin
            for (const j in wordobjects[i]) {
                correctwordcharcount = wordobjects[i][j].character.length
                wordarray = Array()
                wordarray.push(wordobjects[i][j])
                attempts = 0

                while (wordarray.length < 4) {
                    wrongword = wordobjects[i][getRandomInt(0, totalwordcount - 1)]
                    if (
                        wrongword.character !== wordobjects[i][j].character &&
                        (attempts > 40 || wrongword.character.length === correctwordcharcount)
                    ) {
                        if (options.debug && attempts > 40) {
                            lengthNotMatch++
                            // console.debug("gave up trying to character count match "+wordobjects[i][j].character);
                        }
                        wrongword = new Word(
                            wrongword.character,
                            wrongword.pinyin,
                            wrongword.getToRead(true, options.debug),
                            wrongword.english,
                            false,
                        )
                        wordarray.push(wrongword)
                        attempts = 0
                    } else {
                        attempts++
                    }
                }
                problems[i].push(new Problem(shuffleArray(wordarray)))
            }
            problems[i] = shuffleArray(problems[i])

            if (options.debug) {
                console.debug("loaded file " + i)
                console.debug("contains how many phrases? " + problems[i].length)
                console.debug(
                    lengthNotMatch + " incorrect answers could not be length matched",
                )
            }
        }
        return problems
    }
    private load(hskLevel: number, traditional: boolean): Word[] {
        const words: IHskPhrase[] = this.getLevel(hskLevel)

        const wordobjects: Word[] = []
        for (const word of words) {
            wordobjects.push(
                new Word(
                    traditional ? word.trad : word.simp,
                    word.pinyin,
                    word.pinyinNumeric,
                    word.eng,
                    true,
                ),
            )
        }

        return wordobjects
    }
    private getLevel(level: number) {
        switch (level) {
            case 2:
                return hsk.hsk2
            case 3:
                return hsk.hsk3
            case 4:
                return hsk.hsk4
            case 5:
                return hsk.hsk5
            case 6:
                return hsk.hsk6
            case 1:
            default:
                return hsk.hsk1
        }
    }
}
