/**
 * hanyupinyin.js, JavaScript Hanyu Pinyin object
 *    - Pinyin Tone mark conversion
 *    - Hanzi to Pinyin conversion
 *    - Pinyin Tone removal
 *
 * @version 1.1
 * @license The Unlicense, http://unlicense.org/
 * @author  The Pffy Authors, https://github.com/pffy/
 * @updated 2014-06-05
 * @link    https://github.com/pffy/javascript-hanyupinyin
 *
 */

var HanyuPinyin = function () {

  var _hpjson = 'idx/json/IdxHanyuPinyin.json',
    _tmjson = 'idx/json/IdxToneMarks.json',
    _tnjson = 'idx/json/IdxToneNumbers.json',
    _toneMode = 1,
    _ready = false,
    _hpdx = {},
    _tmdx = {},
    _tndx = {},
    _output = '',
    _input = '';

  // starts up
  _ready = init();

  // converts to tone marks
  function convertToToneMarks () {
    convert(_tmdx);
  }

  // converts to tone numbers
  function convertToToneNumbers () {
    convert(_tndx);
    atomize();
  }

  // converts hanzi or pinyin to pinyin
  function convertToHanyuPinyin() {
    convert(_hpdx);
    atomize();
  }

  // zhong1wen2 -> zhong1 wen2
  // adds exactly one space between pinyin units
  function atomize() {

    // TODO regex may cost less and be more accurate. find out.
    // https://github.com/pffy/idioms#atomize

    for(var i = 1; i < 6; i++) {
      _output = replaceAll('' + i,'' + i + ' ', _output);
    }

    vacuum();
  }

  // vac   uum -> vac  uum --> vac uum
  // reduces many spaces to exactly one space
  function vacuum() {

    // TODO regex may cost less. find out.
    // https://github.com/pffy/idioms#vacuum

    _output = replaceAll('  ', ' ', _output);
  }

  // normalizes umlaut
  function normalizeUmlaut() {
    _output = replaceAll('ü', 'uu', _output);
    _output = replaceAll('u:', 'uu', _output);
  }

  // remove tone numbers
  function removeToneNumbers() {

    convertToToneNumbers();

    for(var i = 1; i < 6; i++) {
      _output = replaceAll(i + " ", " ", _output);
    }
  }

  // replaceAll(find, replace, str)
  // Found at http://stackoverflow.com/questions/1144783
  function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'gi'), replace);
  }

  // converts using idx key-value pairs
  function convert(idx) {
    for(var n in idx) {
      _output = replaceAll(n, idx[n], _output);
    }
  }

  // loads idx objects
  function init() {

    var loaded = false;
    var req = new XMLHttpRequest();

    // loads hpdx
    req.open('GET', _hpjson, false);
    req.overrideMimeType('text/javascript; charset=utf-8');

    req.onload = function(e) {

      try {
        _hpdx = JSON.parse(req.responseText);
      } catch (err) {
       console.log(e);
      }

    };

    req.send();

    if ( !_hpdx.length) {
      return false;
    }

    // loads tmdx
    req.open('GET', _tmjson, false);

    req.onload = function(e) {

      try {
        _tmdx = JSON.parse(req.responseText);
      } catch (err) {
        console.log(e);
      }

    };

    req.send();

    if ( !_tmdx.length) {
      return false;
    }

    // loads tndx
    req.open('GET', _tnjson, false);

    req.onload = function(e) {

      try {
        _tndx = JSON.parse(req.responseText);
      } catch (err) {
        console.log(e);
      }

    };

    req.send();

    if ( !_tndx.length) {
      return false;
    }

  return true;
  }

  return {

    /**
     * toString() Returns output text
     *
     * @return string output
     */
    toString: function() {
      return _output.toString();
    },

    /**
     * setInput() Sets input text
     * Returns this object
     *
     * @param string inputPinyin
     * @return HanyuPinyin object
     */
    setInput: function (inputString) {

      _input = _output = inputString;

      // normalize umlaut
      normalizeUmlaut();

      // convert hanzi to pinyin
      convertToHanyuPinyin();

      // formats by pinyin display mode
      switch(_toneMode)
      {
        case 2:
          convertToToneMarks();
        break;
        case 3:
          removeToneNumbers();
        break;
        default:
          convertToToneNumbers();
        break;
      }

      return this;
    },

    /**
     * getInput() Returns input text
     *
     * @return string input
     */
    getInput: function () {
      return _input;
    },

    /**
     * getMode() Returns tone display mode
     *
     * @return integer toneMode
     */
    getMode: function() {
      return _toneMode;
    },

    /**
     * setMode() Sets tone display mode
     *  2: tone marks
     *  3: no tones
     *  otherwise: tone numbers
     *
     * Returns this object
     *
     * @param integer toneInteger
     * @return HanyuPinyin object
     */
    setMode: function(toneInteger) {
      _toneMode = toneInteger;
      return this.setInput(this.getInput());
    },

    /**
     * isReady() Returns status of pinyin idx loading
     *
     * @return boolean object
     */
    isReady: function() {
      return _ready;
    }

  };

};


// wait, was it one newline ... or two?
// https://github.com/airbnb/javascript/pull/170
