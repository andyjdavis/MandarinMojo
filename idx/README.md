idx
===

Index files with pre-sorted data in key-value pairs (KVPs).

+ Drives pffy conversion objects with the [wisdom of the crowd](http://en.wikipedia.org/wiki/Wisdom_of_the_crowd).

## FORMATS

+ `txt` - colon-delimited, similar to Java properties files
+ `json` - Unicode-escaped [JavaScript Object Notation](http://www.json.org/)


## IDX LIST

+ `IdxHanyuPinyin`
  + KVPs of Chinese characters and Hanyu Pinyin pronunciation
  + ordered by key length, descending

+ `IdxPinyinPhonemes`
  + KVPs of Hanyu Pinyin phoneme keys, where all values equal 1
  
+ `IdxSimplified`
  + KVPs of Traditional Chinese and Simplified Chinese characters

+ `IdxSimplifiedMicro`
  + Subset of `IdxSimplified` where keys never equal values.
  + 78% smaller than `IdxSimplified`, but accurate character detection is limited.

+ `IdxTraditional`
  + KVPs of Simplified Chinese and Traditional Chinese characters
  + ordered by key length, descending

+ `IdxToneMarks`
  + KVPs of pinyin tone numbers and tone marks
  + ordered by key length, descending
  
+ `IdxToneNumbers`
  + KVPs of pinyin tone marks and tone numbers
  + ordered by key length, descending

+ `IdxToneRemoval`
  + KVPs of tone marks/numbers and toneless phonemes
  + ordered by key length, descending

+ `IdxExtraPinyin`
  + KVPs of Symbols (e.g., Punctuation) and placeholder "extra" Hanyu Pinyin
  + unordered

+ `IdxJyutping`
  + KVPs of Cantonese characters and Jyutping pronunciation

+ `IdxKoreanRomanization`
  + KVPs of Korean Hangul and Revised Romanization pronunciation  

+ `IdxPinyinYale`
  + KVPs of Hanyu Pinyin and Yale Romanization  

+ `IdxYalePinyin`
  + KVPs of Yale Romanization and Hanyu Pinyin

+ `IdxPinyinBopomofo`
  + KVPs of Hanyu Pinyin and Bopomofo 
  + ordered by key length, descending

+ `IdxBopomofoPinyin`
  + KVPs of Bopomofo and Hanyu Pinyin
  + ordered by key length, descending

+ `IdxPinyinWadeGiles`
  + KVPs of Hanyu Pinyin and Wade-Giles  

+ `IdxWadeGilesPinyin`
  + KVPs of Wade-Giles and Hanyu Pinyin  



