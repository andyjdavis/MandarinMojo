import Thing from "./Thing"
import { IWorld, numberPair } from "./types"

export class Aura extends Thing {
    public centerobj: Thing
    public color: string
    public opacity: number
    public opacitydrop: number
    public widthRadians: number
    public angle: number
    public age: number

    constructor(centerobj: Thing, color: string, lifespan: number, opacity: number) {
        super(centerobj.pos, [9, 0], [0, 0])
        this.centerobj = centerobj
        this.color = color
        // this.lifespan = lifespan;
        this.opacity = opacity
        this.opacitydrop = opacity / lifespan // amount opacity drops per second

        this.widthRadians = 0.2 * Math.PI
        this.angle = (1 / 3) * Math.PI
        this.age = 0
    }

    public draw(_world: IWorld,
                canvas: HTMLCanvasElement,
                context: CanvasRenderingContext2D,
                _camerapos: numberPair) {

        if (!this.pos) {
            // update() hasn't run yet.
            return
        }
        context.fillStyle = this.color
        // this.pos = gWorld.player.pos;
        const h = canvas.width

        const interval = Math.PI / 2
        for (let i = 0; i < 4; i++) {
            const drawAngle = this.angle + (interval * i)

            const x1 = h * Math.cos(drawAngle) + this.pos[0]
            // var y1 = h * Math.sin(drawAngle) + this.pos[1]

            const x2 = h * Math.cos(drawAngle + this.widthRadians) + this.pos[0]
            const y2 = h * Math.sin(drawAngle + this.widthRadians) + this.pos[1]

            context.globalAlpha = this.opacity
            context.beginPath()
            context.moveTo(this.pos[0], this.pos[1])
            context.lineTo(x1, y2)
            context.lineTo(x2, y2)

            context.fill()
            context.globalAlpha = 1.0
        }
    }
    public update(dt: number) {
        this.pos = [this.centerobj.pos[0] + this.centerobj.size[0] / 2,
        this.centerobj.pos[1] + this.centerobj.size[1] / 2]

        this.angle -= 2 * dt
        this.age += dt
        this.opacity -= this.opacitydrop * dt
        // return this.age < this.lifespan;
        return this.opacity > 0.0
    }
}
