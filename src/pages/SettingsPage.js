// 설정: 학습 기록 백업·복원, 저장 공간·영구 보관 상태, 기록 초기화
// (하루 학습량 조정 등 학습 환경 설정은 STEP 10에서 추가한다)
(function (TM) {
  'use strict';

  TM.pages = TM.pages || {};
  var esc = function (s) { return TM.dom.escapeHtml(s); };

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  }

  function formatDateTime(iso) {
    var d = new Date(iso);
    return TM.date.toDateKey(d) + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }

  function backupStatusText(storage) {
    var last = TM.backupService.lastBackupAt(storage);
    if (!last) return '아직 백업한 적이 없습니다.';
    var days = TM.backupService.daysSinceBackup(storage);
    return '마지막 백업: ' + formatDateTime(last) + ' (' + (days === 0 ? '오늘' : days + '일 전') + ')';
  }

  function renderPreview(summary) {
    return '<div class="restore-preview">' +
      '<div class="restore-title">이 백업 파일의 내용</div>' +
      '<ul class="restore-facts">' +
        '<li>백업한 날: <b>' + (summary.exportedAt ? esc(formatDateTime(summary.exportedAt)) : '알 수 없음') + '</b></li>' +
        '<li>풀이 기록 <b>' + summary.attempts + '</b>개 · 단어 기록 <b>' + summary.words + '</b>개 · 학습한 날 <b>' + summary.studyDays + '</b>일 · 현재 DAY <b>' + summary.currentDay + '</b></li>' +
      '</ul>' +
      '<p class="warn-text">⚠ 복원하면 지금 이 브라우저의 학습 기록이 모두 이 백업 내용으로 바뀝니다.</p>' +
      '<div class="row-actions"><button type="button" class="btn btn-primary" data-action="restore-confirm">이 백업으로 복원</button>' +
      '<button type="button" class="btn" data-action="restore-cancel">취소</button></div>' +
    '</div>';
  }

  TM.pages.settings = {
    title: '설정',
    render: function (ctx) {
      var storage = ctx.storage;
      var usage = storage.usage();
      var attempts = ctx.progress.getAttempts().length;
      var words = Object.keys(ctx.progress.getVocabState()).length;
      var studyDays = ctx.progress.getProfile().studyDates.length;
      var pct = usage.ratio * 100;

      return '<section class="page settings">' +
        '<header class="page-header"><h1>설정</h1><p class="muted">학습 기록을 안전하게 보관하고 관리합니다.</p></header>' +

        '<div class="card settings-card">' +
          '<h2>학습 기록 백업</h2>' +
          '<p class="muted">학습 기록은 이 컴퓨터의 <b>이 브라우저 안</b>에만 저장됩니다. 다른 컴퓨터·브라우저로 옮기거나, 브라우저 데이터를 지웠을 때 복원할 수 있도록 가끔 백업 파일을 내려받아 두세요.</p>' +
          '<p class="settings-status" data-backup-status>' + esc(backupStatusText(storage)) + '</p>' +
          '<button type="button" class="btn btn-primary" data-action="backup">백업 파일 내려받기</button>' +
        '</div>' +

        '<div class="card settings-card">' +
          '<h2>백업 불러오기</h2>' +
          '<p class="muted">내려받아 둔 백업 파일(toeic900-backup-날짜.json)을 선택하면, 내용을 확인한 뒤 복원할 수 있습니다.</p>' +
          '<label class="btn file-btn">백업 파일 선택<input type="file" accept=".json,application/json" data-restore-input hidden></label>' +
          '<div data-restore-area></div>' +
        '</div>' +

        '<div class="card settings-card">' +
          '<h2>저장 공간</h2>' +
          '<div class="usage-line"><span>사용량 <b>' + formatBytes(usage.bytes) + '</b> / 약 ' + formatBytes(usage.quotaBytes) + '</span><span class="muted">' + (usage.bytes === 0 ? '0%' : pct < 0.1 ? '0.1% 미만' : pct.toFixed(1) + '%') + '</span></div>' +
          TM.components.renderMeter({ value: Math.max(pct, usage.bytes ? 1 : 0), label: '저장 공간 사용량' }) +
          '<p class="muted small">풀이 기록 ' + attempts + '개 · 단어 기록 ' + words + '개 · 학습한 날 ' + studyDays + '일</p>' +
          (pct >= 70 ? '<p class="warn-text">⚠ 저장 공간이 ' + Math.round(pct) + '% 찼습니다. 백업 파일을 내려받아 두세요.</p>' : '') +
          '<div class="persist-line"><span>영구 보관</span><span data-persist-status class="muted">확인 중…</span></div>' +
          '<p class="muted small">영구 보관이 켜져 있으면 컴퓨터 저장 공간이 부족해도 브라우저가 학습 기록을 자동으로 지우지 않습니다.</p>' +
        '</div>' +

        '<div class="card settings-card danger-zone">' +
          '<h2>학습 기록 초기화</h2>' +
          '<p class="muted">모든 풀이 기록, 오답 원인, 단어 학습 상태, 연속 학습일이 삭제됩니다. 되돌릴 수 없으니 먼저 백업하세요.</p>' +
          '<button type="button" class="btn btn-danger" data-action="reset">모든 학습 기록 지우기</button>' +
        '</div>' +

        '<p class="muted small">하루 학습량 조정 등 학습 환경 설정은 STEP 10에서 추가됩니다.</p>' +
      '</section>';
    },

    mount: function (root, ctx) {
      var storage = ctx.storage;
      var pendingBackup = null;
      var restoreArea = root.querySelector('[data-restore-area]');
      var fileInput = root.querySelector('[data-restore-input]');
      var alive = true;

      function showPersist(state) {
        var el = root.querySelector('[data-persist-status]');
        if (!el || !alive) return;
        if (state === 'granted') el.innerHTML = '<span class="ok-text">✓ 켜짐</span>';
        else if (state === 'denied') el.innerHTML = '<span>꺼짐</span> <button type="button" class="btn btn-sm" data-action="persist">영구 보관 요청</button>';
        else el.textContent = '이 브라우저에서는 지원하지 않음';
      }
      TM.persistence.status().then(showPersist);

      function download() {
        var backup = TM.backupService.createBackup(storage);
        var blob = new Blob([TM.backupService.toText(backup)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = TM.backupService.fileName(new Date());
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        root.querySelector('[data-backup-status]').textContent = backupStatusText(storage);
        TM.components.toast('백업 파일을 내려받았습니다. 안전한 곳(클라우드 드라이브 등)에 보관하세요.', 'success');
      }

      function onFile() {
        var file = fileInput.files && fileInput.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
          try {
            pendingBackup = TM.backupService.parse(String(reader.result));
            restoreArea.innerHTML = renderPreview(TM.backupService.summarize(pendingBackup));
          } catch (e) {
            pendingBackup = null;
            restoreArea.innerHTML = '<p class="warn-text">⚠ ' + esc(e.message) + '</p>';
          }
        };
        reader.onerror = function () { restoreArea.innerHTML = '<p class="warn-text">⚠ 파일을 읽지 못했습니다.</p>'; };
        reader.readAsText(file);
        fileInput.value = ''; // 같은 파일을 다시 골라도 동작하도록
      }

      function restore() {
        if (!pendingBackup) return;
        try {
          TM.backupService.restore(storage, pendingBackup);
        } catch (e) {
          restoreArea.innerHTML = '<p class="warn-text">⚠ ' + esc(e.message) + '</p>';
          return;
        }
        pendingBackup = null;
        TM.components.toast('학습 기록을 복원했습니다.', 'success');
        ctx.router.navigate('/dashboard');
      }

      function reset() {
        if (!window.confirm('모든 학습 기록을 지울까요?\n\n풀이 기록, 오답 원인, 단어 학습 상태, 연속 학습일이 모두 삭제되며 되돌릴 수 없습니다.')) return;
        storage.clearAll();
        TM.migrations.run(storage);
        TM.components.toast('학습 기록을 모두 지웠습니다.', 'info');
        ctx.router.refresh();
      }

      function onClick(e) {
        var btn = e.target.closest('[data-action]');
        if (!btn) return;
        var action = btn.dataset.action;
        if (action === 'backup') download();
        else if (action === 'restore-confirm') restore();
        else if (action === 'restore-cancel') { pendingBackup = null; restoreArea.innerHTML = ''; }
        else if (action === 'reset') reset();
        else if (action === 'persist') TM.persistence.request().then(function (state) {
          showPersist(state);
          if (state !== 'granted') TM.components.toast('브라우저가 영구 보관을 허용하지 않았습니다. 백업 파일을 주기적으로 내려받아 두세요.', 'info');
        });
      }

      root.addEventListener('click', onClick);
      fileInput.addEventListener('change', onFile);
      return function () {
        alive = false;
        root.removeEventListener('click', onClick);
        fileInput.removeEventListener('change', onFile);
      };
    }
  };
})(window.TM = window.TM || {});
