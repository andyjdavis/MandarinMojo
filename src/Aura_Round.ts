import Thing from "./Thing"
import { IWorld, numberPair } from "./types"
import { drawCircle } from "./util"

export class AuraRound extends Thing {
    public color: string
    public opacity: number
    public opacitydrop: number
    public radius: number = 0
    public age: number = 0

    constructor(pos: numberPair, color: string, lifespan: number, opacity: number) {
        super(pos, [0, 0], [0, 0])
        this.pos = pos
        this.color = color

        // this.lifespan = lifespan;
        this.opacity = opacity
        this.opacitydrop = opacity / lifespan // amount opacity drops per second
    }

    public draw(_world: IWorld,
                _canvas: HTMLCanvasElement,
                context: CanvasRenderingContext2D,
                _camerapos: numberPair) {

        drawCircle(context, this.pos[0], this.pos[1], this.radius, this.color, this.opacity)
    }
    public update(dt: number) {
        this.radius += dt * 50
        this.age += dt
        this.opacity -= this.opacitydrop * dt
        // return this.age < this.lifespan;
        return this.opacity > 0.0
    }
}
