window.game = window.game || { };

game.Word = function(character, pinyin, pinyintoread, english, correct) {
    this.character = character;
    this.pinyin = pinyin;
    this.pinyintoread = pinyintoread;
    this.english = english;
    this.correct = correct;
}

game.Word.prototype.getToRead = function() {
    if (this.pinyintoread) {
        return this.pinyintoread;
    }
    return this.pinyin;
}

game.Problem = function(words) {
    this.words = words;//words.slice(0);
}

game.Problem.prototype.getCorrectWord = function() {
    for (var i in this.words) {
        if (this.words[i].correct) {
            return this.words[i];
        }
    }
    return null;
}
