import { Aura } from "../Aura"
import { AuraRound } from "../Aura_Round"
import { Explosion } from "../Explosion"
import { states } from "../StateManager"
import { IWorld } from "../types"
import { drawText } from "../util"
import { BaseStateEngine, IStateEngine } from "./State"

export class StateArenaPassed extends BaseStateEngine implements IStateEngine {
    public decorations: Array<Explosion | Aura | AuraRound> = []
    public level: number

    constructor(world: IWorld) {
        super(world)

        // this.decorations = [];
        this.level = 0
    }

    // tslint:disable-next-line:no-empty
    public end() {
    }

    public draw(canvas: HTMLCanvasElement,
                context: CanvasRenderingContext2D) {

        const img = this.world.images.getImage("background")
        if (img) {
            context.drawImage(img, 0, 0)
        }

        let s = "You have passed HSK " + this.level + "!!"
        if (this.level === 0) {
            s = "Your are all up to date"
        }
        drawText(context, s, this.world.textsize, this.world.textcolor, canvas.width / 2, 150)
        drawText(context, "Press e to exit the arena", this.world.textsize, this.world.textcolor, canvas.width / 2, 390)
        // for (var i in this.decorations) {
        //    this.decorations[i].draw();
        // }
    }
    public update(_dt: number) {
        return true
    }
    public onKeyDown(event: KeyboardEvent) {
        // "e" to exit
        if (event.keyCode === 69) {
            if (this.world.state) { this.world.state.setState(states.MAP) }
        }
    }
}
