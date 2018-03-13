import { ImageManager } from "./ImageManager"
import { Map } from "./Map"
import { Message } from "./Message"
import { PlayerInfoManager } from "./PlayerInfoManager"
import { Problem } from "./Problem/Problem"
import { StateManager } from "./StateManager"

export type numberPair = [number, number]

export interface IGlobals {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  world: IWorld
  pageElements: {
    allDivs: HTMLElement[],
    table: HTMLElement,
    question: HTMLElement | null,
    pinyin: HTMLElement | null,
  }
}

export interface IWorld {
  debug: boolean

  keyState: any[]
  state: StateManager | null
  images: ImageManager
  // sounds: SoundManager

  playerinfo: PlayerInfoManager

  tileDisplayWidth: number
  map: Map | null
  mapWidth: number
  mapHeight: number
  arenaWidth: number
  arenaHeight: number

  mapcameraposition: numberPair

  problems: Problem[][] // Randomly ordered array of problem instances grouped by level.
  mapplayer: any // save the player obj

  loopCount: number

  message: Message | null
  textcolor: string
  textsize: string

  then: number
  now: number
  dt: number

  localTTS: boolean
  // hp: any; //HanyuPinyin,
  // tts: any; //ChineseTextToSpeech,
  // toggleSpeaker: () => void;
}
