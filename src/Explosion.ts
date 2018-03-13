import Thing from "./Thing"
import { IWorld, numberPair } from "./types"

export class Explosion extends Thing {
    public frame: number
    public maxframe: number

    constructor(pos: numberPair) {
        super(pos, [32, 32], [0, 0])
        this.frame = 0
        this.maxframe = 15
    }

    public draw(world: IWorld,
                _canvas: HTMLCanvasElement,
                context: CanvasRenderingContext2D,
                camerapos: numberPair) {

        if (!camerapos) {
            camerapos = [0, 0]
        }

        const img = world.images.getImage("explosion")
        if (img) {
            // debug
            // drawRect(gContext, this.pos[0]-1, this.pos[1]-1, this.size[0]+2, this.size[1]+2);
            const sourceWidth = 32// 64;
            if (world.loopCount % 6 === 0) {
                this.frame++
            }
            if (this.frame > this.maxframe) {
                // shouldnt happen... but yet....
                return
            }
            const sourceX = sourceWidth * (this.frame % 4)
            const sourceY = sourceWidth * Math.floor(this.frame / 4)
            context.drawImage(img,
                sourceX, sourceY,
                sourceWidth, sourceWidth,
                this.pos[0] + camerapos[0], this.pos[1] + camerapos[1],
                this.size[0], this.size[1])
        }
        // Thing.prototype.draw.call(this, drawpos);
    }
    public update(_dt: number) {
        // Explosions dont move and have their own logic for when they are finished
        // super.update(dt)

        if (this.frame > this.maxframe) {
            return false
        }
        return true
    }
}
