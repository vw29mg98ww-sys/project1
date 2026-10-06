// 스크립트 목록을 한 곳에서 관리한다. 앱(index.html)과 테스트(tests/index.html)가 같은 목록을 쓴다.
// 설치 없이 파일을 더블클릭해서 열 수 있도록 일반 <script>를 순서대로 삽입한다.
// 순서가 중요하다: 데이터 → 상수 → 유틸 → 저장소 → 서비스 → 컴포넌트 → 화면 → 경로표
// 새 파일을 만들면 여기에 한 줄 추가한다.
(function () {
  var base = document.currentScript.getAttribute('data-base') || '';
  var files = [
    'src/data/questions.js',
    'src/data/vocabulary.js',
    'src/constants.js',
    'src/utils/dom.js',
    'src/utils/date.js',
    'src/utils/korean.js',
    'src/utils/router.js',
    'src/utils/validateData.js',
    'src/storage/keys.js',
    'src/storage/storage.js',
    'src/storage/migrations.js',
    'src/storage/persistence.js',
    'src/services/dataService.js',
    'src/services/progressService.js',
    'src/services/scoreService.js',
    'src/services/statsService.js',
    'src/services/insightService.js',
    'src/services/dayService.js',
    'src/services/difficultyService.js',
    'src/services/practiceService.js',
    'src/services/studyService.js',
    'src/services/backupService.js',
    'src/services/vocabService.js',
    'src/services/wrongNoteService.js',
    'src/services/analyticsService.js',
    'src/services/analysisService.js',
    'src/components/Layout.js',
    'src/components/Placeholder.js',
    'src/components/StatCard.js',
    'src/components/Meter.js',
    'src/components/Toast.js',
    'src/components/QuestionView.js',
    'src/components/Charts.js',
    'src/pages/DashboardPage.js',
    'src/pages/DayPage.js',
    'src/pages/StudyPage.js',
    'src/pages/VocabStudyPage.js',
    'src/pages/QuestionPage.js',
    'src/pages/PartPage.js',
    'src/pages/VocabularyPage.js',
    'src/pages/WrongNotesPage.js',
    'src/pages/AnalyticsPage.js',
    'src/pages/SettingsPage.js',
    'src/pages/NotFoundPage.js',
    'src/pages/index.js'
  ];
  files.forEach(function (file) {
    document.write('<script src="' + base + file + '"><\/script>');
  });
})();
