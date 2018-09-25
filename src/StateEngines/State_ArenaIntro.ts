import { states } from "../StateManager"
import { IWorld } from "../types"
import { drawText } from "../util"
import { BaseStateEngine, IStateEngine } from "./State"
import { StateArena } from "./State_Arena"

export class StateArenaIntro extends BaseStateEngine implements IStateEngine {
  public wordIndex: number
  public wordCount: number
  private level: number

  constructor(world: IWorld, left: HTMLElement, canvas: HTMLCanvasElement) {
    super(world)
    this.level = 0
    this.wordIndex = 0
    this.wordCount = 0

    canvas.width = this.world.arenaWidth
    canvas.height = this.world.arenaHeight

    left.setAttribute("width", this.world.arenaWidth + "px")
  }

  // tslint:disable-next-line:no-empty
  public end() { }

  public setLevel(level: number) {
    this.level = level
  }

  public draw(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
  ) {
    const img = this.world.images.getImage("background")
    if (img) {
      context.drawImage(img, 0, 0)
    }
    const x = canvas.width / 2

    // Can't use this.wordcount as it is set on the arena by setLevel().
    if (this.level === 0 && this.world.playerinfo.problems.length === 0) {
      drawText(
        context,
        "Your review queue is empty",
        this.world.textsize,
        this.world.textcolor,
        x,
        150,
      )
      drawText(
        context,
        "Attempt a HSK level and words will be added",
        this.world.textsize,
        this.world.textcolor,
        x,
        180,
      )
      drawText(
        context,
        "Press e to exit the review arena",
        this.world.textsize,
        "white",
        x,
        340,
      )
    } else {
      drawText(
        context,
        "Collect the correct characters",
        this.world.textsize,
        this.world.textcolor,
        x,
        150,
      )

      let s = "Avoid the critters"
      if (this.level === 0) {
        s = "Review in safety. No monsters here."
      }
      drawText(context, s, this.world.textsize, this.world.textcolor, x, 180)

      // drawText(gContext, "Press m to mute sound effects", gWorld.textsize, gWorld.textcolor, x, 240);
      drawText(context, "p to pause", this.world.textsize, this.world.textcolor, x, 310)
      drawText(
        context,
        "s if there is a problem with speech",
        this.world.textsize,
        "white",
        x,
        340,
      )
      drawText(
        context,
        "e to begin (and e to exit to the map)",
        this.world.textsize,
        "white",
        x,
        370,
      )
    }
  }

  public onKeyDown(event: KeyboardEvent) {
    // "e"
    if (event.keyCode === 69) {
      const stateManager = this.world.state
      if (!stateManager) {
        throw new Error("state manager is null")
      }

      // Can't use this.wordcount as it is set on the arena by setLevel().
      if (this.level === 0 && this.world.playerinfo.problems.length === 0) {
        stateManager.setState(states.MAP)
      } else {
        const state = stateManager.setState(states.ARENA) as StateArena
        state.wordIndex = this.wordIndex
        state.wordcount = this.wordCount
        state.setLevel(this.level)
      }
    }
  }
}
