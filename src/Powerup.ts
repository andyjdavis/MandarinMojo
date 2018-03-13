import Thing from "./Thing"
import { IWorld, numberPair } from "./types"

export class Powerup extends Thing {
  public start: number
  public lifespan: number

  constructor(pos: numberPair) {
    super(pos, [32, 32], [0, 0])
    this.start = new Date().getTime()
    this.lifespan = 7000
  }

  public draw(
    world: IWorld,
    _canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    camerapos: numberPair,
  ) {
    const img = world.images.getImage("powerup")
    if (img) {
      // debug
      // drawRect(gContext, this.pos[0]-1, this.pos[1]-1, this.size[0]+2, this.size[1]+2);
      const sourceWidth = 35
      const sourceX = 0
      const sourceY = 0
      context.drawImage(
        img,
        sourceX,
        sourceY,
        sourceWidth,
        sourceWidth,
        this.pos[0] + camerapos[0],
        this.pos[1] + camerapos[1],
        this.size[0],
        this.size[1],
      )
    }
    // Thing.prototype.draw.call(this, drawpos);
  }
  public update(_dt: number) {
    if (new Date().getTime() - this.start > this.lifespan) {
      return false
    }
    return true
  }
}
