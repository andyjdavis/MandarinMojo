import { ImageManager } from "./ImageManager"
import { PlayerInfoManager } from "./PlayerInfoManager"
import { IGlobals, IWorld } from "./types"
import { dc, getElementById, getParameterByName } from "./util"

const g: IGlobals = setupGlobals()

function setupGlobals() {
    let canvas: HTMLCanvasElement | null = null
    let question: HTMLElement | null = null
    let pinyin: HTMLElement | null = null
    let audio: HTMLElement | null = null
    let context: CanvasRenderingContext2D | null = null
    let world: IWorld | null = null
    let left: HTMLElement | null = null
    let right: HTMLElement | null = null
    let table: HTMLElement | null = null
    const divs: HTMLElement[] = []

    // window.onload = () => {
    left = getElementById("left_col")
    right = getElementById("right_col")
    table = getElementById("thetable")
    if (!left || !right || !table) {
        throw new Error(`failed to find necessary page components: ${left} ${right} ${table}`)
    }

    canvas = dc("canvas") as HTMLCanvasElement
    canvas.width = 800
    canvas.height = 600
    left.appendChild(canvas)

    context = canvas.getContext("2d")
    if (!context) {
        throw new Error("failed to get context")
    }

    if (getParameterByName("Pinyin") === "1") {
        pinyin = dc("p")
        const text = document.createTextNode(" ")
        pinyin.appendChild(text)
        left.appendChild(pinyin)

        divs.push(pinyin)
    }
    if (getParameterByName("Audio") === "1") {
        audio = dc("span")
        getElementById("foot").appendChild(audio)

        divs.push(audio)
    }
    if (getParameterByName("English") === "1" || (!pinyin && !audio)) {
        const text = document.createTextNode(" ")
        question = dc("p")
        question.appendChild(text)
        left.appendChild(question)

        divs.push(question)
    }

    world = {
        debug: true,

        images: new ImageManager(),
        keyState: Array(),
        state: null, // new StateManager(), // Defaults to state LOADING.
        // sounds: new SoundManager()

        playerinfo: new PlayerInfoManager(),

        arenaHeight: 480,
        arenaWidth: 512,

        map: null,
        mapHeight: 600,
        mapWidth: 800,
        tileDisplayWidth: 32,

        mapcameraposition: [0, 0],

        mapplayer: null, // save the player obj
        problems: Array(), // Randomly ordered array of problem instances grouped by level.

        loopCount: 0,

        message: null,
        textcolor: "White",
        textsize: "18pt Arial",

        dt: 0,
        now: 0,
        then: Date.now(),

        localTTS: false,
        // hp: new HanyuPinyin(),
        // tts: new ChineseTextToSpeech(),
        /*toggleSpeaker: function () {
          if (!world) {
            return;
          }
          world.localTTS = !world.localTTS;

          var s = "switching speaker";
          world.message = new Message(s);
        }*/
    }

    const newGlobals = {
        canvas,
        context,
        world,
        pageElements: {
            pinyin,
            question,
            table,
            allDivs: divs,
        },
    }
    return newGlobals
}

export function getGlobals() {
    return g
}
