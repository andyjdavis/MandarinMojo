import { getGlobals } from "./globals"
import Thing from "./Thing"
import { IWorld, numberPair } from "./types"
import { drawRect } from "./util"

export class Player extends Thing {
    public drawhealth: boolean
    public maxvel: number
    public frame: number
    public maxframe: number
    public walking: boolean
    public goingleft: boolean
    public health: number
    public maxhealth: number
    public lasthittime: number | null
    public standingsourcelocations: numberPair
    public walkingsourcelocations: numberPair[]

    constructor(pos: numberPair, drawhealth: boolean) {
        super(pos, [32, 48], [0, 0])
        this.drawhealth = drawhealth

        this.maxvel = 200
        this.frame = 0
        this.maxframe = 10
        this.walking = false
        this.goingleft = false

        this.health = 4
        this.maxhealth = 4
        this.lasthittime = null

        // these came from images/player/p1_spritesheet.txt
        this.standingsourcelocations = [67, 196]
        this.walkingsourcelocations = [
            [0, 0],
            [73, 0],
            [146, 0],
            [0, 98],
            [73, 98],
            [146, 98],
            [219, 0],
            [292, 0],
            [219, 98],
            [365, 0],
            [292, 98],
        ]
    }

    public draw(world: IWorld,
                _canvas: HTMLCanvasElement,
                context: CanvasRenderingContext2D,
                cameraposition: numberPair) {

        const img = world.images.getImage("hero")
        if (!img) {
            return
        }
        if (!cameraposition) {
            cameraposition = [0, 0]
        }

        const sourceWidth = 72
        const sourceHeight = 92// 97;

        const drawX = this.pos[0] - cameraposition[0]
        const drawY = this.pos[1] - cameraposition[1]

        if (this.walking) {
            if (world.loopCount % 2 === 0) {
                this.frame++
            }
            if (this.frame > this.maxframe) {
                this.frame = 0
            }
            const sourceX = this.walkingsourcelocations[this.frame][0]
            const sourceY = this.walkingsourcelocations[this.frame][1]

            if (this.goingleft) {
                context.save()
                const flipAxis = drawX + this.size[0] / 2
                context.translate(flipAxis, 0)
                context.scale(-1, 1)
                context.translate(-flipAxis, 0)
            }

            context.drawImage(img,
                sourceX, sourceY,
                sourceWidth, sourceHeight,
                drawX, drawY,
                this.size[0], this.size[1])

            if (this.goingleft) {
                context.restore()
            }
        } else {
            const sourceX = this.standingsourcelocations[0]
            const sourceY = this.standingsourcelocations[1]
            context.drawImage(img,
                sourceX, sourceY,
                sourceWidth, sourceHeight,
                drawX, drawY,
                this.size[0], this.size[1])
        }
        /*super.draw(world,
            canvas,
            context); // Draw bounding box.*/

        if (this.drawhealth) {
            const width = (this.health / this.maxhealth) * this.size[0]
            let opacity = 0.0
            if (this.lasthittime) {
                const timepassed = new Date().getTime() - this.lasthittime
                if (timepassed < 5000) {
                    opacity = 1.0 - (timepassed / 5000)
                }
            }
            if (opacity > 0) {
                drawRect(context, drawX, drawY + this.size[1], width, 4, "green", opacity)
            }
        }
    }
    // setvisibility(visibility: boolean) {
    // this.div.style.visibility = visibility;
    // }
    public hurt() {
        this.health--
        this.showHealth()

        const globals = getGlobals()
        if (!globals) {
            return
        }
        console.error("fail sound commented out in Player")
        // const world = globals.world
        // world.sounds.play("fail");
    }
    public healed() {
        this.health++
        this.showHealth()
    }
    public showHealth() {
        this.lasthittime = new Date().getTime()
    }
    public resetHealth() {
        this.health = this.maxhealth
    }

    public update(dt: number, bounds: number[][]) {
        const globals = getGlobals()
        if (!globals) {
            console.error("Player::update cannot access globals")
            return false
        }
        const world = globals.world

        this.walking = false
        this.goingleft = false
        let lastpos = null
        if (bounds) {
            lastpos = this.pos.slice(0)
        }

        // gWorld.keyState[87] ||
        if (world.keyState[38]) { // up
            // this.vel[1] = -this.maxvel;
            this.pos[1] = Math.round(this.pos[1] - this.maxvel * dt)
            this.walking = true
        }
        // gWorld.keyState[83] ||
        if (world.keyState[40]) { // down
            // this.vel[1] = this.maxvel;
            this.pos[1] = Math.round(this.pos[1] + this.maxvel * dt)
            this.walking = true
        }
        // gWorld.keyState[65] ||
        if (world.keyState[37]) { // left
            // this.vel[0] = -this.maxvel;
            this.pos[0] = Math.round(this.pos[0] - this.maxvel * dt)
            this.walking = true
            this.goingleft = true
        }
        // gWorld.keyState[68] ||
        if (world.keyState[39]) { // right
            // this.vel[0] = this.maxvel;
            this.pos[0] = Math.round(this.pos[0] + this.maxvel * dt)
            this.walking = true
        }
        // if (gWorld.keyState[32]) { //spacebar - guns
        //    this.shoot();
        // }

        if (bounds && lastpos) {
            if (this.pos[0] < bounds[0][0]) {
                this.pos[0] = lastpos[0]
            }
            if (this.pos[0] + this.size[0] > bounds[0][0] + bounds[1][0]) {
                this.pos[0] = bounds[0][0] + bounds[1][0] - this.size[0]
            }
            if (this.pos[1] < bounds[0][1]) {
                this.pos[1] = lastpos[1]
            }
            if (this.pos[1] + this.size[1] > bounds[0][1] + bounds[1][1]) {
                this.pos[1] = bounds[0][1] + bounds[1][1] - this.size[1]
            }
        }
        // super.update(this, dt);
        return true
    }
}
