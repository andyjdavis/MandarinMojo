/*
 * This code does not come with any sort of warranty.
 * You are welcome to use it for whatever you like.
 */
(function() {

window.game = window.game || { };

window.onload = function(){
    gLeft = document.getElementById("left_col");
    gRight = document.getElementById("left_col");
    gTable = document.getElementById("thetable");

    tl = document.getElementById("tl");
    tr = document.getElementById("tr");
    bl = document.getElementById("bl");
    br = document.getElementById("br");
    gSlots = [tl, bl, tr, br];

    gCanvas = document.createElement("canvas");
    gContext = gCanvas.getContext("2d");
    gCanvas.width = 512;
    gCanvas.height = 480;
    gLeft.appendChild(gCanvas);

    var format = getParameterByName("format");
	if (format == 1 || format == 2) {
		gQuestion = document.createElement("p");
        var text = document.createTextNode(" ");
        gQuestion.appendChild(text);
        gLeft.appendChild(gQuestion);
	}
	if (format == 0 || format == 2) {
	    gPinyin = document.createElement("p");
        text = document.createTextNode(" ");
        gPinyin.appendChild(text);
        gLeft.appendChild(gPinyin);
	}

	gDivs = [tl, bl, tr, br, gQuestion, gPinyin];

    gWorld = {
        keyState: Array(),
        state: new game.StateManager(),
        images: new game.ImageManager(),
        sounds: new game.SoundManager(),
        player: new game.Player([gCanvas.width/2, gCanvas.height/2]),
        enemies: Array(),
        //projectiles: Array(),
        explosions: Array(),
        words: Array(),
        currentwords: Array(),
        currentquestion: '',
        characterpositions: Array([40, 40], //tl
                                  [40, 410], //bl
                                  [410, 80], //tr
                                  [410, 400]), //br
        loopCount: 0,
        score: 0,
        bestscore: 0,

        textcolor: 'White',
        textsize: '18pt Arial',

        then: Date.now(),
        now: 0,
        dt: 0
    };
    gWorld.state.setState(gWorld.state.states.LOADING);
    gWorld.words['character'] = Array();
    gWorld.words['pinyin'] = Array();
    gWorld.words['english'] = Array();

    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('keyup', onKeyUp, false);
    gCanvas.addEventListener('click', onMouseClick);

    loadWords();
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
	var squiglytoneoffset = 1;
	if (getParameterByName("tone") == 1) {
		squiglytoneoffset = 0;
	}

	var files = ["./lang/HSK Official With Definitions 2012 L1.txt",
				 "./lang/HSK Official With Definitions 2012 L2.txt",
				 "./lang/HSK Official With Definitions 2012 L3.txt",
				 "./lang/HSK Official With Definitions 2012 L4.txt",
				 "./lang/HSK Official With Definitions 2012 L5.txt",
				 "./lang/HSK Official With Definitions 2012 L6.txt"];
	var filestouse = Array();
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
			    
			    var word = 0;
			    if (gWorld.words['character'].length > 0) {
			    	word = gWorld.words['character'].length;
				}
			    for (var i = 0; i < words.length; i += 5) {
			    	if (words[i]) {
					    gWorld.words['character'][word] = words[i + traditionaloffset];
					    gWorld.words['pinyin'][word] = words[i + 2 + squiglytoneoffset];
					    gWorld.words['english'][word] = words[i + 4];
					    //console.log(gWorld.words['character'][word]);
					    word++;
			        }
			    }
			}
		}
	}
}

function newGame() {
    gWorld.score = 0;
    gWorld.state.setState(gWorld.state.states.INGAME);
    nextCharacter();
}
function nextCharacter() {

    var wordindex = 0;
    var correctslot = getRandomInt(0, 3);
    for (var i = 0; i < 4; i++) {
        wordindex = -1;
        while (wordindex == -1) {
            wordindex = getRandomInt(0, gWorld.words['english'].length - 1);
            if (gWorld.words['character'][wordindex] == "") {
                // bad data that slipped through.
                wordindex = -1;
                continue;
            }
            // check we don't display the same character twice at once.
            for (var j = 0; j < 4; j++) {
                if (i == j) {
                    continue;
                }
                if (gWorld.currentwords[j]
                    && gWorld.currentwords[j].character == gWorld.words['character'][wordindex]) {

                    wordindex = -1;
                    continue;
                }
            }
        }
        gWorld.currentwords[i] = new game.Character(gWorld.characterpositions[i],
                                                    i,
                                                    i == correctslot,
                                                    gWorld.words['character'][wordindex],
                                                    gWorld.words['pinyin'][wordindex]);
        if (i == correctslot) {
            gWorld.currentquestion = gWorld.words['english'][wordindex];
            if (gQuestion) {
                gQuestion.innerHTML = gWorld.words['english'][wordindex];
            }
            if (gPinyin) {
                gPinyin.innerHTML = gWorld.words['pinyin'][wordindex];
            }
        }
        gSlots[i].innerHTML = gWorld.words['character'][wordindex];
    }

    // the divs in gSlots will change size based on the number of charaters to be displayed.
    // Adjust the object's pos and size so that collission detection works.
    for (var i in gWorld.currentwords) {
        char = gWorld.currentwords[i];
        
        var offsets = gSlots[i].getBoundingClientRect();
        var top = offsets.top;
        var left = offsets.left;
        char.pos = [offsets.left, offsets.top];
        char.size = [offsets.width, offsets.height];
    }

    gWorld.enemies = Array();
    //gWorld.projectiles = Array();
    //gWorld.explosions = Array();
    
    gWorld.player.pos = [gCanvas.width/2, gCanvas.height/2];
    
    spawnMonster();
}
function updateTable() {
    if (gWorld.currentquestion) {
        var tableRef = gTable.getElementsByTagName('tbody')[0];
        //var newRow = tableRef.insertRow(tableRef.rows.length);
        var newRow = tableRef.insertRow(0);
        if (!gLastCorrect) {
            newRow.className = "wrong";
        }
        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var cell3 = newRow.insertCell(2);

        var correctword = null;
        for (var  i in gWorld.currentwords) {
            if (gWorld.currentwords[i].iscorrect) {
                correctword = gWorld.currentwords[i];
                break;
            }
        }

        var text = document.createTextNode(gWorld.currentquestion);
        cell1.appendChild(text);

        var text = document.createTextNode(correctword.pinyin);
        cell2.appendChild(text);

        var text = document.createTextNode(correctword.character);
        cell3.appendChild(text);
    }
}
function spawnMonster() {
    var n = Math.floor(gWorld.score / 10) + 1;

    var door, pos, m;
    for (var i = 0;i < n;i++) {
        door = Math.floor(Math.random() * 4) + 1;

        if (door == 1) {
            pos = [-40, gCanvas.height/2];
        } else if (door == 2) {
            pos = [gCanvas.width/2, -40];
        } else if (door == 3) {
            pos = [gCanvas.width +10, gCanvas.height/2];
        } else if (door == 4) {
            pos = [gCanvas.width/2, gCanvas.height+10];
        }
        m = new game.Monster(pos);
        gWorld.enemies.push(m);
    }
}

function updateGame(dt) {
    if (gWorld.player) {
        gWorld.player.update(dt);
    }
    for (var i in gWorld.enemies) {
        gWorld.enemies[i].update(dt);
    }
    /*for (var i = gWorld.projectiles.length - 1;i >= 0;i--) {
        if (gWorld.projectiles[i].update(dt) == false) {
            gWorld.projectiles.splice(i, 1);
        }
    }*/
    for (var i = gWorld.explosions.length - 1;i >= 0;i--) {
        if (gWorld.explosions[i].update(dt) == false) {
            gWorld.explosions.splice(i, 1);
        }
    }
}
function explodestuff() {
    //explode monsters
    for (var j in gWorld.enemies) {
        gWorld.explosions.push(new game.Explosion(gWorld.enemies[j].pos));
    }

    //explode the characters
    for (var j in gWorld.currentwords) {
        gWorld.explosions.push(new game.Explosion(gWorld.currentwords[j].pos));
    }
}
function checkCollisions() {
    var enemy;
    for (var j = gWorld.enemies.length - 1; j >= 0;j--) {
        enemy = gWorld.enemies[j];
        
        if (enemy.collideThing(gWorld.player)) {
            explodestuff();
            gWorld.state.setState(gWorld.state.states.END);
            clearDivs();
            gWorld.sounds.play("fail");
            gLastCorrect = false;
            updateTable();
            return;
        }
    }

    var char;
    for (var i in gWorld.currentwords) {
        char = gWorld.currentwords[i];
        
        if (char.collideThing(gWorld.player)) {
            explodestuff();

            if (char.iscorrect) {
                gWorld.score++;
                gLastCorrect = true;
                updateTable();
                nextCharacter();
                gWorld.sounds.play("success");
            } else {
                gWorld.state.setState(gWorld.state.states.END);
                clearDivs();
                gLastCorrect = false;
                updateTable();
                gWorld.sounds.play("fail");
            }
        }
    }
}

function drawInstructions(showImages) {
    drawText(gContext, "Chinese Character Challenge", gWorld.textsize, gWorld.textcolor, gCanvas.width/5, 100);
    drawText(gContext, "Collect the correct character", gWorld.textsize, gWorld.textcolor, gCanvas.width/5, 200);
    drawText(gContext, "Avoid the goblins", gWorld.textsize, gWorld.textcolor, gCanvas.width/5, 240);
    drawText(gContext, "Press wasd to move", gWorld.textsize, gWorld.textcolor, gCanvas.width/5, 300);
    //drawText(gContext, "Use the mouse to aim and fire", gWorld.textsize, gWorld.textcolor, gCanvas.width/5, 350);
    if (showImages) {
        //gContext.drawImage(gImages.getImage('exit'), 40, gCanvas.height/2, gSettings.tilesize, gSettings.tilesize);
        //gContext.drawImage(gImages.getImage('starship'), gCanvas.width - 80, gCanvas.height/2, 30, 30);
    }
    drawText(gContext, "Press e to begin", gWorld.textsize, "white", gCanvas.width/3, 400);
}
function drawGame() {
    var img = gWorld.images.getImage('background');
    if (img) {
        gContext.drawImage(img, 0, 0);
    }
    
    var state = gWorld.state.getState();
    if (state == gWorld.state.states.LOADING) {
        drawInstructions(false);
        var total = gWorld.sounds.sounds.length + gWorld.images.images.length;
        var loaded = gWorld.sounds.numSoundsLoaded + gWorld.images.numImagesLoaded;
        if (loaded < total) {
            gContext.clearRect(0, 0, gCanvas.width, gCanvas.height);
            var text = "Loading...    "+loaded+"/"+total;
            drawText(gContext, text, gWorld.textsize, gWorld.textcolor, gCanvas.width/5,400);
            //return;
        } else {
            gWorld.state.setState(gWorld.state.states.PREGAME);
        }
    } else if (state == gWorld.state.states.PREGAME) {
        drawInstructions(true);
    } else if (state == gWorld.state.states.INGAME) {
        gWorld.player.draw();
        /*for (var i in gWorld.projectiles) {
            gWorld.projectiles[i].draw();
        }*/
        for (var i in gWorld.enemies) {
            gWorld.enemies[i].draw();
        }
        for (var i in gWorld.explosions) {
            gWorld.explosions[i].draw();
        }
        drawText(gContext, gWorld.score, gWorld.textsize, gWorld.textcolor, 10, 20);

    } else if (state == gWorld.state.states.END) {
        drawText(gContext, "Chinese Character Challenge", gWorld.textsize, gWorld.textcolor, gCanvas.width/5, 100);
        drawText(gContext, "You got "+gWorld.score+" in a row.", gWorld.textsize, gWorld.textcolor, 150, 200);
        if (gWorld.score > gWorld.bestscore) {
            gWorld.bestscore = gWorld.score;
        }
        drawText(gContext, "Your best score is "+gWorld.bestscore, gWorld.textsize, gWorld.textcolor, 150, 240);
        drawText(gContext, "Press e to play again", gWorld.textsize, gWorld.textcolor, 150, 350);
        for (var i in gWorld.explosions) {
            gWorld.explosions[i].draw();
        }
    }
}

//executed 60/second
var mainloop = function() {
    if (gWorld == null) {
        return;
    }
    state = gWorld.state.getState();
    //if (state == gWorld.state.states.INGAME) {
        gWorld.now = Date.now();
        if (gWorld.then != 0) {
            gWorld.dt = (gWorld.now - gWorld.then)/1000;
            
            gWorld.loopCount++;
            gWorld.loopCount %= 8; //stop it going to infinity

            updateGame(gWorld.dt);
            if (state == gWorld.state.states.INGAME) {
                checkCollisions();
            }
            drawGame();
        }
        gWorld.then = gWorld.now;
    //}
};

var ONE_FRAME_TIME = 1000 / 60; // 60 per second
setInterval( mainloop, ONE_FRAME_TIME );

}());
