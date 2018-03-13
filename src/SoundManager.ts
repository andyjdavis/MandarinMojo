/*function onSoundLoad() {
  gWorld.sounds.numSoundsLoaded++;
}
export class SoundManager {
  numSoundsLoaded: number = 0;
  sounds: any[] = [];
  enabled: boolean = true;

  constructor() {
    try {
      //this._context = new webkitAudioContext();

      //this.sounds['success'] = new Audio("success.ogg");
      this.sounds["fail"] = new Audio("thump.ogg");
      //this.sounds['attack'] = new Audio("resources/attack.ogg");

      for (var key in this.sounds) {
        //this.sounds[key].preload = "auto";
        this.sounds[key].addEventListener("loadeddata", onSoundLoad);
        this.sounds[key].volume = 0.2;
      }
    } catch (e) {
      alert(
        "This browser does support html5 audio. I recommend either using either Google Chrome or Firefox."
      );
    }
  }
  togglemute() {
    if (this.enabled) {
      //this.stop('music');
      this.enabled = !this.enabled;
    } else {
      this.enabled = !this.enabled;
      //this.play('music', true);
    }
  }
  play(name: string, loop: boolean) {
    try {
      if (this.enabled && name in this.sounds) {
        if (loop) {
          this.sounds[name].addEventListener(
            "ended",
            function() {
              this.currentTime = 0;
              this.play();
            },
            false
          );
        }
        //if (this.sounds[name].duration > 0 && !this.sounds[name].paused) {
        //    console.log('sound already playing');
        //} else {
        this.sounds[name].currentTime = 0;
        this.sounds[name].play();
        //}
      }
    } catch (e) {
      console.log("sound manager exception:" + e);
    }
  }
  stop(name) {
    if (this.enabled && name in this.sounds) {
      this.sounds[name].pause();
    }
  }
  volume(name, volume) {
    if (this.enabled && name in this.sounds) {
      this.sounds[name].volume = volume;
    }
  }
  isplaying(name) {
    if (this.enabled && name in this.sounds) {
      return !this.sounds[name].paused;
    }
  }
}
*/
