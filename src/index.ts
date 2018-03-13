import { getGlobals } from "./globals"
import { drawText, getParameterByName } from "./util"

import { StateMap } from "./StateEngines/State_Map"
import { StateOverlay } from "./StateEngines/State_Overlay"
import { StateManager, states } from "./StateManager"
import { IWordManagerOptions, WordManager } from "./WordManager"

const globals = getGlobals()
globals.world.state = new StateManager() // Defaults to state LOADING.

window.addEventListener("keydown", onKeyDown, false)
window.addEventListener("keyup", onKeyUp, false)

loadWords()

function onKeyDown(event: KeyboardEvent) {
  // console.log(event.keyCode);
  if (!globals.world) {
    throw new Error("onKeyDown: world is null")
    return
  }

  const stateManager = globals.world.state
  if (!stateManager) {
    throw new Error("onKeyDown: state manager is null")
  }
  const stateEngine = stateManager.getStateEngine()
  if (!!(stateEngine as any).onKeyDown) {
    (stateEngine as any).onKeyDown(event)
  }

  const state = stateManager.getState()

  // The following should really be done in the relevant state engines.
  if (
    state === states.ARENA ||
    state === states.PAUSED
  ) {
    if (event.keyCode === 80) {
      // p
      pause()
    }
    if (event.keyCode === 77) {
      // m
      mute()
    }
    if (event.keyCode === 83) {
      // s
      // world.toggleSpeaker();
    }
  }
  if (
    state === states.MAP ||
    state === states.OVERLAY
  ) {
    if (event.keyCode === 72) {
      // h
      overlay()
    }
  }
  globals.world.keyState[event.keyCode] = true
}
function onKeyUp(event: KeyboardEvent) {
  if (!globals.world) {
    return
  }
  globals.world.keyState[event.keyCode] = false
}
function pause() {
  if (!globals.world) {
    console.error("pause: world is null")
    return
  }
  const stateManager = globals.world.state
  if (!stateManager) {
    throw new Error("pause: state manager is null")
  }
  const state = stateManager.getState()
  if (state === states.ARENA) {
    stateManager.pushState(states.PAUSED)
  } else if (state === states.PAUSED) {
    stateManager.popState()
  }
  // ignore p if in any other state
}
function mute() {
  /*
    gWorld.sounds.togglemute();
  if (gWorld.sounds.enabled) {
    gWorld.message = new Message("unmuted");
  } else {
    gWorld.message = new Message("muted");
  }*/
  console.error("mute not implemented")
}
function overlay() {
  if (!globals.world) {
    return
  }
  const stateManager = globals.world.state
  if (!stateManager) {
    throw new Error("state manager is null")
  }
  const state = stateManager.getState()
  if (state === states.MAP) {
    const stateEngine = stateManager.getStateEngine() as StateMap
    const cameraPosition = stateEngine.cameraposition
    const bottomRight = stateEngine._getBottomRight()

    const overlayStateEngine = stateManager.pushState(states.OVERLAY) as StateOverlay
    overlayStateEngine.cameraPosition = cameraPosition
    overlayStateEngine.bottomRight = bottomRight
  } else if (state === states.OVERLAY) {
    stateManager.popState()
  }
  // ignore h if in any other state
}

function loadWords() {
  if (!globals.world) {
    console.error("nowhere to store loaded problems")
    return
  }
  const traditional = getParameterByName("traditional") === "1"

  const options: IWordManagerOptions = {
    traditional,
    debug: globals.world.debug,
  }

  for (let i = 1; i <= 6; i++) {
    // const name = "HSK" + i.toString()
    // if (getParameterByName(name)) {
    // }
  }

  const wordManager = new WordManager()
  globals.world.problems = wordManager.loadProblems(options)
}

function updateGame() {
  if (!globals.world) {
    return
  }
  const stateManager = globals.world.state
  if (!stateManager) {
    throw new Error("state manager is null")
  }
  const stateengine = stateManager.getStateEngine()
  if (stateengine) {
    stateengine.update(globals.world.dt)
  }
  if (globals.world.message) {
    if (globals.world.message.update(globals.world.dt) === false) {
      globals.world.message = null
    }
  }
}

function drawGame(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  if (!globals.world) {
    return
  }
  const stateManager = globals.world.state
  if (!stateManager) {
    throw new Error("state manager is null")
  }

  context.clearRect(0, 0, canvas.width, canvas.height)

  stateManager.getStateEngine().draw(canvas, context)
  if (globals.world.debug) {
    const frames = Math.floor(1 / globals.world.dt)
    drawText(context, frames.toString(), globals.world.textsize, globals.world.textcolor, 150, 0)
  }
}

const callbackOfLastResort = (callback: any) => {
  window.setTimeout(callback, 1000 / 60)
}

const requestAnimFrame = () => {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    // window.mozRequestAnimationFrame ||
    callbackOfLastResort
  )
}

const mainloop = () => {

  if (globals.world === null) {
    console.error("mainloop has null world")
    return
  }
  const stateManager = globals.world.state
  if (!stateManager) {
    throw new Error("state manager is null")
  }

  globals.world.now = Date.now()

  const state = stateManager.getState()
  if (state !== states.PAUSED && globals.world.then !== 0) {
    globals.world.dt = (globals.world.now - globals.world.then) / 1000
    // world.dt = (1000 / 60)/1000;

    if (globals.world.dt > 0.25) {
      console.log("large dt detected")
      // world.dt = (1000 / 60)/1000; // 1/60th of a second.
      globals.world.dt = 0
    } else {
      globals.world.loopCount++
      globals.world.loopCount %= 20 // stop it going to infinity

      updateGame()

      const context = globals.context
      const canvas = globals.canvas
      drawGame(context, canvas)
    }
  }
  globals.world.then = globals.world.now

  const requestFrame = requestAnimFrame()
  requestFrame(mainloop)
}

mainloop()
// var ONE_FRAME_TIME = 1000 / 60; // 60 per second
// setInterval( mainloop, ONE_FRAME_TIME );
// }
