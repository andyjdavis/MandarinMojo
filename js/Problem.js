window.game = window.game || { };

game.Word = function(character, pinyin, pinyintoread, english, correct) {
    this.character = character;
    this.pinyin = pinyin;
    this.pinyintoread = pinyintoread;
    this.english = english;
    this.correct = correct;
}
game.Word.prototype.getToRead = function(changeTones) {
    var s = null;
    if (this.pinyintoread) {
        s = this.pinyintoread;
    } else {
        s = this.pinyin;
    }
    if (!changeTones) {
        return s;
    }
    //http://en.wikipedia.org/wiki/Standard_Chinese_phonology#Tones
    // http://en.wikipedia.org/wiki/Tone_sandhi#Mandarin_Chinese
    if (gWorld.debug) {
        console.log('original string to read=='+s);
    }

    s = s.replace(/(\d+)/g, "$1 "); // Put spaces between the syllables.
    s = s.toLowerCase();

    var arr = s.split(" ");
    for (var i = 0; i < arr.length - 1;i++) {
        if (i <= arr.length - 2) {
            // still got at least 2 characters to go.
            if (arr[i].slice(-1) == "3" && arr[i+1].slice(-1) == "3") {
                // Two 3rd tones. Change the 1st 3rd tones to a 2nd tone.
                if (gWorld.debug) {
                    console.log('found consecutive 3rd tones');
                }
                arr[i] = (arr[i].slice(0,-1) + '2');
            } else if (arr[i].slice(-1) == "4" && arr[i+1].slice(-1) == "4" && this.character.indexOf("不") > -1) {
                // 不 is 4th except when followed by another 4th when it changes to 2nd.
                // Making an educated guess.
                /* This is apparently already done in the lang files.
                if (gWorld.debug) {
                    console.log('found consecutive 4th tones');
                }
                arr[i] = (arr[i].slice(0,-1) + '2');*/
            }
            // Rules for 一 yī are in the lang files.
        }
    }
    s = arr.join(" ");

    // replace some sounds that don't have audio files
    // this makes ba4ba5 not work.
    s = s.replace("5", "4");

    return s;
}

game.Problem = function(words) {
    this.words = words;//words.slice(0);
}
game.Problem.prototype.clone = function() {
    return new game.Problem(this.words);
}
game.Problem.prototype.getCorrectWord = function() {
    for (var i in this.words) {
        if (this.words[i].correct) {
            return this.words[i];
        }
    }
    return null;
}
