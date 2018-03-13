import { Aura } from "../Aura"
import { AuraRound } from "../Aura_Round"
import { Explosion } from "../Explosion"
import { getGlobals } from "../globals"
import { Message } from "../Message"
import Monster from "../Monster"
import { Player } from "../Player"
import { Powerup } from "../Powerup"
import { Character } from "../Problem/Character"
import { Problem } from "../Problem/Problem"
import { Projectile } from "../Projectile"
import { states } from "../StateManager"
import { IWorld, numberPair } from "../types"
import {
  calcDistance,
  calcNormalVector,
  calcVector,
  drawText,
  getRandomInt,
  normalizeVector,
  shuffleArray,
  updateObjects,
} from "../util"
import { BaseStateEngine, IStateEngine } from "./State"
import { StateArenaEnd } from "./State_ArenaEnd"
import { StateArenaPassed } from "./State_ArenaPassed"

export class StateArena extends BaseStateEngine implements IStateEngine {
  public wordIndex: number
  public wordcount: number

  private level: number

  private monstertype: any
  private monsterSwitch: number

  private problems: Problem[]
  private currentProblem: Problem | null
  private lastCorrect: boolean
  private currentCharacters: Character[]
  private score: number

  private characterPositions: any[]
  private characterAlignments: string[]

  private enemies: Monster[]
  private projectiles: Projectile[]
  private powerups: Powerup[]
  private decorations: Array<Explosion | Aura | AuraRound>

  private shakeTime: number
  private shakeoffset: numberPair
  private shakemax: number
  private shakeduration: number

  private player: Player

  private canvasDimensions: { width: number, height: number } = { width: 0, height: 0 }

  constructor(world: IWorld) {
    super(world)

    this.level = -1 // set by setLevel().
    this.wordIndex = -1
    this.wordcount = -1

    this.monstertype = null
    this.monsterSwitch = 0

    this.problems = []
    this.currentProblem = null
    this.lastCorrect = false
    this.currentCharacters = []
    this.score = 0

    this.characterPositions = Array(
      [20, 40], // tl
      [20, 410], // bl
      [492, 40], // tr
      [492, 410],
    ) // br
    this.characterAlignments = Array("left", "left", "right", "right")

    this.enemies = Array()
    this.projectiles = Array()
    this.powerups = Array()
    this.decorations = Array()

    this.shakeTime = 0
    this.shakeoffset = [0, 0]
    this.shakemax = 5
    this.shakeduration = 500 // ms

    this.player = new Player([64, 85], true)
  }

  // tslint:disable-next-line:no-empty
  public end() { }

  public draw(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
  ) {
    const now = Date.now()
    this.canvasDimensions = { width: canvas.width, height: canvas.height }

    if (this.shakeTime > now) {
      const max = (this.shakeTime - now) / this.shakeduration * this.shakemax
      this.shakeoffset[0] = getRandomInt(-max, max)
      this.shakeoffset[1] = getRandomInt(-max, max)
    } else {
      this.shakeoffset[0] = 0
      this.shakeoffset[1] = 0
    }
    const cameraPos: numberPair = [
      0 + this.shakeoffset[0],
      0 + this.shakeoffset[1],
    ]

    const img = this.world.images.getImage("background")
    if (img) {
      context.drawImage(
        img,
        0 + this.shakeoffset[0],
        0 + this.shakeoffset[1],
      )
    }

    for (const char of this.currentCharacters) {
      char.draw(this.world, canvas, context, cameraPos)
    }

    if (this.world.message) {
      this.world.message.draw(this.world, canvas, context, cameraPos)
    }
    for (const projectile of this.projectiles) {
      projectile.draw(this.world, canvas, context, cameraPos)
    }
    for (const powerup of this.powerups) {
      powerup.draw(this.world, canvas, context, cameraPos)
    }
    for (const enemy of this.enemies) {
      enemy.draw(this.world, canvas, context, cameraPos)
    }
    this.player.draw(this.world, canvas, context, cameraPos)
    for (const decoration of this.decorations) {
      decoration.draw(this.world, canvas, context, cameraPos)
    }

    let s = null
    if (this.level > 0) {
      s = "HSK " + this.level
    } else {
      s = "Review"
    }
    drawText(context, s, this.world.textsize, this.world.textcolor, 40, 0)

    s = this.score + "/" + this.wordcount
    const x = canvas.width - 13 * s.length
    drawText(context, s, this.world.textsize, this.world.textcolor, x, 0, 1.0, "left")
  }
  public update(dt: number) {
    updateObjects(this.enemies, dt, this.player)
    updateObjects(this.projectiles, dt)
    updateObjects(this.powerups, dt)
    updateObjects(this.decorations, dt)

    const bounds = [[0, 0], [this.world.arenaWidth, this.world.arenaHeight]]
    this.player.update(dt, bounds)
    this.checkCollisions(this.world.debug)

    this.spawnMonsters()
    return true
  }
  public onKeyDown(event: KeyboardEvent) {
    // "e" to exit
    if (event.keyCode === 69) {
      this.player.health = 0
      this.characterwrong()
    }
  }
  public setLevel(level: number) {
    this.level = level

    if (level > 0) {
      this.problems = this.world.problems[this.level].slice(0) // copy the array
      this.problems = shuffleArray(this.problems)
    } else {
      // Done in nextCharacter()
      // Use player list.
      this.problems = this.world.playerinfo.problems.slice(0) // copy the array
      this.wordcount = this.getProblemsToGoCount()
    }
    this.nextCharacter()
  }

  public checkCollisions(debug: boolean) {
    let enemy: Monster
    for (let j = this.enemies.length - 1; j >= 0; j--) {
      enemy = this.enemies[j]

      if (enemy.collideThing(this.player)) {
        if (enemy.isDead()) {
          continue
        }
        enemy.die()
        this.enemies.splice(j, 1)
        this.decorations.push(new Explosion(enemy.pos))

        this.characterwrong()
        return
      }
      for (const projectile of this.projectiles) {
        if (enemy.collideThing(projectile)) {
          enemy.hit(normalizeVector(projectile.vel))
          this.projectiles = this.projectiles.filter((p) => p !== projectile)
          this.decorations.push(new Explosion(enemy.pos))
          this.spawnMonsters()
          if (debug) {
            console.log("enemy hit")
          }
          this.shake()
          break
        }
      }
    }

    for (const char of this.currentCharacters) {
      if (!char.visible) {
        continue
      }

      if (char.collideThing(this.player)) {
        this.explodestuff()
        this.clearDivs()

        if (char.iscorrect) {
          this.shootProjectile()
          this.charactercorrect(char.getCenter())
        } else {
          this.characterwrong()
        }
        break
      }
    }

    for (const powerup of this.powerups) {
      if (powerup.collideThing(this.player)) {
        this.decorationHealth()
        this.powerups = this.powerups.filter((p) => p !== powerup)
        this.player.healed()
        if (debug) {
          console.log("got power up")
        }
        break
      }
    }
  }
  public gotoend() {
    this.explodestuff()
    this.clearDivs()

    if (!this.world.state) {
      throw new Error("state manager is null")
    }

    const stateengine = this.world.state.setState(states.ARENAEND) as StateArenaEnd
    stateengine.decorations = this.decorations
    stateengine.level = this.level
    stateengine.wordcount = this.wordcount
    stateengine.got = this.score
  }
  public explodestuff() {
    // explode monsters
    // for (const j in this.enemies) {
    // this._decorations.push(new Explosion(this._enemies[j].pos));
    // }

    // explode the characters
    for (const j in this.currentCharacters) {
      if (!this.currentCharacters[j].iscorrect) {
        this.decorations.push(
          new Explosion(this.currentCharacters[j].getCollisionPos()),
        )
      }
    }
  }
  public clearDivs() {
    const globals = getGlobals()
    if (!globals) {
      return
    }

    for (const div of globals.pageElements.allDivs) {
      div.innerHTML = ""
    }
  }
  public shake() {
    this.shakeTime = Date.now() + this.shakeduration
  }
  public shootProjectile() {
    if (this.enemies.length <= 0) {
      return
    }

    // Find the closest enemy.
    let closestEnemy = null
    let leastdistance = null
    let distance = null
    for (const enemy of this.enemies) {
      distance = Math.abs(
        calcDistance(calcVector(this.player.pos, enemy.pos)),
      )
      if (closestEnemy == null || leastdistance == null || distance < leastdistance) {
        closestEnemy = enemy
        leastdistance = distance
        continue
      }
    }

    if (!closestEnemy) {
      console.error("failed to find a closest enemy")
      return
    }

    const target: numberPair = [
      closestEnemy.pos[0] + closestEnemy.size[0] / 2,
      closestEnemy.pos[1] + closestEnemy.size[1] / 2,
    ]

    const playerX = this.player.pos[0] + this.player.size[0] / 2
    const playerY = this.player.pos[1] + this.player.size[1] / 2
    const vector = calcNormalVector(target, [playerX, playerY])

    const pos: numberPair = [this.player.pos[0], this.player.pos[1]]

    const projectile = new Projectile(pos, [vector[0] * 200, vector[1] * 200])
    this.projectiles.push(projectile)
  }
  public spawnPowerup() {
    if (this.level === 0) {
      // No health in the review arena.
      return
    }
    if (Math.random() < 0.1) {
      const pos: numberPair = [
        getRandomInt(20, this.canvasDimensions.width - 20),
        getRandomInt(20, this.canvasDimensions.height - 20),
      ]
      const p = new Powerup(pos)
      this.powerups.push(p)
    }
  }
  public charactercorrect(pos: numberPair) {

    this.score++
    if (this.score > this.world.playerinfo.highscores[this.level]) {
      this.world.playerinfo.highscores[this.level] = this.score
    }
    if (this.currentProblem) {
      this.world.playerinfo.problemCorrect(this.currentProblem)
    }

    let n = null
    if (this.score === 5) {
      n = 5
    } else if (this.score === 10) {
      n = 10
    } else if (this.score === 20) {
      n = 20
    } else if (this.score === 50) {
      n = 50
    } else if (this.score % 100 === 0) {
      n = this.score
    }
    if (n) {
      this.world.message = new Message(n + " in a row")
    }

    this.lastCorrect = true

    this.updateTable()
    // if (!gAudio) {
    // this.world.sounds.play("success");
    // }
    this.decorationCorrect(pos)
    this.nextCharacter()
  }
  public characterwrong() {
    this.lastCorrect = false
    if (this.currentProblem) {
      this.world.playerinfo.problemWrong(this.currentProblem)
    }

    this.decorations.push(new Explosion(this.player.pos))
    this.updateTable()

    // No health in the review arena.
    if (this.level > 0) {
      this.player.hurt()
    }
    if (this.player.health <= 0) {
      this.gotoend()
    } else {
      this.nextCharacter()
    }
  }
  public updateTable() {
    if (this.currentProblem) {
      const globals = getGlobals()
      if (!globals) {
        return
      }

      const tableRef = globals.pageElements.table.getElementsByTagName("tbody")[0]
      // var newRow = tableRef.insertRow(tableRef.rows.length);
      const newRow = tableRef.insertRow(0)
      if (!this.lastCorrect) {
        newRow.className = "wrong"
      } else {
        newRow.className = "correct"
      }
      const cell1 = newRow.insertCell(0)
      const cell2 = newRow.insertCell(1)
      const cell3 = newRow.insertCell(2)
      cell3.className = "previouscharacter"

      let correctword = null
      for (const i in this.currentCharacters) {
        if (this.currentCharacters[i].iscorrect) {
          correctword = this.currentCharacters[i]
          break
        }
      }

      if (correctword != null) {
        const english = document.createTextNode(correctword.english)
        cell1.appendChild(english)

        const pinyin = document.createTextNode(correctword.pinyin)
        cell2.appendChild(pinyin)

        const character = document.createTextNode(correctword.character)
        cell3.appendChild(character)
      } else {
        console.log("null correctword detected")
      }
    }
  }
  public spawnMonsters() {
    if (this.level === 0) {
      // No monsters in the review arena.
      return
    }
    const totalcount = this.wordcount
    const percentsolved = this.score / totalcount
    const n = Math.ceil(percentsolved * 10)

    let door: number
    let pos: numberPair
    let m: Monster
    if (this.world.debug) {
      // console.log("There are "+this._enemies.length+" monsters, there should be "+n);
    }
    while (this.enemies.length < n) {
      door = Math.floor(Math.random() * 4) + 1

      if (door === 1) {
        pos = [0, this.canvasDimensions.height / 2]
      } else if (door === 2) {
        pos = [this.canvasDimensions.width / 2, 0]
      } else if (door === 3) {
        pos = [this.canvasDimensions.width, this.canvasDimensions.height / 2]
      } else /*if (door == 4)*/ {
        pos = [this.canvasDimensions.width / 2, this.canvasDimensions.height]
      }

      this.monsterSwitch--
      if (this.monsterSwitch <= 0) {
        if (this.world.debug) {
          console.log("changing monster type")
        }
        let newType = this.monstertype
        while (newType === this.monstertype) {
          newType = getRandomInt(0, 2)
        }
        this.monstertype = newType

        this.monsterSwitch = 10
      }
      m = new Monster(pos, this.monstertype)
      this.enemies.push(m)

      if (this.world.debug) {
        console.log("spawning a new monster")
      }
    }
  }
  public getProblemsToGoCount() {
    if (this.level > 0) {
      return this.problems.length
    }
    return this.world.playerinfo.getProblemsToGoCount()
  }
  public nextCharacter() {
    this.currentCharacters = Array()
    this.currentProblem = null

    if (this.level === 0) {
      this.problems = this.world.playerinfo.problems.slice(0) // re-copy the array
    }

    const togo = this.getProblemsToGoCount()
    if (this.world.debug) {
      console.log("nextCharacter() " + togo + " characters to go")
    }
    if (togo < 1) {
      if (!this.world.state) {
        throw new Error("state manager is null")
      }
      const stateEngine = this.world.state.setState(states.ARENAPASSED) as StateArenaPassed
      stateEngine.decorations = this.decorations
      stateEngine.level = this.level
      return
    }
    this.currentProblem = this.problems.pop() || null
    if (!this.currentProblem) {
      console.error("couldnt retrieve a current problem")
      return
    }

    /*if (this.world.debug) {
            console.log('FAVORING LONG WORDS');
            while (!this._currentproblem) {
                this._currentproblem = this._problems.pop();
                if (this._currentproblem.words[0].character.length <3) {
                    this._currentproblem = null;
                }
            }
        }*/

    if (this.player.health < this.player.maxhealth) {
      this.spawnPowerup()
    }
    if (this.world.debug) {
      console.log(
        "Retrieving next problem. " +
        this.problems.length +
        " problems remain after this one.",
      )
    }

    if (this.world.debug) {
      // http://en.wikipedia.org/wiki/Standard_Chinese_phonology#Tones
      // two 3rds 水果  33 becomes 23
      // a fifth 爸爸
      // 不 is 4th except when followed by another 4th when it changes to 2nd.
      /*var forcecharacter = '医院';
            console.log('FORCING '+forcecharacter);
            while (true) {
                if ((this._currentproblem.words[0].character == forcecharacter && this._currentproblem.words[0].correct)
                    || (this._currentproblem.words[1].character == forcecharacter
                      && this._currentproblem.words[1].correct)
                    || (this._currentproblem.words[2].character == forcecharacter
                      && this._currentproblem.words[2].correct)
                    || (this._currentproblem.words[3].character == forcecharacter
                      && this._currentproblem.words[3].correct)) {

                    break;
                }
                this._currentproblem = this._problems.pop();
            }*/
    }

    const globals = getGlobals()
    if (!globals) {
      return
    }

    for (const word of this.currentProblem.words) {
      if (word.correct) {
        if (this.world.debug) {
          console.log(
            "next problem is " + word.english,
          )
        }
        if (globals.pageElements.question) {
          globals.pageElements.question.innerHTML = word.english
        }
        if (globals.pageElements.pinyin) {
          globals.pageElements.pinyin.innerHTML = word.pinyin
        }
        /*if (gAudio) {
          this.playAudio();
        }*/
      }
      //
    }
    this.spawnMonsters()

    const that = this
    window.setTimeout(() => {
      that.showCharacters()
    }, 2000)

    for (let i = 0; i < this.currentProblem.words.length; i++) {
      this.currentCharacters[i] = new Character(
        this.characterPositions[i],
        this.characterAlignments[i],
        i,
        this.currentProblem.words[i].correct,
        this.currentProblem.words[i].character,
        this.currentProblem.words[i].pinyin,
        this.currentProblem.words[i].english,
      )
    }
  }
  public showCharacters() {
    if (!this.world.state) {
      throw new Error("state manager is null")
    }
    if (this.world.state.getState() === states.ARENAEND) {
      return // Player has died.
    }

    for (const character of this.currentCharacters) {
      character.visible = true
    }
  }
  public decorationCorrect(pos: numberPair) {
    this.decorations.push(new AuraRound(pos, "white", 3, 0.4))
  }
  public decorationHealth() {
    this.decorations.push(new Aura(this.player, "white", 3, 0.1))
  }
  /*playAudio() {
    var correct = this._currentproblem.getCorrectWord();
    if (this.world.localTTS) {
      var s = correct.getToRead(true);
      this.world.tts.setInput(s);
      if (this.world.debug) {
        console.log("setting tts input to " + s);
      }
      gAudio.innerHTML = this.world.tts.getHtml();
      window.setTimeout(this.world.tts.speak, 1000);
    } else {
      var that = this;
      setTimeout(function () {
        that.playGoogleAudio();
      }, 1000);
    }
  }
  playGoogleAudio() {
    var text = this._currentproblem.getCorrectWord().character;
    var iframe = $("speechiframe");
    iframe.src =
      "http://translate.google.com/translate_tts?ie=utf-8&tl=zh-CN&q=" + text;
    /*
        var src = 'http://translate.google.com/translate_tts?ie=utf-8&tl=zh-CN&q='+text;
        // tslint:disable-next-line:max-line-length
        var script = `<script type="text/javascript">
        var a = document.getElementById("theaudio");
        a.addEventListener("error", function(e) {parent.this.world.toggleSpeaker();}, true);
        </script>`;
        // tslint:disable-next-line:max-line-length
        var html = `<html><body>
        <audio error="alert(7)" onstalled="alert(3)" autoplay name="media" id="theaudio">
        <source src="'+src+'" type="audio/mpeg">
        </audio>'+script+'</body></html>`;
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(html);
        iframe.contentWindow.document.close();*/
  /*}*/
}
