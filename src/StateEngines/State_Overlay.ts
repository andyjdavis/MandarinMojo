import { IWorld, numberPair } from "../types"
import { drawRect, drawText } from "../util"
import { BaseStateEngine, IStateEngine } from "./State"

export class StateOverlay extends BaseStateEngine implements IStateEngine {
    public cameraPosition: numberPair
    public bottomRight: any

    constructor(world: IWorld) {
        super(world)
        this.cameraPosition = [0, 0]
        this.bottomRight = null
    }

    // tslint:disable-next-line:no-empty
    public end() { }

    public draw(
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D) {

        if (this.world.map) {
            this.world.map.draw(this.world, context, this.cameraPosition, this.bottomRight)
        }

        drawRect(context, 50, 50, canvas.width - 100, canvas.height - 100, "green", 0.6)

        let y = 150
        drawText(context, "High Scores", this.world.textsize, "white", canvas.width / 2, y)
        for (let i: number = 0; i < this.world.playerinfo.highscores.length; i++) {
            y += 40
            drawText(context, "HSK " + (1.0 * i + 1) + "   " + this.world.playerinfo.highscores[i],
                this.world.textsize,
                "white",
                canvas.width / 2,
                y)
        }
    }
    // tslint:disable-next-line:variable-name
    public update(_dt: number) {
        return true
    }
}
