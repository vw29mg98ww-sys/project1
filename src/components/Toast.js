// 화면 아래쪽에 잠깐 나타나는 알림. 오류 알림은 사용자가 닫을 때까지 남는다.
(function (TM) {
  'use strict';

  TM.components = TM.components || {};

  function container() {
    var el = document.getElementById('toasts');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toasts';
      el.className = 'toasts';
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    return el;
  }

  // tone: 'info' | 'success' | 'error'
  TM.components.toast = function (message, tone) {
    tone = tone || 'info';
    // 같은 알림이 이미 떠 있으면 또 띄우지 않는다 (한 번의 동작에서 여러 번 저장에 실패하는 경우 등)
    var shown = container().querySelectorAll('.toast');
    for (var i = 0; i < shown.length; i++) {
      if (shown[i].dataset.message === message) return shown[i];
    }
    var el = document.createElement('div');
    el.dataset.message = message;
    el.className = 'toast toast-' + tone;
    el.setAttribute('role', tone === 'error' ? 'alert' : 'status');
    el.innerHTML = '<span>' + TM.dom.escapeHtml(message) + '</span><button type="button" class="toast-close" aria-label="알림 닫기">×</button>';
    el.querySelector('.toast-close').addEventListener('click', function () { el.remove(); });
    container().appendChild(el);
    if (tone !== 'error') setTimeout(function () { el.remove(); }, 4000);
    return el;
  };
})(window.TM = window.TM || {});
