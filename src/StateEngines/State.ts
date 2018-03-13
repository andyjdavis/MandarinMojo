import { IWorld } from "../types"

export class BaseStateEngine {
  public world: IWorld

  constructor(world: IWorld) {
    this.world = world
  }

  public update(_dt: number) {
    return true
  }
}

export interface IStateEngine {
  end(): void
  draw(
    _canvas: HTMLCanvasElement,
    _context: CanvasRenderingContext2D,
  ): void
}
