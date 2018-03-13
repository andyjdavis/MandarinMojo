import { IMapData } from "./map_data"
import { IWorld, numberPair } from "./types"
import { drawText } from "./util"

export class Map {
    public jsonobj: any
    public objectlayer: "Object Layer" = "Object Layer"
    public forebackground1layer: "foreground" = "foreground"
    public impassablelayer: "impassable" = "impassable"
    public background2layer: "backgrounddecoration" = "backgrounddecoration"
    public background1layer: "background" = "background"

    public cameraposition: numberPair = [0, 0]
    public bottomRight: numberPair = [0, 0]
    public labels: Array<{ text: string, pos: numberPair }> = []

    constructor(jsonobj: IMapData) {
        this.jsonobj = jsonobj
    }
    public draw(world: IWorld,
                context: CanvasRenderingContext2D,
                cameraposition: numberPair, bottomRight: numberPair, opacity?: number) {

        if (opacity && context.globalAlpha !== opacity) {
            context.save()
            context.globalAlpha = opacity
        }

        this.startDraw(cameraposition, bottomRight, world)
        const mapsize = this.getMapDimensions()
        for (let x = 0; x < mapsize[0]; x++) {
            for (let y = 0; y < mapsize[1]; y++) {
                this.drawBackgroundTile(world, context, x, y, world.tileDisplayWidth, world.tileDisplayWidth)
                this.drawImpassableTile(world, context, x, y, world.tileDisplayWidth, world.tileDisplayWidth)
                this.drawForegroundTile(world, context, x, y, world.tileDisplayWidth, world.tileDisplayWidth)
            }
        }
        this.drawLabels(world, context)
        if (opacity && context.globalAlpha !== opacity) {
            context.restore()
        }
    }

    public drawBackgroundTile(world: IWorld,
                              context: CanvasRenderingContext2D,
                              x: number, y: number,
                              drawWidth: number, drawHeight: number) {
        this.drawTile(world, context, x, y, drawWidth, drawHeight, this.background1layer)
        this.drawTile(world, context, x, y, drawWidth, drawHeight, this.background2layer)
    }

    public drawImpassableTile(world: IWorld,
                              context: CanvasRenderingContext2D,
                              x: number, y: number,
                              drawWidth: number, drawHeight: number) {
        this.drawTile(world, context, x, y, drawWidth, drawHeight, this.impassablelayer)
    }

    public drawForegroundTile(world: IWorld,
                              context: CanvasRenderingContext2D,
                              x: number, y: number,
                              drawWidth: number, drawHeight: number) {
        this.drawTile(world, context, x, y, drawWidth, drawHeight, this.forebackground1layer)
    }

    public drawLabels(world: IWorld,
                      context: CanvasRenderingContext2D) {
        for (const label of this.labels) {
            drawText(context,
                label.text,
                world.textsize,
                world.textcolor,
                label.pos[0] - this.cameraposition[0],
                label.pos[1] - this.cameraposition[1])
        }
    }

    public getMapDimensions() {
        return [this.jsonobj.width, this.jsonobj.height]
    }

    public tilePassable(coords: numberPair) {
        const layer = this.getLayer(this.impassablelayer)
        const tileData = this.getTileData(layer, coords[0], coords[1])
        return tileData === 0
    }
    public getObjectLayer() {
        return this.getLayer(this.objectlayer)
    }
    private getLayer(layername: string) {
        for (const layer of this.jsonobj.layers) {
            if (layer.name === layername) {
                return layer
            }
        }
        return null
    }
    private getTileData(layer: any, x: number, y: number) {
        return layer.data[x + this.jsonobj.width * y]
    }

    private drawTile(world: IWorld,
                     context: CanvasRenderingContext2D,
                     x: number, y: number,
                     drawWidth: number, drawHeight: number,
                     layerName: string) {

        let imageindex = null
        let sourceWidth = null

        // Calc the draw position and check it is on screen.
        const drawX = (x * drawWidth) - this.cameraposition[0]
        const drawY = (y * drawHeight) - this.cameraposition[1]
        if (drawX < 0 - drawWidth || drawY < 0 - drawHeight) {
            return
        }
        if (drawX > this.bottomRight[0] || drawY > this.bottomRight[0]) {
            return
        }

        const img = world.images.getImage("tiles")
        if (!img) {
            return
        }

        let layerFound = false
        let tileData = null
        for (const layer of this.jsonobj.layers) {
            if (layer.name !== layerName) {
                continue
            }
            layerFound = true

            tileData = this.getTileData(layer, x, y)
            if (tileData === 0) {
                // Empty tile.
                break
            }
            imageindex = tileData - 1

            sourceWidth = this.jsonobj.tilesets[0].imagewidth / this.jsonobj.tilesets[0].tilewidth
            const sourceX = (imageindex % sourceWidth) * this.jsonobj.tilewidth
            const sourceY = Math.floor(imageindex / sourceWidth) * this.jsonobj.tileheight

            context.drawImage(img,
                sourceX,
                sourceY,
                this.jsonobj.tilewidth,
                this.jsonobj.tileheight,
                drawX,
                drawY,
                drawWidth,
                drawHeight)
        }
        if (!layerFound) {
            throw new Error(layerName + " layer not found")
        }
    }

    private startDraw(cameraposition: numberPair, bottomRight: numberPair, world: IWorld) {
        this.cameraposition = cameraposition
        this.bottomRight = bottomRight
        this.labels = []
        let label = null

        const objectlayer = this.getObjectLayer()
        for (const i in objectlayer.objects) {
            if (objectlayer.objects[i].properties.label) {
                label = objectlayer.objects[i].properties.label
                if (label === "Review") {
                    label = world.playerinfo.getProblemsToGoCount() + " to review"
                }
                this.labels.push({
                    text: label,
                    pos: [objectlayer.objects[i].x + + objectlayer.objects[i].width / 2,
                    objectlayer.objects[i].y + objectlayer.objects[i].height],
                })

            }
        }
    }
}
