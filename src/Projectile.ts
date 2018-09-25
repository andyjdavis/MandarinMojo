import { getGlobals } from "./globals"
import Thing from "./Thing"
import { IWorld, numberPair } from "./types"

export class Projectile extends Thing {
  public frame: number
  public maxframe: number

  constructor(pos: numberPair, vel: numberPair) {
    super(pos, [32, 32], vel)
    this.frame = 0
    this.maxframe = 7
  }

  public draw(
    world: IWorld,
    _canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    camerapos: numberPair,
  ) {
    const img = world.images.getImage("fireball")
    if (img) {
      // debug
      // drawRect(gContext, this.pos[0]-1, this.pos[1]-1, this.size[0]+2, this.size[1]+2);
      const sourceWidth = 64
      if (world.loopCount % 3 === 0) {
        this.frame++
      }
      if (this.frame > this.maxframe) {
        this.frame = 0
      }
      const sourceX = sourceWidth * this.frame
      // var sourceY = sourceWidth * (this.frame % 4);

      context.save() // save current state

      const xtranslate = this.pos[0] + this.size[0] / 2
      const ytranslate = this.pos[1] + this.size[1] / 2
      context.translate(xtranslate, ytranslate)

      const angle = Math.atan2(this.vel[1], this.vel[0]) + Math.PI
      context.rotate(angle) // rotate

      context.translate(-xtranslate, -ytranslate)
      context.drawImage(
        img,
        sourceX,
        0,
        sourceWidth,
        sourceWidth,
        this.pos[0] + camerapos[0],
        this.pos[1] + camerapos[1],
        this.size[0],
        this.size[1],
      )
      context.restore() // restore original states (no rotation etc)
    }
    // Thing.prototype.draw.call(this, drawpos);
  }
  public update(dt: number) {
    const globals = getGlobals()
    if (!globals) {
      return true
    }
    const canvas = globals.canvas

    // this.pos[0] -= dt * 20;
    super.update(dt)

    if (
      this.pos[0] < 0 ||
      this.pos[0] > canvas.width ||
      this.pos[1] < 0 ||
      this.pos[1] > canvas.height
    ) {
      return false
    }
    return true
  }
}
