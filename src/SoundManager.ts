import * as success from "./assets/sounds/success.ogg"
import * as fail from "./assets/sounds/thump.ogg"

export class SoundManager {
  public numSoundsLoaded: number = 0
  public sounds: { [key: string]: HTMLAudioElement } = {}
  public enabled: boolean = true

  constructor() {
    try {
      // this._context = new webkitAudioContext();

      this.sounds.success = new Audio(success)
      this.sounds.fail = new Audio(fail)
      // this.sounds['attack'] = new Audio("resources/attack.ogg");

      /*for (const key in this.sounds) {
        // this.sounds[key].preload = "auto";
        this.sounds[key].addEventListener("loadeddata", onSoundLoad)
        this.sounds[key].volume = 0.2
      }*/
    } catch (e) {
      alert(
        "This browser does support html5 audio. I recommend either using either Google Chrome or Firefox.",
      )
    }
  }
  public togglemute() {
    if (this.enabled) {
      this.enabled = !this.enabled
    } else {
      this.enabled = !this.enabled
    }
  }
  public play(name: string, loop?: boolean) {
    try {
      if (this.enabled && name in this.sounds) {
        if (loop) {
          this.sounds[name].addEventListener(
            "ended",
            function() {
              this.currentTime = 0
              this.play()
            },
            false,
          )
        }
        // if (this.sounds[name].duration > 0 && !this.sounds[name].paused) {
        //    console.log('sound already playing');
        // } else {
        this.sounds[name].currentTime = 0
        this.sounds[name].play()
        // }
      }
    } catch (e) {
      console.log("sound manager exception:" + e)
    }
  }
  public stop(name: string) {
    if (this.enabled && name in this.sounds) {
      this.sounds[name].pause()
    }
  }
  public volume(name: string, volume: number) {
    if (this.enabled && name in this.sounds) {
      this.sounds[name].volume = volume
    }
  }
  public isplaying(name: string) {
    if (this.enabled && name in this.sounds) {
      return !this.sounds[name].paused
    }
    return false
  }
}
