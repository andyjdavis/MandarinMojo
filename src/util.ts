import { config } from "./config"
import Thing from "./Thing"
import { IWorld, numberPair } from "./types"

export function getElementById(id: string): any {
  return document.getElementById(id)
}
export function dc(tag: string): HTMLElement {
  return document.createElement(tag)
}

/*function createDiv(parent, imagesrc, width, height, id) {
    var screen = $(parent);

    const div = dc("div");
    if (id) {
        div.setAttribute("id", id);
    }
    div.style.position = "absolute";
    div.style.left = "0px";
    div.style.width = width;
    div.style.height = height;
    div.style.overflow = "hidden";

    div.style.backgroundImage = "url("+imagesrc+")";

    screen.appendChild(div);

    return div;
}*/
export function getParameterByName(name: string) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)")
  const results = regex.exec(location.search)
  return results == null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "))
}
export function updateObjects(arr: Thing[], dt: number, arg?: any) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i].update(dt, arg) === false) {
      arr.splice(i, 1)
    }
  }
  // return arr;
}
export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}
export function drawRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color?: string,
  opacity?: number,
) {
  if (color && context.fillStyle !== color) {
    context.fillStyle = color
  }

  let changed = false
  if (opacity && context.globalAlpha !== opacity) {
    changed = true
    context.save() // This is kind of over-kill for just setting alpha...
    context.globalAlpha = opacity
  }
  context.fillRect(x, y, width, height)
  if (changed) {
    context.restore()
  }
}
export function drawBox(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  opacity: number,
) {
  if (context.lineWidth !== 1) {
    context.lineWidth = 1
  }
  if (context.strokeStyle !== color) {
    context.strokeStyle = color
  }

  let changed = false
  if (opacity && context.globalAlpha !== opacity) {
    changed = true
    context.save()
    context.globalAlpha = opacity
  }
  context.beginPath()
  context.rect(x, y, width, height)
  context.stroke()
  if (changed) {
    context.restore()
  }
}
export function drawImage(
  context: CanvasRenderingContext2D,
  drawpos: numberPair,
  imageName: string,
  world: IWorld,
) {
  if (config.debug) {
    // Draw bounding box.
    /*if (this.getCollisionPos) {
            pos = this.getCollisionPos();
        }*/
    /*drawBox(context,
                pos[0] + size[0] - footprint[0],
                pos[1] + size[1] - footprint[1],
                footprint[0], footprint[1], 'yellow', 0.6);*/
  }

  if (imageName && drawpos) {
    const img = world.images.getImage(imageName)
    if (img) {
      context.drawImage(img, drawpos[0], drawpos[1])
    }
  }
}
export function drawCircle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  opacity: number,
) {
  if (color && context.strokeStyle !== color) {
    context.strokeStyle = color
  }

  let changed = false
  if (opacity && context.globalAlpha !== opacity) {
    changed = true
    context.save()
    context.globalAlpha = opacity
  }

  context.beginPath()
  context.arc(x, y, radius, 0, 2 * Math.PI)
  context.stroke()

  if (changed) {
    context.restore()
  }
}
export function drawText(
  context: CanvasRenderingContext2D,
  text: string,
  font: string,
  style: string,
  x: number,
  y: number,
  opacity?: number,
  align?: string,
) {
  if (!align) {
    align = "center"
  }
  if (align && context.textAlign !== align) {
    context.textAlign = align
  }
  if (context.textBaseline !== "top") {
    context.textBaseline = "top"
  }
  if (context.font !== font) {
    context.font = font
  }
  if (context.fillStyle !== style) {
    context.fillStyle = style
  }

  let changed = false
  if (opacity && context.globalAlpha !== opacity) {
    changed = true
    context.save()
    context.globalAlpha = opacity
  }
  context.fillText(text, x, y)
  if (changed) {
    context.restore()
  }
}
/*function angleToVector(ang: number) {
    return [Math.cos(ang), Math.sin(ang)]
}*/
export function calcDistance(vect: [number, number]) {
  return Math.sqrt(Math.pow(vect[0], 2) + Math.pow(vect[1], 2))
}
export function calcVector(p1: numberPair, p2: numberPair): numberPair {
  return [p1[0] - p2[0], p1[1] - p2[1]]
}
export function calcNormalVector(p1: numberPair, p2: numberPair) {
  const vect = calcVector(p1, p2)
  const h = calcDistance(vect)
  vect[0] = vect[0] / h
  vect[1] = vect[1] / h
  return vect
}
export function normalizeVector(v: numberPair): numberPair {
  const vect: numberPair = [0, 0]
  const h = calcDistance(v)
  vect[0] = v[0] / h
  vect[1] = v[1] / h
  return vect
}
/*function getDrawPos(p) {
    return [p[0] - gCamera[0], p[1] - gCamera[1]];
}*/
/*function lockToScreen(thing: Thing, canvas: HTMLCanvasElement) {
    if (thing.pos[0] < 0) {
        thing.pos[0] = 0;
    } else if (thing.pos[0] + thing.size[0] > canvas.width) {
        thing.pos[0] = canvas.width - thing.size[0];
    }

    if (thing.pos[1] < 0) {
        thing.pos[1] = 0;
    } else if (thing.pos[1] + thing.size[1] > canvas.height) {
        thing.pos[1] = canvas.height - thing.size[1];
    }
}*/
