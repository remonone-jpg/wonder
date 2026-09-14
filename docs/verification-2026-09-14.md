# wonder 검증 기록 · 2026-09-14

## 코드 검증

| 검사 | 결과 |
| --- | --- |
| `npm run build` | 통과 · Vite 8.2.2 production build |
| `npm run lint` | 통과 · oxlint 오류 0 |
| `node --experimental-strip-types --test tests/*.test.mjs` | 통과 · 16/16 |
| `git diff --check` | 통과 |

빌드의 500 kB 초과 알림은 React와 three.js가 함께 들어 있는 기존 공통 청크에 대한
Vite 경고입니다. 태양계·은하·우주의 시작·별의 일생 뷰어는 각각 동적 청크로 나뉩니다.

## 브라우저 측정

측정 페이지는 `http://localhost:5173/wonder/tests/viewer-harness.html`이며, 실제
`performance.now()` 간격을 120프레임 동안 기록했습니다. FPS를 인위적으로 고정하거나
프레임 델타를 재사용하지 않았습니다. 화면 크기는 같은 Mac의 브라우저 창을 바꾼
것이므로 특정 태블릿의 보증값은 아닙니다.

| 장면 | 데스크톱 1280×720 | 좁은 화면 390×844 | 파티클 수 (좁은 화면) |
| --- | ---: | ---: | ---: |
| 우리 은하 | 60 fps | 60 fps | 24,000 |
| 안드로메다 | 60 fps | 60 fps | 24,000 |
| 대마젤란운 | 60 fps | 60 fps | 24,000 |
| M87 | 60 fps | 60 fps | 25,300 |
| 태양계 | 60 fps | 60 fps | 해당 없음 |
| 별의 일생 | 60 fps | 60 fps | 9,000 |
| 우주의 시작 | 60 fps | 60 fps | 10,201 |

모든 장면의 측정 p95 프레임 간격은 17.6~17.7 ms였습니다. 좁은 화면에서는
픽셀 비율을 1로 낮추고 파티클 수를 줄이는 분기가 동작했습니다.

## 컨텍스트 수명

태양계와 은하·별의 일생·우주의 시작을 20회 왕복하며 41개 뷰어를 만들고 버렸습니다.

- 오래된 컨텍스트가 남은 횟수: 0
- 동시에 살아 있던 컨텍스트 최대치: 1
- 해제된 컨텍스트 전부 `isContextLost()`: true
- 남은 canvas: 0

정지 화면 회귀검사도 통과했습니다. 우주 시작의 섬광이 움직임을 끈 뒤 0으로
꺼지고, 무대를 드래그한 뒤 카메라가 자동으로 되돌아가지 않았습니다.

## 자료 확인 범위

행성의 반지름·궤도·자전 주기 계산은 NASA/JPL 물리 매개변수 표를 기준으로 했습니다.
위성 수처럼 바뀌는 값은 화면에 2026년 8월 기준이라고 표시했습니다. 2026년 자료에서
목성 115개, 토성 293개, 천왕성 29개, 해왕성 16개를 반영했습니다.

토성 고리의 나이는 하나의 확정값으로 쓰지 않았습니다. 카시니 자료의 ‘수억 년’ 해석과
먼지 제거·우주 풍화까지 고려하면 수십억 년도 가능하다는 2026년 연구가 함께 있어,
사이트에서는 논쟁 중인 문제로 설명합니다. 안드로메다와 우리 은하의 미래 충돌도
결정된 사실처럼 쓰지 않았습니다.

## 화면 확인 파일

로컬 검증에서 다음 화면을 저장했습니다. 이 파일들은 배포물에 넣지 않았습니다.

- `screenshots/solar-mobile.png`
- `screenshots/milky-way.png`, `screenshots/milky-way-side.png`, `screenshots/andromeda.png`, `screenshots/large-magellanic-cloud.png`, `screenshots/m87-jet.png`
- `screenshots/cosmos-01.png` ~ `screenshots/cosmos-08.png`
- `screenshots/performance-desktop.json`, `screenshots/performance-mobile.json`, `screenshots/lifecycle.json`, `screenshots/pause-regression.json`
