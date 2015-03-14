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

window.onload = function() {
    gLeft = $("left_col");
    gRight = $("left_col");
    gTable = $("thetable");

    gCanvas = dc("canvas");
    gCanvas.width = 800;
    gCanvas.height = 600;
    gLeft.appendChild(gCanvas);

    gContext = gCanvas.getContext("2d");

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

	gDivs = [gQuestion, gPinyin, gAudio];

    gWorld = {
        debug: false,

        keyState: Array(),
        state: new game.StateManager(), // Defaults to state LOADING.
        images: null,
        sounds: null,

        playerinfo: new game.PlayerInfoManager(),

        tileDisplayWidth: 32,
        mapWidth: 800,
        mapHeight: 600,
        arenaWidth: 512,
        arenaHeight: 480,

        problems: Array(), // Randomly ordered array of problem instances grouped by level.
        mapplayer: null, // save the player obj

        loopCount: 0,

        message: null,
        textcolor: 'White',
        textsize: '18pt Arial',

        then: Date.now(),
        now: 0,
        dt: 0,

        localTTS: false,
        hp: new HanyuPinyin(),
        tts: new ChineseTextToSpeech()
    };
    gWorld.images = new game.ImageManager();
    gWorld.sounds = new game.SoundManager();

    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('keyup', onKeyUp, false);
    gCanvas.addEventListener('click', onMouseClick);

    loadWords();

    mainloop();
    //var ONE_FRAME_TIME = 1000 / 60; // 60 per second
    //setInterval( mainloop, ONE_FRAME_TIME );
}

function onKeyDown(event) {
    //console.log(event.keyCode);
    var stateengine = gWorld.state.getStateEngine();
    if (typeof stateengine.onKeyDown === 'function') {
        stateengine.onKeyDown(event);
    }

    // The following should really be done in the relevant state engines.
    if (state == gWorld.state.states.ARENA || state == gWorld.state.states.PAUSED) {
        if (event.keyCode == 80) {
            // p
            pause();
        }
        if (event.keyCode == 77) {
            // m
            mute();
        }
        if (event.keyCode == 83) {
            // s
            gWorld.localTTS = !gWorld.localTTS;
            var s = 'Speaker A';
            if (gWorld.localTTS) {
                s = 'Speaker B';
            }
            gWorld.message = new game.Message(s);
        }
    }
    if (state == gWorld.state.states.MAP || state == gWorld.state.states.OVERLAY) {
        if (event.keyCode == 72) {
            // h
            overlay();
        }
    }
    gWorld.keyState[event.keyCode] = true;
}
function onKeyUp(event) {
    gWorld.keyState[event.keyCode] = false;
}
function onMouseClick(event) {
}
function pause() {
    var state = gWorld.state.getState();
    if (state == gWorld.state.states.ARENA) {
        gWorld.state.pushState(gWorld.state.states.PAUSED);
    } else if (state == gWorld.state.states.PAUSED) {
        gWorld.state.popState();
    }
    //ignore p if in any other state
}
function mute() {
    gWorld.sounds.togglemute();
    if (gWorld.sounds.enabled) {
        gWorld.message = new game.Message('unmuted');
    } else {
        gWorld.message = new game.Message('muted');
    }
}
function overlay() {
    var state = gWorld.state.getState();
    if (state == gWorld.state.states.MAP) {
        var stateEngine = gWorld.state.getStateEngine();
        var cameraPosition = stateEngine.cameraposition;
        var bottomRight = stateEngine._getBottomRight();

        stateEngine = gWorld.state.pushState(gWorld.state.states.OVERLAY);
        stateEngine.cameraPosition = cameraPosition;
        stateEngine.bottomRight = bottomRight;
        
    } else if (state == gWorld.state.states.OVERLAY) {
        gWorld.state.popState();
    }
    //ignore h if in any other state
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
		wordobjects[i] = Array();
		//if (getParameterByName(name)) {
			var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
			xmlhttp.onreadystatechange = function() {
				
			}
			xmlhttp.open("GET", files[i], false);
			xmlhttp.send();
			if(xmlhttp.status==200 && xmlhttp.readyState==4) {
				//replace new lines with tabs then split on tabs.
			    var words = xmlhttp.responseText.replace(/(\r\n|\n|\r)/gm,"\t").split(/\t/g);

			    for (var j = 0; j < words.length; j += 5) {
			    	if (words[j] && words[j + traditionaloffset] != "") {

					    wordobjects[i].push(new game.Word(words[j + traditionaloffset],
                                                        words[j + 2 + squiglytoneoffset],
                                                        squiglytoneoffset == 1 ? words[j + 2] : null,
					                                    words[j + 4],
					                                    true));
			        }
			    }
			}
		//}
	}

    var correctwordcharcount = 0;
    var wrongword = null;
    var wordarray = null;
    var totalwordcount = wordobjects[i].length;
    var attempts = 0;
    for (var i in files) {
        totalwordcount = wordobjects[i].length;
        gWorld.problems[i] = Array();

        if (gWorld.debug) {
            var lengthnotmatch = 0;
        }
	    for (var j in wordobjects[i]) {
	        correctwordcharcount = wordobjects[i][j].character.length;
	        wordarray = Array();
	        wordarray.push(wordobjects[i][j]);
	        attempts = 0;

	        while (wordarray.length < 4) {
	            wrongword = wordobjects[i][getRandomInt(0, totalwordcount - 1)];
	            if (wrongword.character != wordobjects[i][j].character
	                && (attempts > 40 || wrongword.character.length == correctwordcharcount)) {

                    if (gWorld.debug && attempts > 40) {
                        lengthnotmatch++;
                        //console.log("gave up trying to character count match "+wordobjects[i][j].character);
                    }
                    wrongword = new game.Word(wrongword.character, wrongword.pinyin, wrongword.getToRead(), wrongword.english, false);
                    wordarray.push(wrongword);
                    attempts = 0;
	            } else {
	                attempts++;
	            }
	        }
	        gWorld.problems[i].push(new game.Problem(shuffleArray(wordarray)));
	    }
	    if (gWorld.debug) {
	        //gWorld.problems[i].splice(0, gWorld.problems[i].length - 3);
	    }
	    gWorld.problems[i] = shuffleArray(gWorld.problems[i]);

	    if (gWorld.debug) {
	        console.log("loaded file "+i);
	        console.log("contains how many phrases? " + gWorld.problems[i].length);
	        console.log(lengthnotmatch+" incorrect answers could not be length matched");
	    }
    }
}

function updateGame(dt) {
    var stateengine = gWorld.state.getStateEngine();
    if (stateengine) {
        stateengine.update(dt);
    }
    if (gWorld.message) {
        if (gWorld.message.update(dt) == false) {
            gWorld.message = null;
        }
    }
}
    
function drawGame() {
    gContext.clearRect(0, 0, gCanvas.width, gCanvas.height);
    gWorld.state.getStateEngine().draw();
    if (gWorld.debug) {
        var frames = Math.floor(1/gWorld.dt);
        drawText(gContext,
                 frames,
                 gWorld.textsize,
                 gWorld.textcolor,
                 150,
                 0);
    }
}

var mainloop = function() {

    if (gWorld != null) {
        gWorld.now = Date.now();

        state = gWorld.state.getState();
        if (state != gWorld.state.states.PAUSED && gWorld.then != 0) {
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
