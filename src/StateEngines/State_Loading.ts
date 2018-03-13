import { states } from "../StateManager"
import { IWorld } from "../types"
import { BaseStateEngine, IStateEngine } from "./State"

export class StateLoading extends BaseStateEngine implements IStateEngine {
    constructor(world: IWorld) {
        super(world)
    }
    // tslint:disable-next-line:no-empty
    public end() { }

    // tslint:disable-next-line:variable-name
    public draw(_canvas: HTMLCanvasElement, _context: CanvasRenderingContext2D) {
        /*const globals = getGlobals()
        const canvas = globals.canvas
        const context = globals.context

        //drawInstructions(false);
        var total = this.world.sounds.sounds.length + this.world.images.images.length;
        var loaded = this.world.sounds.numSoundsLoaded + this.world.images.numImagesLoaded;
        if (loaded < total) {
            //gContext.clearRect(0, 0, gCanvas.width, gCanvas.height);
            var text = "Loading...    " + loaded + "/" + total;
            drawText(context, text, world.textsize, world.textcolor, canvas.width / 2, 400);
            //return;
        } else {
            world.state.setState(world.state.states.MAP);
        }*/
        if (this.world.state) {
            console.log("moving state straight on to MAP")
            this.world.state.setState(states.MAP)
        }
    }
}
