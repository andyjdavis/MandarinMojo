import { getGlobals } from "./globals"
import { StateArena } from "./StateEngines/State_Arena"
import { StateArenaEnd } from "./StateEngines/State_ArenaEnd"
import { StateArenaIntro } from "./StateEngines/State_ArenaIntro"
import { StateArenaPassed } from "./StateEngines/State_ArenaPassed"
import { StateLoading } from "./StateEngines/State_Loading"
import { StateMap } from "./StateEngines/State_Map"
import { StateOverlay } from "./StateEngines/State_Overlay"
import { StatePaused } from "./StateEngines/State_Paused"
import { getElementById } from "./util"

export type StateEngine = StateLoading | StateArenaIntro | StateArena | StateArenaEnd | StateArenaPassed
  | StatePaused | StateMap | StateOverlay

export const states = {
  ARENA: 2,
  ARENAEND: 3,
  ARENAINTRO: 1,
  ARENAPASSED: 4,
  LOADING: 0,
  MAP: 6,
  OVERLAY: 7,
  PAUSED: 5,
}

export class StateManager {
  private statestack: number[] = []
  private enginestack: StateEngine[] = []

  constructor() {
    this.setState(states.LOADING)
  }

  public setState(s: number) {
    // Notify previous state it is ending
    if (this.enginestack.length > 0) {
      this.enginestack[this.enginestack.length - 1].end()
    }

    // Start new stacks
    this.statestack = []
    this.enginestack = []

    return this.pushState(s)
  }

  public getState(): number {
    return this.statestack[this.statestack.length - 1]
  }
  public getStateEngine(): StateEngine {
    const i = this.enginestack.length - 1
    return this.enginestack[i]
  }
  public pushState(s: number) {
    this.statestack.push(s)
    this.enginestack.push(this.getStateEngineForState())

    return this.getStateEngine() // Return the state engine so caller can set properties on it.
  }
  public popState() {
    this.getStateEngine().end()
    this.statestack.pop()
    this.enginestack.pop()
  }
  private getStateEngineForState() {
    let engine = null

    const globals = getGlobals()
    if (!globals) {
      throw new Error("State Manager couldnt retrieve globals")
    }

    const state = this.getState()
    switch (state) {
      case states.LOADING:
        engine = new StateLoading(globals.world)
        break
      case states.ARENAINTRO:
        const left = getElementById("left_col")
        engine = new StateArenaIntro(globals.world, left, globals.canvas)
        break
      case states.ARENA:
        engine = new StateArena(globals.world)
        break
      case states.ARENAEND:
        engine = new StateArenaEnd(globals.world)
        break
      case states.ARENAPASSED:
        engine = new StateArenaPassed(globals.world)
        break
      case states.PAUSED:
        engine = new StatePaused(globals.world)
        break
      case states.MAP:
        engine = new StateMap(globals.world)
        break
      case states.OVERLAY:
        engine = new StateOverlay(globals.world)
        break
      default:
        throw new Error("unknown state:" + state)
    }
    return engine
  }
}
