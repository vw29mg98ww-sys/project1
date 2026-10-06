// 한국어 조사 처리: 앞 단어의 받침 유무에 따라 '와/과', '이/가' 등을 고른다.
(function (TM) {
  'use strict';

  function hasFinalConsonant(word) {
    var last = String(word).trim().slice(-1);
    var code = last.charCodeAt(0) - 0xac00;
    if (code < 0 || code > 11171) return null; // 한글이 아니면 판단 불가
    return code % 28 !== 0;
  }

  // particle('어휘', '와', '과') → '어휘와', particle('문법', '와', '과') → '문법과'
  function particle(word, withoutFinal, withFinal) {
    var has = hasFinalConsonant(word);
    if (has === null) return word + withoutFinal + '(' + withFinal + ')';
    return word + (has ? withFinal : withoutFinal);
  }

  TM.korean = { hasFinalConsonant: hasFinalConsonant, particle: particle };
})(window.TM = window.TM || {});
