import Thing from "./Thing"
import { IWorld, numberPair } from "./types"
import { drawText } from "./util"

export class Message extends Thing {
  public age: number
  public maxage: number
  public message: string

  constructor(message: string) {
    super([0, 0], [0, 0], [0, 0])
    // Thing.call(this, pos, [32,32], [0, 0]);
    this.age = 0
    this.maxage = 2
    this.message = message
  }

  public draw(
    _world: IWorld,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    camerapos: numberPair,
  ) {
    drawText(
      context,
      this.message,
      "48pt Arial",
      "yellow",
      canvas.width / 2 + camerapos[0],
      canvas.height / 2 + camerapos[1],
      0.4,
    )
  }
  public update(dt: number) {
    // Thing.prototype.update.call(this, dt);
    this.age += dt
    if (this.age > this.maxage) {
      return false
    }
    return true
  }
}
