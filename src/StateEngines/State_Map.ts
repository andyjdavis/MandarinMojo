import { getGlobals } from "../globals"
import { Map } from "../Map"
import { mapData } from "../map_data"
import { Player } from "../Player"
import { states } from "../StateManager"
import { IWorld, numberPair } from "../types"
import { BaseStateEngine, IStateEngine } from "./State"
import { StateArenaIntro } from "./State_ArenaIntro"

export class StateMap extends BaseStateEngine implements IStateEngine {
    public cameraright: boolean
    public cameraleft: boolean
    public cameraup: boolean
    public cameradown: boolean
    public cameraposition: numberPair = [130, 0]

    public opacity: number
    public opacityincrease: number

    public player: Player | null = null

    public canvas: any

    constructor(world: IWorld) {
        super(world)
        this.cameraright = false
        this.cameraleft = false
        this.cameraup = false
        this.cameradown = false

        this.opacity = 0.0
        this.opacityincrease = 1 / 2 // 2 seconds to full opacity.

        const globals = getGlobals()
        if (!globals) {
            console.error("State_Map could not access globals")
            return
        }

        this.canvas = globals.canvas

        this.world.map = new Map(mapData)

        if (this.world.mapplayer) {
            this.player = this.world.mapplayer
        } else {
            this.player = new Player([520, 50], false)
            this.world.mapplayer = this.player
        }
        if (this.world.mapcameraposition) {
            this.cameraposition = this.world.mapcameraposition
        }

        this.canvas.width = this.world.mapWidth
        this.canvas.height = this.world.mapHeight

        // gLeft.setAttribute('width', this.world.mapWidth+'px');
    }

    public end() {
        // this.world.mapplayer = this.player;
    }

    public draw(canvas: HTMLCanvasElement,
                context: CanvasRenderingContext2D) {

        if (this.world.map) {
            this.world.map.draw(this.world, context, this.cameraposition, this._getBottomRight(), this.opacity)
        }
        if (this.world.message) {
            this.world.message.draw(this.world, canvas, context, this.cameraposition)
        }
        if (this.player) {
            this.player.draw(this.world, canvas, context, this.cameraposition)
        }
    }
    public _getBottomRight(): numberPair {
        return [this.cameraposition[0] + this.world.mapWidth, this.cameraposition[1] + this.world.mapHeight]
    }
    public _getMapBottomRight(): numberPair {
        if (!this.world.map) {
            console.error("State_Map::getMapBottomRight doesnt have a map")
            return [0, 0]
        }
        return [this.world.map.jsonobj.tilewidth * this.world.tileDisplayWidth,
        this.world.map.jsonobj.tileheight * this.world.tileDisplayWidth]
    }
    public update(dt: number): boolean {
        if (!this.world.map || !this.world.map.jsonobj) {
            return false
        }

        const globals = getGlobals()
        if (!globals) {
            console.error("State_Map::update cant access globals")
            return false
        }
        const canvas = globals.canvas

        if (this.opacity < 1.0) {
            this.opacity += this.opacityincrease * dt
            if (this.opacity > 1.0) {
                this.opacity = 1.0
            }
        }

        if (!this.player) {
            console.error("State_Map::update has no player")
            return false
        }

        const lastpos = this.player.pos.slice(0)

        const bounds = [[0, 0], this._getMapBottomRight()]
        this.player.update(dt, bounds)
        if (this.checkCollisions()) {
            this.world.mapplayer.pos = lastpos
            return true
        }

        if (this.player.pos[0] - this.cameraposition[0] > (canvas.width * 0.8)) {
            this.cameraright = true
        } else if (this.cameraposition[0] > 0 && this.player.pos[0] - this.cameraposition[0] < (canvas.width * 0.2)) {
            this.cameraleft = true
        }
        if (this.player.pos[1] - this.cameraposition[1] > (canvas.height * 0.8)) {
            this.cameradown = true
        } else if (this.cameraposition[1] > 0 && this.player.pos[1] - this.cameraposition[1] < (canvas.height * 0.2)) {
            this.cameraup = true
        }

        const speed = 300
        const delta = speed * dt

        // Do not scroll past the bottom and right edge of the map.
        if (this.cameraright || this.cameradown) {
            const bottomRight = this._getBottomRight()
            const mapBottomRight = this._getMapBottomRight()

            if (this.cameraright) {
                if (bottomRight[0] + delta > mapBottomRight[0]) {
                    this.cameraright = false
                }
            }
            if (this.cameradown) {
                if (bottomRight[1] + delta > mapBottomRight[1]) {
                    this.cameradown = false
                }
            }
        }

        if (this.cameraright) {
            this.cameraposition[0] += delta
        } else if (this.cameraleft) {
            this.cameraposition[0] -= delta
            this.cameraposition[0] = this.cameraposition[0] < 0 ? 0 : this.cameraposition[0]
        }
        if (this.cameradown) {
            this.cameraposition[1] += delta
        } else if (this.cameraup) {
            this.cameraposition[1] -= delta
            this.cameraposition[1] = this.cameraposition[1] < 0 ? 0 : this.cameraposition[1]
        }

        if (this.player.pos[0] - this.cameraposition[0] < (canvas.width * 0.25)) {
            this.cameraright = false
        } else if (this.player.pos[0] - this.cameraposition[0] > (canvas.width * 0.75)) {
            this.cameraleft = false
        }
        if (this.player.pos[1] - this.cameraposition[1] < (canvas.height * 0.25)) {
            this.cameradown = false
        } else if (this.player.pos[1] - this.cameraposition[1] > (canvas.height * 0.75)) {
            this.cameraup = false
        }
        return true
    }
    public checkCollisions() {
        if (!this.world.map || !this.player || !this.world.state) {
            return false
        }
        const objectlayer = this.world.map.getObjectLayer()
        for (const i in objectlayer.objects) {
            if (objectlayer.objects[i].type === "arena") {
                if (this.checkCollisionWithPlayer(objectlayer.objects[i])) {
                    // Enter the arena.
                    const state = this.world.state.setState(states.ARENAINTRO) as StateArenaIntro

                    const level = objectlayer.objects[i].properties.level
                    state.setLevel(level)
                    state.wordIndex = objectlayer.objects[i].properties.wordindex
                    state.wordCount = objectlayer.objects[i].properties.wordcount

                    if (level > 0) {
                        this.world.playerinfo.addLevel(this.world, level)
                    }
                    this.world.mapcameraposition = this.cameraposition
                    return true
                }
            }
        }

        const pos1 = this._getMapCoords(this.player.pos)
        const pos2 = this._getMapCoords(
            [this.player.pos[0] + this.player.size[0],
            this.player.pos[1] + this.player.size[1]],
        )
        if (!this.world.map.tilePassable(pos1) || !this.world.map.tilePassable(pos2)) {
            return true
        }

        return false
    }
    public _getMapCoords(pos: numberPair): numberPair {
        return [Math.floor(pos[0] / this.world.tileDisplayWidth),
        Math.floor(pos[1] / this.world.tileDisplayWidth)]
    }
    public checkCollisionWithPlayer(obj: any) {
        if (!this.player) {
            return false
        }

        if (this.player.pos[0] + this.player.size[0] < obj.x
            || this.player.pos[0] > obj.x + obj.width
            || this.player.pos[1] + this.player.size[1] < obj.y
            || this.player.pos[1] > obj.y + obj.height
        ) {
            return false
        }
        return true
    }
}
