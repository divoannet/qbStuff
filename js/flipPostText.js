/**
 * Переворачивалка постов
 *
 * type: joke
 * status: DON'T WANT TO KNOW
 */

"use strict";

function flipString(aString) {
    var last = aString.length - 1;
    var result = new Array(aString.length)
    for (var i = last; i >= 0; --i) {
        var c = aString.charAt(i)
        var r = flipTable[c]
        result[last - i] = r ? r : c
    }
    return result.join('')
}

function flipPostText() {
    for (i in flipTable) {
        flipTable[flipTable[i]] = i
    }
}

var flipTable = {
    a: '\u0250',
    b: 'q',
    c: '\u0254',
    d: 'p',
    e: '\u01DD',
    f: '\u025F',
    g: '\u0183',
    h: '\u0265',
    i: '\u0131',
    j: '\u027E',
    k: '\u029E',
    //l : '\u0283',
    m: '\u026F',
    n: 'u',
    r: '\u0279',
    t: '\u0287',
    v: '\u028C',
    w: '\u028D',
    y: '\u028E',
    '.': '\u02D9',
    '[': ']',
    '(': ')',
    '{': '}',
    '?': '\u00BF',
    '!': '\u00A1',
    "\'": ',',
    '<': '>',
    '_': '\u203E',
    '\u203F': '\u2040',
    '\u2045': '\u2046',
    '\u2234': '\u2235',
    '\r': '\n',
    а: 'ɐ',
    б: 'ƍ',
    в: 'ʚ',
    г: 'ɹ',
    д: 'ɓ',
    е: 'ǝ',
    ё: 'ǝ',
    ж: 'ж',
    з: 'ε',
    и: 'и',
    й: 'ņ',
    к: 'ʞ',
    л: 'v',
    м: 'w',
    н: 'н',
    о: 'о',
    п: 'u',
    р: 'd',
    с: 'ɔ',
    т: 'ɯ', // ʟ ɯ ￌ
    у: 'ʎ',
    ф: 'ф',
    х: 'х',
    ц: 'ǹ',
    ч: 'Һ',
    ш: 'm',
    щ: 'm',
    ъ: 'q',
    ы: 'ıq',
    ь: 'q',
    э: 'є',
    ю: 'oı',
    я: 'ʁ'
}