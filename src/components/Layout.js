// 앱의 뼈대: 상단 바 + 사이드바 메뉴 + 본문 영역.
// 모바일에서는 사이드바가 숨겨지고 햄버거 버튼으로 연다.
(function (TM) {
  'use strict';

  TM.components = TM.components || {};

  TM.components.createLayout = function (root) {
    var C = TM.constants;
    var esc = TM.dom.escapeHtml;

    root.innerHTML =
      '<header class="topbar">' +
        '<button class="icon-button menu-toggle" type="button" aria-label="메뉴 열기" aria-expanded="false" aria-controls="sidebar">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
        '<a class="brand" href="#/dashboard">' + esc(C.APP_NAME) + '</a>' +
      '</header>' +
      '<div class="shell">' +
        '<nav class="sidebar" id="sidebar" aria-label="주 메뉴"><ul>' +
          C.MENU.map(function (item) {
            return '<li><a href="#' + item.path + '" data-path="' + item.path + '">' +
              '<span class="nav-icon" aria-hidden="true">' + item.icon + '</span>' + esc(item.label) + '</a></li>';
          }).join('') +
        '</ul></nav>' +
        '<div class="backdrop" hidden></div>' +
        '<main class="content" id="main" tabindex="-1"></main>' +
      '</div>';

    var toggle = root.querySelector('.menu-toggle');
    var sidebar = root.querySelector('.sidebar');
    var backdrop = root.querySelector('.backdrop');
    var outlet = root.querySelector('#main');

    function setMenuOpen(open) {
      sidebar.classList.toggle('open', open);
      backdrop.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    }

    toggle.addEventListener('click', function () { setMenuOpen(!sidebar.classList.contains('open')); });
    backdrop.addEventListener('click', function () { setMenuOpen(false); });
    sidebar.addEventListener('click', function (e) { if (e.target.closest('a')) setMenuOpen(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenuOpen(false); });

    return {
      outlet: outlet,
      setActive: function (path) {
        sidebar.querySelectorAll('a[data-path]').forEach(function (a) {
          var active = a.dataset.path === path;
          a.classList.toggle('active', active);
          if (active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
        });
      }
    };
  };
})(window.TM = window.TM || {});
