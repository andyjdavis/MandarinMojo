import { hsk1 } from "./hsk1"
import { hsk2 } from "./hsk2"
import { hsk3 } from "./hsk3"
import { hsk4 } from "./hsk4"
import { hsk5 } from "./hsk5"
import { hsk6 } from "./hsk6"

const hsk = { hsk1, hsk2, hsk3, hsk4, hsk5, hsk6 }

const levels = 6

export { hsk, levels }

export interface IHskPhrase {
    simp: string, trad: string, pinyin: string, pinyinNumeric: string, eng: string
}
