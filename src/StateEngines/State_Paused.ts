import { IWorld } from "../types"
import { getElementById } from "../util"
import { BaseStateEngine, IStateEngine } from "./State"

export class StatePaused extends BaseStateEngine implements IStateEngine {
    constructor(world: IWorld) {
        super(world)
        getElementById("paused").style.visibility = "visible"
    }

    public end() {
        getElementById("paused").style.visibility = "hidden"
    }

    public draw(_canvas: HTMLCanvasElement,
        // tslint:disable-next-line:no-empty
                _context: CanvasRenderingContext2D) { }
}
