import { getGlobals } from "./globals"

function onImageLoad() {
    const globals = getGlobals()
    if (!globals) {
        return
    }
    globals.world.images.numImagesLoaded++
}

export class ImageManager {
    public numImagesLoaded: number
    public imagedict: { [key: string]: string }
    public images: { [key: string]: HTMLImageElement } = {}

    constructor() {
        this.numImagesLoaded = 0
        this.imagedict = {
            background: "images/background.png",
            explosion: "images/explosion.png",
            fireball: "images/fireball.png",
            hero: "images/player/p1_spritesheet.png",
            monster: "images/enemies_spritesheet.png",
            powerup: "images/star.png",
            tiles: "maps/Tiny32-Complete-Spritesheet-Repack3.png",
        }
        // this.images = Array(7);
        for (const name in this.imagedict) {
            if (this.imagedict.hasOwnProperty(name)) {
                this.images[name] = new Image()
                this.images[name].onload = onImageLoad
                this.images[name].src = this.imagedict[name]
            }
        }
    }

    public getImage(name: string) {
        // if (this.images.length == this.numImagesLoaded) {
        if (this.images[name]) {
            return this.images[name]
        } else {
            return null
        }
    }
}
