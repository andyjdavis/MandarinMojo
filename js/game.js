/*
 * NOTICE:  All information contained herein is, and remains
 * the property of Andrew Davis.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained.
 * If you want to use this code for something, contact me via http://mandarinmojo.com.
 * I am happy to discuss
 * This code does not come with any sort of warranty.
 */
(function() {

window.game = window.game || { };

window.onload = function(){
    gLeft = $("left_col");
    gRight = $("left_col");
    gTable = $("thetable");

    tl = $("tl");
    tr = $("tr");
    bl = $("bl");
    br = $("br");
    gSlots = [tl, bl, tr, br];

    gCanvas = dc("canvas");
    gContext = gCanvas.getContext("2d");
    gCanvas.width = 512;
    gCanvas.height = 480;
    gLeft.appendChild(gCanvas);

	if (getParameterByName("Pinyin") == 1) {
	    gPinyin = dc("p");
        text = document.createTextNode(" ");
        gPinyin.appendChild(text);
        gLeft.appendChild(gPinyin);
	}
	if (getParameterByName("Audio") == 1) {
        gAudio = dc("span");
        $("foot").appendChild(gAudio);
	}
	if (getParameterByName("English") == 1 || (!gPinyin && !gAudio)) {
		gQuestion = dc("p");
        var text = document.createTextNode(" ");
        gQuestion.appendChild(text);
        gLeft.appendChild(gQuestion);
	}

	gDivs = [tl, bl, tr, br, gQuestion, gPinyin, gAudio];

    gWorld = {
        debug: false,
        keyState: Array(),
        state: new game.StateManager(),
        images: null,
        sounds: null,
        player: new game.Player([64, 85]),
        enemies: Array(),
        projectiles: Array(),
        decorations: Array(),

        problems: Array(), //randomly ordered array of problem instances
        solvedproblems: Array(),
        currentproblem: null,

        currentcharacters: Array(), // four instancs of game.Character for display
        characterpositions: Array([40, 40], //tl
                                  [40, 410], //bl
                                  [410, 80], //tr
                                  [410, 400]), //br
        displaychars: false,

        loopCount: 0,
        score: 0,
        bestscore: 0,
        streak: 0,
        message: null,

        wordsdiv: $('wordcount'),
        scorediv: $('score'),

        textcolor: 'White',
        textsize: '18pt Arial',

        then: Date.now(),
        now: 0,
        dt: 0,

        hp: new HanyuPinyin(),
        tts: new ChineseTextToSpeech()
    };
    gWorld.images = new game.ImageManager();
    gWorld.sounds = new game.SoundManager();

    gWorld.state.setState(gWorld.state.states.LOADING);

    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('keyup', onKeyUp, false);
    gCanvas.addEventListener('click', onMouseClick);

    loadWords();

    mainloop();
    //var ONE_FRAME_TIME = 1000 / 60; // 60 per second
    //setInterval( mainloop, ONE_FRAME_TIME );
}

function onKeyDown(event) {
    var state = gWorld.state.getState();
    if (state == gWorld.state.states.PREGAME || state == gWorld.state.states.END) {
        if (event.keyCode == 69) {
            newGame();
        }
    }
    gWorld.keyState[event.keyCode] = true;
}
function onKeyUp(event) {
    gWorld.keyState[event.keyCode] = false;
}
function onMouseClick(event) {
}
function clearDivs() {
    for (var i in gDivs) {
        if (gDivs[i]) {
            gDivs[i].innerHTML = "";
        }
    }
}

function loadWords() {
	var traditionaloffset = 0;
	if (getParameterByName("traditional") == 1) {
		traditionaloffset = 1;
	}
	var squiglytoneoffset = 1; // hē
	if (getParameterByName("tone") == 1) {
		squiglytoneoffset = 0; // he1
	}

	var files = ["./lang/HSK Official With Definitions 2012 L1.txt",
				 "./lang/HSK Official With Definitions 2012 L2.txt",
				 "./lang/HSK Official With Definitions 2012 L3.txt",
				 "./lang/HSK Official With Definitions 2012 L4.txt",
				 "./lang/HSK Official With Definitions 2012 L5.txt",
				 "./lang/HSK Official With Definitions 2012 L6.txt"];
	var filestouse = Array();
	var wordobjects = Array();
	for (var i in files) {
		var n = i;
		var name = "HSK"+(++n);
		if (getParameterByName(name)) {
			var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
			xmlhttp.onreadystatechange = function() {
				
			}
			xmlhttp.open("GET", files[i], false);
			xmlhttp.send();
			if(xmlhttp.status==200 && xmlhttp.readyState==4) {
				//replace new lines with tabs then split on tabs.
			    var words = xmlhttp.responseText.replace(/(\r\n|\n|\r)/gm,"\t").split(/\t/g);

			    for (var i = 0; i < words.length; i += 5) {
			    	if (words[i] && words[i + traditionaloffset] != "") {

					    wordobjects.push(new game.Word(words[i + traditionaloffset],
                                                        words[i + 2 + squiglytoneoffset],
                                                        squiglytoneoffset == 1 ? words[i + 2] : null,
					                                    words[i + 4],
					                                    true));
			        }
			    }
			}
		}
	}

    var correctwordcharcount = 0;
    var wrongword = null;
    var wordarray = null;
    var totalwordcount = wordobjects.length;
    var attempts = 0;

	for (var i in wordobjects) {
	    correctwordcharcount = wordobjects[i].character.length;
	    wordarray = Array();
	    wordarray.push(wordobjects[i]);
	    attempts = 0;

	    while (wordarray.length < 4) {
	        wrongword = wordobjects[getRandomInt(0, totalwordcount - 1)];
	        if (attempts > 10 || (wrongword.character.length == correctwordcharcount
                    	          && wrongword.character != wordobjects[i].character)) {

                wrongword = new game.Word(wrongword.character, wrongword.pinyin, wrongword.getToRead(), wrongword.english, false);
                wordarray.push(wrongword);
                attempts = 0;
	        } else {
	            attempts++;
	        }
	    }
	    gWorld.problems.push(new game.Problem(shuffleArray(wordarray)));
	}
	gWorld.problems = shuffleArray(gWorld.problems);
}

function newGame() {
    gWorld.score = 0;
    gWorld.streak = 0;
    gWorld.state.setState(gWorld.state.states.INGAME);
    //gWorld.then = 0; // insurance against monsters leaping forward

    //gWorld.player.pos = [gCanvas.width/2, gCanvas.height/2];
    for (var i in gWorld.enemies) {
        gWorld.enemies[i].die();
    }
    gWorld.enemies = Array();
    nextCharacter();
    gWorld.player.setvisibility("visible");

    updateScoreDivs();
}
function playAudio() {
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
}
function nextCharacter() {

    //gWorld.keyState = []; // reset button down state
    gWorld.currentcharacters = Array();

    if (gWorld.problems.length == 0) {
        gWorld.problems = gWorld.solvedproblems;
        gWorld.solvedproblems = [];

        gWorld.message = new game.Message('Do it again');
        gWorld.score += gWorld.problems.length;
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
                playAudio();
            }
        }
        //
    }
    spawnMonsters();

    window.setTimeout(showCharacters, 4000);
    
    for (var i = 0; i < gWorld.currentproblem.words.length; i++) {
        gWorld.currentcharacters[i] = new game.Character(gWorld.characterpositions[i],
                                                    i,
                                                    gWorld.currentproblem.words[i].correct,
                                                    gWorld.currentproblem.words[i].character,
                                                    gWorld.currentproblem.words[i].pinyin,
                                                    gWorld.currentproblem.words[i].english);
    }
}
function showCharacters() {
    if (gWorld.state.getState() == gWorld.state.states.END) {
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
}
function updateTable() {
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

        /*var rows = gTable.getElementsByTagName('TR');
        if (rows.length > 20) {
		    tableRef.removeChild(rows[rows.length-1]);
		}*/
    }
}
function spawnMonsters() {
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
}

function updateGame(dt) {
    if (gWorld.message) {
        if (gWorld.message.update(dt) == false) {
            gWorld.message = null;
        }
    }
    if (gWorld.player) {
        gWorld.player.update(dt);
    }
    for (var i in gWorld.enemies) {
        gWorld.enemies[i].update(dt);
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
}
function explodestuff() {
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
}
function createAura() {
    gWorld.decorations.push(new game.Aura('white', 1, 0.1));
}
function shootProjectile() {
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
}
function updateScoreDivs() {
    var s = gWorld.solvedproblems.length + "/" + (gWorld.problems.length + gWorld.solvedproblems.length + 1);
    gWorld.wordsdiv.innerHTML = "words: " + s;

    gWorld.scorediv.innerHTML = "score: " + gWorld.score;
}
function charactercorrect() {
    gWorld.score++;
    gWorld.streak++;

    var n = null;
    if (gWorld.streak == 5) {
        n = 5;
        gWorld.score += 2;
    } else if (gWorld.streak == 10) {
        n = 10;
        gWorld.score += 5;
    } else if (gWorld.streak == 20) {
        n = 20;
        gWorld.score += 10;
    }
    else if (gWorld.streak == 50) {
        n = 50;
        gWorld.score += 20;
    } else if (gWorld.streak % 100 == 0) {
        n = gWorld.streak;
        gWorld.score += gWorld.streak/2 ;
    }
    if (n) {
        gWorld.message = new game.Message(n + ' in a row');
    }

    gLastCorrect = true;

    updateTable();
    //if (!gAudio) {
        gWorld.sounds.play("success");
    //}
    createAura();
    gWorld.solvedproblems.push(gWorld.currentproblem);
    nextCharacter();
    updateScoreDivs();
}
function characterwrong() {
    gWorld.sounds.play("fail");
    gLastCorrect = false;
    //gWorld.problems.unshift(gWorld.currentproblem);
    gWorld.problems.splice(gWorld.problems.length - 2, 0, gWorld.currentproblem);
    //gWorld.player.setvisibility("hidden");
    gWorld.decorations.push(new game.Explosion(gWorld.player.pos));
    updateTable();
    gWorld.streak = 0;
    nextCharacter();
}
function checkCollisions() {
    var enemy;
    var projectile;
    for (var j = gWorld.enemies.length - 1; j >= 0;j--) {
        enemy = gWorld.enemies[j];

        if (enemy.collideThing(gWorld.player)) {
            enemy.die();
            gWorld.enemies.splice(j, 1);
            gWorld.decorations.push(new game.Explosion(enemy.pos));

            explodestuff();
            clearDivs();
            //gWorld.state.setState(gWorld.state.states.END);
            characterwrong();
            return;
        }
        for (var p in gWorld.projectiles) {
            projectile = gWorld.projectiles[p];
            if (enemy.collideThing(projectile)) {
                enemy.die();
                gWorld.enemies.splice(j, 1);
                gWorld.projectiles.splice(p, 1);
                gWorld.decorations.push(new game.Explosion(enemy.pos));
                spawnMonsters();
                if (gWorld.debug) {
                    console.log('enemy destroyed');
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
            explodestuff();
            clearDivs();

            if (char.iscorrect) {
                shootProjectile();
                charactercorrect();
            } else {
                //gWorld.state.setState(gWorld.state.states.END);
                characterwrong();
            }
            break;
        }
    }
}

function drawInstructions(showImages) {
    drawText(gContext, "Mandarin Mojo", gWorld.textsize, gWorld.textcolor, gCanvas.width/5, 100);
    drawText(gContext, "Collect the correct characters", gWorld.textsize, gWorld.textcolor, gCanvas.width/5, 210);
    drawText(gContext, "Avoid the goblins", gWorld.textsize, gWorld.textcolor, gCanvas.width/5, 240);
    drawText(gContext, "Streaks earns bonus points", gWorld.textsize, gWorld.textcolor, gCanvas.width/5, 270);
    drawText(gContext, "Use the arrow keys to move", gWorld.textsize, gWorld.textcolor, gCanvas.width/5, 300);
    //drawText(gContext, "Use the mouse to aim and fire", gWorld.textsize, gWorld.textcolor, gCanvas.width/5, 350);
    if (showImages) {
        //gContext.drawImage(gImages.getImage('exit'), 40, gCanvas.height/2, gSettings.tilesize, gSettings.tilesize);
        //gContext.drawImage(gImages.getImage('starship'), gCanvas.width - 80, gCanvas.height/2, 30, 30);
    }
    drawText(gContext, "Press e to begin", gWorld.textsize, "white", gCanvas.width/3, 400);

    gWorld.player.draw();
}
    
function drawGame() {
    gContext.clearRect(0, 0, gCanvas.width, gCanvas.height);

    //var img = gWorld.images.getImage('background');
    //if (img) {
        //gContext.drawImage(img, 0, 0);
    //}

    var state = gWorld.state.getState();
    if (state == gWorld.state.states.LOADING) {
        drawInstructions(false);
        var total = gWorld.sounds.sounds.length + gWorld.images.images.length;
        var loaded = gWorld.sounds.numSoundsLoaded + gWorld.images.numImagesLoaded;
        if (loaded < total) {
            //gContext.clearRect(0, 0, gCanvas.width, gCanvas.height);
            var text = "Loading...    "+loaded+"/"+total;
            drawText(gContext, text, gWorld.textsize, gWorld.textcolor, gCanvas.width/5,400);
            //return;
        } else {
            gWorld.state.setState(gWorld.state.states.PREGAME);
        }
    } else if (state == gWorld.state.states.PREGAME) {
        drawInstructions(true);
    } else if (state == gWorld.state.states.INGAME) {
        if (gWorld.message) {
            gWorld.message.draw();
        }
        gWorld.player.draw();
        for (var i in gWorld.projectiles) {
            gWorld.projectiles[i].draw();
        }
        for (var i in gWorld.enemies) {
            gWorld.enemies[i].draw();
        }
        for (var i in gWorld.decorations) {
            gWorld.decorations[i].draw();
        }

        //drawText(gContext, s, gWorld.textsize, gWorld.textcolor, 10, 20);
        //drawText(gContext, gWorld.score, gWorld.textsize, gWorld.textcolor, 480, 20);

    } else if (state == gWorld.state.states.END) {
        drawText(gContext, "Chinese Character Challenge", gWorld.textsize, gWorld.textcolor, gCanvas.width/5, 100);
        drawText(gContext, "You got "+gWorld.score+" in a row.", gWorld.textsize, gWorld.textcolor, 150, 200);
        if (gWorld.score > gWorld.bestscore) {
            gWorld.bestscore = gWorld.score;
        }
        drawText(gContext, "Your best score is "+gWorld.bestscore, gWorld.textsize, gWorld.textcolor, 150, 240);
        drawText(gContext, "Press e to play again", gWorld.textsize, gWorld.textcolor, 150, 350);
        for (var i in gWorld.decorations) {
            gWorld.decorations[i].draw();
        }
    }
}

var mainloop = function() {

    if (gWorld != null) {
        state = gWorld.state.getState();
        //if (state == gWorld.state.states.INGAME) {
        gWorld.now = Date.now();
        if (gWorld.then != 0) {
            gWorld.dt = (gWorld.now - gWorld.then)/1000;
            //gWorld.dt = (1000 / 60)/1000;

            if (gWorld.dt > 0.25) {
                console.log('large dt detected');
                //gWorld.dt = (1000 / 60)/1000; // 1/60th of a second.
                gWorld.dt = 0;
            } else {
                gWorld.loopCount++;
                gWorld.loopCount %= 20; //stop it going to infinity

                updateGame(gWorld.dt);
                if (state == gWorld.state.states.INGAME) {
                    checkCollisions();
                }
                drawGame();
            }
        }
        gWorld.then = gWorld.now;
    }

    window.requestAnimFrame(mainloop);
};
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

}());
