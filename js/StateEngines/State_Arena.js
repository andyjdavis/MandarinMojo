//(function() {

window.game = window.game || { };

game.State_Arena = function() {
}
game.State_Arena.prototype = new game.Thing();
game.State_Arena.prototype.constructor = game.State_Arena;

game.State_Arena.prototype.start = function() {
    this.resetDeck();
    //gWorld.player.pos = [gCanvas.width/2, gCanvas.height/2];
    for (var i in gWorld.enemies) {
        gWorld.enemies[i].die();
    }
    gWorld.enemies = Array();
    this.nextCharacter();
    gWorld.player.setvisibility("visible");
    this.updateScoreDisplay();
};
game.State_Arena.prototype.end = function() {
};

game.State_Arena.prototype.draw = function() {
    var img = gWorld.images.getImage('background');
    if (img) {
        gContext.drawImage(img, 0, 0);
    }
    if (gWorld.message) {
        gWorld.message.draw();
    }
    for (var i in gWorld.projectiles) {
        gWorld.projectiles[i].draw();
    }
    for (var i in gWorld.enemies) {
        gWorld.enemies[i].draw();
    }
    gWorld.player.draw();
    for (var i in gWorld.decorations) {
        gWorld.decorations[i].draw();
    }

    //drawText(gContext, s, gWorld.textsize, gWorld.textcolor, 10, 20);
    //drawText(gContext, gWorld.score, gWorld.textsize, gWorld.textcolor, 480, 20);
};
game.State_Arena.prototype.update = function(dt) {
    for (var i = gWorld.enemies.length - 1;i >= 0;i--) {
        if (gWorld.enemies[i].update(dt) == false) {
            gWorld.enemies.splice(i, 1);
            this.spawnMonsters();
        }
    }
    for (var i = gWorld.projectiles.length - 1;i >= 0;i--) {
        if (gWorld.projectiles[i].update(dt) == false) {
            gWorld.projectiles.splice(i, 1);
        }
    }
    for (var i = gWorld.decorations.length - 1;i >= 0;i--) {
        if (gWorld.decorations[i].update(dt) == false) {
            gWorld.decorations.splice(i, 1);
        }
    }
    this.checkCollisions();
};

game.State_Arena.prototype.checkCollisions = function() {
    var enemy;
    var projectile;
    for (var j = gWorld.enemies.length - 1; j >= 0;j--) {
        enemy = gWorld.enemies[j];

        if (enemy.collideThing(gWorld.player)) {
            if (enemy.isDead()) {
                continue;
            }
            enemy.die();
            gWorld.enemies.splice(j, 1);
            gWorld.decorations.push(new game.Explosion(enemy.pos));

            this.explodestuff();
            this.clearDivs();
            // if not practicing, game over
            if (gWorld.mode != 1) {
                gWorld.state.setState(gWorld.state.states.ARENAEND);
            }
            this.characterwrong();
            return;
        }
        for (var p in gWorld.projectiles) {
            projectile = gWorld.projectiles[p];
            if (enemy.collideThing(projectile)) {
                enemy.hit();
                //gWorld.enemies.splice(j, 1);
                gWorld.projectiles.splice(p, 1);
                gWorld.decorations.push(new game.Explosion(enemy.pos));
                this.spawnMonsters();
                if (gWorld.debug) {
                    console.log('enemy hit');
                }
                break;
            }
        }
    }

    var char;
    for (var i in gWorld.currentcharacters) {
        char = gWorld.currentcharacters[i];
        if (!char.visible) {
            continue;
        }

        if (char.collideThing(gWorld.player)) {
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
game.State_Arena.prototype.explodestuff = function() {
    //explode monsters
    for (var j in gWorld.enemies) {
        //gWorld.decorations.push(new game.Explosion(gWorld.enemies[j].pos));
    }

    //explode the characters
    for (var j in gWorld.currentcharacters) {
        if (!gWorld.currentcharacters[j].iscorrect) {
            gWorld.decorations.push(new game.Explosion(gWorld.currentcharacters[j].pos));
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
    if (gWorld.enemies.length <= 0) {
        return;
    }

    // Find the closest enemy.
    var enemy = null;
    var leastdistance = null;
    var distance = null;
    for (var i in gWorld.enemies) {
        distance = Math.abs(calcDistance(calcVector(gWorld.player.pos, gWorld.enemies[i].pos)));
        if (enemy == null || distance < leastdistance) {
            enemy = gWorld.enemies[i];
            leastdistance = distance;
            continue;
        }
    }

    //var enemy = gWorld.enemies[gWorld.enemies.length - 1];
    target = [enemy.pos[0] + enemy.size[0]/2, enemy.pos[1] + enemy.size[1]/2];

    var playerX = gWorld.player.pos[0] + gWorld.player.size[0]/2;
    var playerY = gWorld.player.pos[1] + gWorld.player.size[1]/2;
    var vector = calcNormalVector(target, [playerX, playerY]);

    var pos = [gWorld.player.pos[0], gWorld.player.pos[1]];

    var projectile = new game.Projectile(pos, [vector[0] * 200, vector[1] * 200]);
    gWorld.projectiles.push(projectile);
};
game.State_Arena.prototype.charactercorrect = function() {
    gWorld.score++;
    gWorld.streak++;
    if (gWorld.score > gWorld.bestscore) {
        gWorld.bestscore = gWorld.score;
        gWorld.newbest = true;
    }

    var n = null;
    if (gWorld.streak == 5) {
        n = 5;
        //gWorld.score += 2;
    } else if (gWorld.streak == 10) {
        n = 10;
        //gWorld.score += 5;
    } else if (gWorld.streak == 20) {
        n = 20;
        //gWorld.score += 10;
    }
    else if (gWorld.streak == 50) {
        n = 50;
        //gWorld.score += 20;
    } else if (gWorld.streak % 100 == 0) {
        n = gWorld.streak;
        //gWorld.score += gWorld.streak/2 ;
    }
    if (n) {
        gWorld.message = new game.Message(n + ' in a row');
    }

    gLastCorrect = true;

    this.updateTable();
    //if (!gAudio) {
        gWorld.sounds.play("success");
    //}
    this.createAura();
    gWorld.solvedproblems.push(gWorld.currentproblem);
    this.nextCharacter();
    this.updateScoreDisplay();
};
game.State_Arena.prototype.characterwrong = function() {
    gWorld.sounds.play("fail");
    gLastCorrect = false;

    //gWorld.player.setvisibility("hidden");
    gWorld.decorations.push(new game.Explosion(gWorld.player.pos));
    this.updateTable();
    gWorld.streak = 0;
    // if not practicing, game over
    if (gWorld.mode != 1) {
        gWorld.state.setState(gWorld.state.states.ARENAEND);
    } else {
        gWorld.problems.splice(gWorld.problems.length - 2, 0, gWorld.currentproblem);
        this.nextCharacter();
    }
};
game.State_Arena.prototype.updateScoreDisplay = function() {
    var s = gWorld.solvedproblems.length + "/" + (gWorld.problems.length + gWorld.solvedproblems.length + 1);
    gWorld.wordsdiv.innerHTML = "words: " + s;

    // if not practicing update score
    if (gWorld.mode != 1) {
        //gWorld.scorediv.innerHTML = "score: " + gWorld.score;
    }
}
game.State_Arena.prototype.updateTable = function() {
    if (gWorld.currentproblem) {
        var tableRef = gTable.getElementsByTagName('tbody')[0];
        //var newRow = tableRef.insertRow(tableRef.rows.length);
        var newRow = tableRef.insertRow(0);
        if (!gLastCorrect) {
            newRow.className = "wrong";
        } else {
            newRow.className = "correct";
        }
        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var cell3 = newRow.insertCell(2);
        cell3.className = 'previouscharacter';

        var correctword = null;
        for (var  i in gWorld.currentcharacters) {
            if (gWorld.currentcharacters[i].iscorrect) {
                correctword = gWorld.currentcharacters[i];
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
    var totalcount = gWorld.problems.length + gWorld.solvedproblems.length + 1;
    var percentsolved = gWorld.solvedproblems.length / totalcount;
    var n = Math.ceil(percentsolved * 10);

    var door, pos, m;
    if (gWorld.debug) {
        console.log("There are "+gWorld.enemies.length+" monsters but there should be "+n);
    }
    while (gWorld.enemies.length < n) {
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
        gWorld.enemies.push(m);
    }
};
game.State_Arena.prototype.resetDeck = function() {
    if (gWorld.problems.length == 0) {
        gWorld.problems = gWorld.solvedproblems;
        gWorld.message = new game.Message('Do it again');
    } else {
        gWorld.problems = gWorld.problems.concat(gWorld.solvedproblems);
    }
    gWorld.problems = shuffleArray(gWorld.problems);

    gWorld.solvedproblems = [];
    //gWorld.score += gWorld.problems.length;
};
game.State_Arena.prototype.nextCharacter = function() {

    //gWorld.keyState = []; // reset button down state
    gWorld.currentcharacters = Array();

    if (gWorld.problems.length == 0) {
        this.resetDeck();
    }

    gWorld.currentproblem = gWorld.problems.pop();
    for (var i = 0; i < gWorld.currentproblem.words.length; i++) {
        if (gWorld.currentproblem.words[i].correct) {
            if (gWorld.debug) {
                console.log("next problem is "+ gWorld.currentproblem.words[i].english);
            }
            if (gQuestion) {
                gQuestion.innerHTML = gWorld.currentproblem.words[i].english;
            }
            if (gPinyin) {
                gPinyin.innerHTML = gWorld.currentproblem.words[i].pinyin;
            }
            if (gAudio) {
                //gWorld.correctcharacter = gWorld.currentproblem.words[i].character;
                this.playAudio();
            }
        }
        //
    }
    this.spawnMonsters();

    window.setTimeout(this.showCharacters, 2000);

    for (var i = 0; i < gWorld.currentproblem.words.length; i++) {
        gWorld.currentcharacters[i] = new game.Character(gWorld.characterpositions[i],
                                                    i,
                                                    gWorld.currentproblem.words[i].correct,
                                                    gWorld.currentproblem.words[i].character,
                                                    gWorld.currentproblem.words[i].pinyin,
                                                    gWorld.currentproblem.words[i].english);
    }
};
game.State_Arena.prototype.showCharacters = function() {
    if (gWorld.state.getState() == gWorld.state.states.ARENAEND) {
        return; // Player has died.
    }
    /*for (var i = 0; i < gWorld.currentproblem.words.length; i++) {
        gWorld.currentcharacters[i] = new game.Character(gWorld.characterpositions[i],
                                                    i,
                                                    gWorld.currentproblem.words[i].correct,
                                                    gWorld.currentproblem.words[i].character,
                                                    gWorld.currentproblem.words[i].pinyin,
                                                    gWorld.currentproblem.words[i].english);
    }*/
    for (var i = 0; i < gWorld.currentproblem.words.length; i++) {
        gSlots[i].innerHTML = gWorld.currentproblem.words[i].character;
    }

    // the divs in gSlots will change size based on the number of characters to be displayed.
    // Adjust the object's pos and size so that collision detection works.
    for (var i in gWorld.currentcharacters) {
        char = gWorld.currentcharacters[i];
        char.visible = true;

        var offsets = gSlots[i].getBoundingClientRect();
        var top = offsets.top;
        var left = offsets.left;
        char.pos = [offsets.left, offsets.top];
        char.size = [offsets.width, offsets.height];
        char.correctFootprint();
    }
};
game.State_Arena.prototype.createAura = function() {
    gWorld.decorations.push(new game.Aura('white', 1, 0.1));
};
game.State_Arena.prototype.playAudio = function() {
    var correct = gWorld.currentproblem.getCorrectWord();

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
