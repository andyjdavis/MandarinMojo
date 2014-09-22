window.game = window.game || { };

game.Word = function(character, pinyin, english, correct) {
    this.character = character;
    this.pinyin = pinyin;
    this.english = english;
    this.correct = correct;
}

game.Problem = function(words) {
    this.words = words;//words.slice(0);
}
