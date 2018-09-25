import { Aura } from "../Aura"
import { AuraRound } from "../Aura_Round"
import { Explosion } from "../Explosion"
import { states } from "../StateManager"
import { IWorld, numberPair } from "../types"
import { drawText } from "../util"
import { BaseStateEngine, IStateEngine } from "./State"
import { StateArena } from "./State_Arena"

export class StateArenaEnd extends BaseStateEngine implements IStateEngine {
  public decorations: Array<Explosion | Aura | AuraRound> = []
  public level: number
  public wordcount: number
  public got: number

  constructor(world: IWorld) {
    super(world)
    this.level = 0
    this.wordcount = 0
    this.got = 0
  }

  // tslint:disable-next-line:no-empty
  public end() { }

  public draw(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
  ) {
    const img = this.world.images.getImage("background")
    if (img) {
      context.drawImage(img, 0, 0)
    }

    drawText(
      context,
      "You got " + this.got + "/" + this.wordcount,
      this.world.textsize,
      this.world.textcolor,
      canvas.width / 2,
      150,
    )

    const perc = this.got / this.wordcount
    let s = ""
    if (perc === 1.0) {
      s = "Arena complete!"
    } else if (perc < 0.5) {
      s = "You have much to learn"
    } else if (perc < 0.8) {
      s = "The student has not yet become the master"
    } else {
      s = "Victory is near at hand"
    }
    drawText(
      context,
      s,
      this.world.textsize,
      this.world.textcolor,
      canvas.width / 2,
      270,
    )

    drawText(
      context,
      "Press r to retry",
      this.world.textsize,
      this.world.textcolor,
      canvas.width / 2,
      360,
    )
    drawText(
      context,
      "Press e to exit the arena",
      this.world.textsize,
      this.world.textcolor,
      canvas.width / 2,
      390,
    )
    const cameraPos: numberPair = [
      0,
      0,
    ]
    for (const decorations of this.decorations) {
      decorations.draw(this.world, canvas, context, cameraPos)
    }
  }

  public onKeyDown(event: KeyboardEvent) {
    const stateManager = this.world.state
    if (!stateManager) {
      throw new Error("state manager is null")
    }

    // "e" to exit
    if (event.keyCode === 69) {
      stateManager.setState(states.MAP)
    }
    // "r" to retry
    if (event.keyCode === 82) {
      const state = stateManager.setState(states.ARENA) as StateArena

      // what is this even doing?
      state.wordIndex = 0
      // state.wordindex = this.wordindex;

      state.wordcount = this.wordcount
      state.setLevel(this.level)
    }
  }
}
