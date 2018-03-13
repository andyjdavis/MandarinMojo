// the onscreen representation of the character

import { config } from "../config"
import Thing from "../Thing"
import { IWorld, numberPair } from "../types"
import { drawRect, drawText } from "../util"

export class Character extends Thing {
  public visible: boolean = false
  public alignment: string
  public slotindex: number
  public iscorrect: boolean
  public character: string
  public pinyin: string
  public english: string

  constructor(
    pos: numberPair,
    alignment: string,
    slotindex: number,
    iscorrect: boolean,
    character: string,
    pinyin: string,
    english: string,
  ) {
    super(pos, [32, 32], [0, 0])
    this.alignment = alignment
    this.slotindex = slotindex
    this.iscorrect = iscorrect
    this.character = character
    this.pinyin = pinyin
    this.english = english

    this._fixSize()
  }

  public draw(
    world: IWorld,
    _canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    camerapos: numberPair,
  ) {
    if (this.visible) {
      drawText(
        context,
        this.character,
        world.textsize,
        "yellow",
        this.pos[0] + camerapos[0],
        this.pos[1] + camerapos[1],
        1.0,
        this.alignment,
      )
    }
    if (config.debug) {
      // Character position.
      drawRect(
        context,
        this.getCollisionPos()[0] + camerapos[0],
        this.getCollisionPos()[1] + camerapos[1],
        2,
        2,
      )
      // Thing.prototype.draw.call(this); // Draw bounding box.
    }
  }
  public _fixSize() {
    this.size = this.footprint = [this.character.length * 24, 28]
  }
  public getCollisionPos(): numberPair {
    if (this.alignment === "right") {
      return [this.pos[0] - this.footprint[0], this.pos[1]]
    } else {
      return this.pos
    }
  }
}
