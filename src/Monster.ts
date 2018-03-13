import { Player } from "./Player"
import Thing from "./Thing"
import { IWorld, numberPair } from "./types"
import { calcNormalVector } from "./util"

export default class Monster extends Thing {
  public timeDied: number = -1
  public type: number
  public frame: number = 0
  public maxframe: number = 1
  public lives: number = 0
  public sourcesize: [numberPair, numberPair]
  public sourcelocations: [numberPair, numberPair]
  public deadsize: numberPair
  public deadlocation: numberPair

  constructor(pos: numberPair, type: number) {
    super(pos, [0, 0], [0, 0])
    this.type = type

    switch (this.type) {
      case 0:
        // Fly.
        this.lives = 1
        this.sourcesize = [[72, 36], [75, 31]]
        this.sourcelocations = [[0, 32], [0, 0]]
        this.deadsize = [59, 33]
        this.deadlocation = [143, 0]
        break
      case 1:
        // Blob.
        this.lives = 2
        this.sourcesize = [[50, 28], [51, 26]]
        this.sourcelocations = [[52, 125], [0, 125]]
        this.deadsize = [59, 12]
        this.deadlocation = [0, 112]
        break
      // case 2:
      default:
        // Snail.
        this.lives = 3
        this.sourcesize = [[54, 31], [57, 31]]
        this.sourcelocations = [[143, 34], [67, 87]]
        this.deadsize = [44, 30]
        this.deadlocation = [148, 118]
        break
    }
  }

  public draw(
    world: IWorld,
    _canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    camerapos: numberPair,
  ) {
    const img = world.images.getImage("monster")
    if (!img) {
      return
    }

    if (this.isDead()) {
      const deadSourceX = this.deadlocation[0]
      const deadSourceY = this.deadlocation[1]
      const deadSourceWidth = this.deadsize[0]
      const deadSourceHeight = this.deadsize[1]
      context.drawImage(
        img,
        deadSourceX,
        deadSourceY,
        deadSourceWidth,
        deadSourceHeight,
        this.pos[0] + camerapos[0],
        this.pos[1] + camerapos[1],
        deadSourceWidth / 2,
        deadSourceHeight / 2,
      )
      return
    }

    if (world.loopCount % 10 === 0) {
      this.frame++
    }
    if (this.frame > this.maxframe) {
      this.frame = 0
    }

    if (this.vel[0] > 0) {
      context.save()
      const flipAxis = this.pos[0] + this.size[0] / 2
      context.translate(flipAxis, 0)
      context.scale(-1, 1)
      context.translate(-flipAxis, 0)
    }

    const sourceX = this.sourcelocations[this.frame][0]
    const sourceY = this.sourcelocations[this.frame][1]
    const sourceWidth = this.sourcesize[this.frame][0]
    const sourceHeight = this.sourcesize[this.frame][1]
    context.drawImage(
      img,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      this.pos[0] + camerapos[0],
      this.pos[1] + camerapos[1],
      sourceWidth / 2,
      sourceHeight / 2,
    )

    if (this.vel[0] > 0) {
      context.restore()
    }

    // super.draw(); // Draw bounding box.
  }
  public update(dt: number, player: Player) {
    if (this.isDead() && Date.now() > this.timeDied + 2000) {
      return false
    }
    if (this.isDead()) {
      return true
    }
    if (player !== undefined) {
      const vect = calcNormalVector(player.pos, this.pos)
      let maxvar = null
      switch (this.type) {
        case 0:
          // Fly.
          maxvar = 2500
          break
        case 1:
          // Blob.
          maxvar = 1600
          break
        // case 2:
        default:
          // Snail.
          maxvar = 1000
          break
      }
      this.vel[0] = maxvar * dt * vect[0]
      this.vel[1] = maxvar * dt * vect[1]
    }
    super.update(dt)
    return true
  }
  public die() {
    // $("left_col").removeChild(this.div);
  }
  public hit(vector: numberPair) {
    this.lives--
    if (this.isDead()) {
      this.timeDied = Date.now()
    }

    const pushback = 5
    this.pos[0] += vector[0] * pushback
    this.pos[1] += vector[1] * pushback
  }
  public isDead() {
    return this.lives <= 0
  }
}
