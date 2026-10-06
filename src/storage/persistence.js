// 영구 보관 요청.
// 브라우저는 저장 공간이 부족하면 오래 안 쓴 사이트의 데이터를 지울 수 있다.
// navigator.storage.persist()로 "이 기록은 지우지 말아 달라"고 요청한다. (지원하지 않는 브라우저도 있다)
(function (TM) {
  'use strict';

  function supported() {
    return !!(window.navigator && navigator.storage && navigator.storage.persist && navigator.storage.persisted);
  }

  // 결과: 'granted'(영구 보관) | 'denied'(브라우저가 거절) | 'unsupported'(지원 안 함)
  function status() {
    if (!supported()) return Promise.resolve('unsupported');
    return navigator.storage.persisted()
      .then(function (yes) { return yes ? 'granted' : 'denied'; })
      .catch(function () { return 'unsupported'; });
  }

  function request() {
    if (!supported()) return Promise.resolve('unsupported');
    return navigator.storage.persist()
      .then(function (yes) { return yes ? 'granted' : 'denied'; })
      .catch(function () { return 'unsupported'; });
  }

  TM.persistence = { status: status, request: request };
})(window.TM = window.TM || {});
