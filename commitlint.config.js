export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 새로운 기능
        'fix', // 버그 수정
        'docs', // 문서 변경
        'style', // 코드 포맷팅, 세미콜론 누락 등
        'refactor', // 코드 리팩토링
        'perf', // 성능 개선
        'test', // 테스트 추가/수정
        'chore', // 빌드, 설정 파일 변경
        'revert', // 이전 커밋 되돌리기
        'ci', // CI 설정 변경
        'build', // 빌드 시스템 변경
      ],
    ],
    'subject-max-length': [2, 'always', 72],
  },
};
