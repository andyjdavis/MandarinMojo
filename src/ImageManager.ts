import * as background from "./assets/images/background.png"
import * as monster from "./assets/images/enemies_spritesheet.png"
import * as explosion from "./assets/images/explosion.png"
import * as fireball from "./assets/images/fireball.png"
import * as hero from "./assets/images/player/p1_spritesheet.png"
import * as powerup from "./assets/images/star.png"
import * as tiles from "./assets/maps/Tiny32-Complete-Spritesheet-Repack3.png"

function loadImage(url: string): HTMLImageElement {
    const image = new Image()
    image.src = url
    return image
}

export class ImageManager {

    private images: { [key: string]: HTMLImageElement } = {}

    constructor() {
        this.images = {
            background: loadImage(background),
            monster: loadImage(monster),
            explosion: loadImage(explosion),
            fireball: loadImage(fireball),
            hero: loadImage(hero),
            powerup: loadImage(powerup),
            tiles: loadImage(tiles),
        }
    }

    public getImage(name: string) {
        if (this.images[name]) {
            return this.images[name]
        } else {
            return null
        }
    }
}
