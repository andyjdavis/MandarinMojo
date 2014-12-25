//(function() {

window.game = window.game || { };

game.State_Arena = function() {
    this.player = new game.Player([64, 85]);

    this._level = -1;
    this.wordindex = -1;
    this.wordcount = -1;

    this._problems = null;
    this._currentproblem = null;
    this._lastCorrect = false;
    this._currentcharacters = null;
    this._score = 0;

    this._characterpositions = Array([20, 40], //tl
                                     [20, 410], //bl
                                     [492, 40], //tr
                                     [492, 410]); //br
    this._characteralignments = Array('left', 'left', 'right', 'right');
}
game.State_Arena.prototype = new game.Thing();
game.State_Arena.prototype.constructor = game.State_Arena;

game.State_Arena.prototype.start = function() {
    //this.player.pos = [gCanvas.width/2, gCanvas.height/2];
    //for (var i in this.enemies) {
    //    this.enemies[i].die();
    //}
    this.enemies = Array();
    this.projectiles = Array();
    this.decorations = Array();
};
game.State_Arena.prototype.end = function() {
};

game.State_Arena.prototype.draw = function() {
    var img = gWorld.images.getImage('background');
    if (img) {
        gContext.drawImage(img, 0, 0);
    }

    for (var i in this._currentcharacters) {
        char = this._currentcharacters[i];
        char.draw();
    }

    if (gWorld.message) {
        gWorld.message.draw();
    }
    for (var i in this.projectiles) {
        this.projectiles[i].draw();
    }
    for (var i in this.enemies) {
        this.enemies[i].draw();
    }
    this.player.draw();
    for (var i in this.decorations) {
        this.decorations[i].draw();
    }

    var s = "Arena: " + gWorld.solvedproblems.length + "/" + this.wordcount;
    drawText(gContext, s, gWorld.textsize, gWorld.textcolor, 5, 0, 1.0, 'left');

    //drawText(gContext, "asdf", gWorld.textsize, gWorld.textcolor, 480, 0);
};
game.State_Arena.prototype.update = function(dt) {
    /*for (var i = this.enemies.length - 1;i >= 0;i--) {
        if (this.enemies[i].update(dt, this.player) == false) {
            this.enemies.splice(i, 1);
            this.spawnMonsters();
        }
    }*/
    updateObjects(this.enemies, dt, this.player);
    updateObjects(this.projectiles, dt);
    updateObjects(this.decorations, dt);

    this.player.update(dt);
    this.checkCollisions();

    this.spawnMonsters();
};
game.State_Arena.prototype.setLevel = function(level) {
    this._level = level;
    this._problems = gWorld.problems[this._level - 1].slice(0); //copy the array
    this.nextCharacter();
};

game.State_Arena.prototype.checkCollisions = function() {
    var enemy;
    var projectile;
    for (var j = this.enemies.length - 1; j >= 0;j--) {
        enemy = this.enemies[j];

        if (enemy.collideThing(this.player)) {
            if (enemy.isDead()) {
                continue;
            }
            enemy.die();
            this.enemies.splice(j, 1);
            this.decorations.push(new game.Explosion(enemy.pos));

            this.explodestuff();
            this.clearDivs();
            // if not practicing, game over
            if (gWorld.mode != 1) {
                this.gotoend();
            }
            this.characterwrong();
            return;
        }
        for (var p in this.projectiles) {
            projectile = this.projectiles[p];
            if (enemy.collideThing(projectile)) {
                enemy.hit();
                //this.enemies.splice(j, 1);
                this.projectiles.splice(p, 1);
                this.decorations.push(new game.Explosion(enemy.pos));
                this.spawnMonsters();
                if (gWorld.debug) {
                    console.log('enemy hit');
                }
                break;
            }
        }
    }

    var char;
    for (var i in this._currentcharacters) {
        char = this._currentcharacters[i];
        if (!char.visible) {
            continue;
        }

        if (char.collideThing(this.player)) {
            this.explodestuff();
            this.clearDivs();

            if (char.iscorrect) {
                this.shootProjectile();
                this.charactercorrect();
            } else {
                this.characterwrong();
            }
            break;
        }
    }
};
game.State_Arena.prototype.gotoend = function() {
    var state = gWorld.state.setState(gWorld.state.states.ARENAEND);
    state.decorations = this.decorations;
    state.level = this._level;
    state.wordcount = this.wordcount;

    state.got = this._score;
};
game.State_Arena.prototype.explodestuff = function() {
    //explode monsters
    for (var j in this.enemies) {
        //this.decorations.push(new game.Explosion(this.enemies[j].pos));
    }

    //explode the characters
    for (var j in this._currentcharacters) {
        if (!this._currentcharacters[j].iscorrect) {
            this.decorations.push(new game.Explosion(this._currentcharacters[j].pos));
        }
    }
};
game.State_Arena.prototype.clearDivs = function() {
    for (var i in gDivs) {
        if (gDivs[i]) {
            gDivs[i].innerHTML = "";
        }
    }
};
game.State_Arena.prototype.shootProjectile = function() {
    if (this.enemies.length <= 0) {
        return;
    }

    // Find the closest enemy.
    var enemy = null;
    var leastdistance = null;
    var distance = null;
    for (var i in this.enemies) {
        distance = Math.abs(calcDistance(calcVector(this.player.pos, this.enemies[i].pos)));
        if (enemy == null || distance < leastdistance) {
            enemy = this.enemies[i];
            leastdistance = distance;
            continue;
        }
    }

    //var enemy = this.enemies[this.enemies.length - 1];
    target = [enemy.pos[0] + enemy.size[0]/2, enemy.pos[1] + enemy.size[1]/2];

    var playerX = this.player.pos[0] + this.player.size[0]/2;
    var playerY = this.player.pos[1] + this.player.size[1]/2;
    var vector = calcNormalVector(target, [playerX, playerY]);

    var pos = [this.player.pos[0], this.player.pos[1]];

    var projectile = new game.Projectile(pos, [vector[0] * 200, vector[1] * 200]);
    this.projectiles.push(projectile);
};
game.State_Arena.prototype.charactercorrect = function() {
    this._score++;
    gWorld.streak++;
    if (this._score > gWorld.bestscore) {
        gWorld.bestscore = this._score;
        gWorld.newbest = true;
    }

    var n = null;
    if (gWorld.streak == 5) {
        n = 5;
        //this._score += 2;
    } else if (gWorld.streak == 10) {
        n = 10;
        //this._score += 5;
    } else if (gWorld.streak == 20) {
        n = 20;
        //this._score += 10;
    }
    else if (gWorld.streak == 50) {
        n = 50;
        //this._score += 20;
    } else if (gWorld.streak % 100 == 0) {
        n = gWorld.streak;
        //this._score += gWorld.streak/2 ;
    }
    if (n) {
        gWorld.message = new game.Message(n + ' in a row');
    }

    this._lastcorrect = true;

    this.updateTable();
    //if (!gAudio) {
        gWorld.sounds.play("success");
    //}
    this.createAura();
    gWorld.solvedproblems.push(this._currentproblem);
    this.nextCharacter();
};
game.State_Arena.prototype.characterwrong = function() {
    gWorld.sounds.play("fail");
    this._lastcorrect = false;

    this.decorations.push(new game.Explosion(this.player.pos));
    this.updateTable();
    gWorld.streak = 0;
    this.gotoend();
};
game.State_Arena.prototype.updateTable = function() {
    if (this._currentproblem) {
        var tableRef = gTable.getElementsByTagName('tbody')[0];
        //var newRow = tableRef.insertRow(tableRef.rows.length);
        var newRow = tableRef.insertRow(0);
        if (!this._lastcorrect) {
            newRow.className = "wrong";
        } else {
            newRow.className = "correct";
        }
        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var cell3 = newRow.insertCell(2);
        cell3.className = 'previouscharacter';

        var correctword = null;
        for (var  i in this._currentcharacters) {
            if (this._currentcharacters[i].iscorrect) {
                correctword = this._currentcharacters[i];
                break;
            }
        }

        if (correctword != null) {
            var text = document.createTextNode(correctword.english);
            cell1.appendChild(text);

            var text = document.createTextNode(correctword.pinyin);
            cell2.appendChild(text);

            var text = document.createTextNode(correctword.character);
            cell3.appendChild(text);
        } else {
            console.log('null correctword detected');
        }
    }
};
game.State_Arena.prototype.spawnMonsters = function() {
    var totalcount = this.wordcount;
    var percentsolved = gWorld.solvedproblems.length / totalcount;
    var n = Math.ceil(percentsolved * 10);

    var door, pos, m;
    if (gWorld.debug) {
        console.log("There are "+this.enemies.length+" monsters but there should be "+n);
    }
    while (this.enemies.length < n) {
        door = Math.floor(Math.random() * 4) + 1;

        if (door == 1) {
            pos = [0, gCanvas.height/2];
        } else if (door == 2) {
            pos = [gCanvas.width/2, 0];
        } else if (door == 3) {
            pos = [gCanvas.width, gCanvas.height/2];
        } else if (door == 4) {
            pos = [gCanvas.width/2, gCanvas.height];
        }
        m = new game.Monster(pos);
        this.enemies.push(m);
    }
};
game.State_Arena.prototype.nextCharacter = function() {

    //gWorld.keyState = []; // reset button down state
    this._currentcharacters = Array();

    this._currentproblem = this._problems.pop();
    for (var i = 0; i < this._currentproblem.words.length; i++) {
        if (this._currentproblem.words[i].correct) {
            if (gWorld.debug) {
                console.log("next problem is "+ this._currentproblem.words[i].english);
            }
            if (gQuestion) {
                gQuestion.innerHTML = this._currentproblem.words[i].english;
            }
            if (gPinyin) {
                gPinyin.innerHTML = this._currentproblem.words[i].pinyin;
            }
            if (gAudio) {
                //gWorld.correctcharacter = this._currentproblem.words[i].character;
                this.playAudio();
            }
        }
        //
    }
    this.spawnMonsters();

    var that = this;
    window.setTimeout(function(){that.showCharacters()}, 2000);

    for (var i = 0; i < this._currentproblem.words.length; i++) {
        this._currentcharacters[i] = new game.Character(this._characterpositions[i],
                                                        this._characteralignments[i],
                                                        i,
                                                        this._currentproblem.words[i].correct,
                                                        this._currentproblem.words[i].character,
                                                        this._currentproblem.words[i].pinyin,
                                                        this._currentproblem.words[i].english);
    }
};
game.State_Arena.prototype.showCharacters = function() {
    if (gWorld.state.getState() == gWorld.state.states.ARENAEND) {
        return; // Player has died.
    }

    for (var i in this._currentcharacters) {
        char = this._currentcharacters[i];
        char.visible = true;
    }
};
game.State_Arena.prototype.createAura = function() {
    this.decorations.push(new game.Aura(this.player, 'white', 1, 0.1));
};
game.State_Arena.prototype.playAudio = function() {
    var correct = this._currentproblem.getCorrectWord();

    var s = correct.getToRead();
    s = s.replace(/(\d+)/g, "$1 "); // put spaces between the syllables
    s = s.toLowerCase();

    // replace some sounds that don't have audio files
    // this makes ba4ba5 not work.
    s = s.replace("5", "4");

    gWorld.tts.setInput(s);
    if (gWorld.debug) {
        console.log("setting tts input to " + s);
    }
    gAudio.innerHTML = gWorld.tts.getHtml();

    window.setTimeout(gWorld.tts.speak, 1000);
};

//}());
