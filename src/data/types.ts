/**
 * Every shape the data files fill in.
 *
 * Types live here rather than beside their data because three of the four
 * files describe the same nine bodies from different angles — measurements,
 * prose, interiors — and a reader following one of them through should not
 * have to open the other two to find out what a `BodyId` is.
 */

export type BodyId =
  | "sun" | "mercury" | "venus" | "earth" | "mars"
  | "jupiter" | "saturn" | "uranus" | "neptune";

/** One body, in measured figures. See `planets.ts` for the values. */
export type Body = {
  id: BodyId;
  /** Equatorial radius, kilometres. */
  radiusKm: number;
  /** Mean distance from the Sun, astronomical units. The Sun itself is 0. */
  orbitAu: number;
  /** Length of one day, hours. Negative means it spins the other way. */
  dayHours: number;
  /** Length of one year, Earth days. */
  yearDays: number;
  /** Surface or cloud-top temperature, °C. */
  tempC: number;
  moons: number;
  /** Base colour used before the texture loads, and for the orbit line. */
  tint: string;
  texture: string;
  /** Extra maps some bodies carry. */
  cloudTexture?: string;
  ringTexture?: string;
  /** Axial tilt in degrees — why Saturn's rings lean and Uranus rolls. */
  tiltDeg: number;
};

/**
 * The angles a body is worth looking at from, in the order they read.
 *
 * Four groups, running outward: what it is, how it moves, whether anyone has
 * been, and what people have come to say about it. A body carrying only some
 * of these simply shows fewer entries — nothing has to be filled in before the
 * rest can be written.
 */
export type DeepDiveCategory =
  // 무엇인가
  | "structure"    // 구조 — 층·대기·고리
  | "numbers"      // 숫자로 보면 — 지름·질량·주기
  | "weather"      // 날씨 — 폭풍·바람·온도
  | "atmosphere"   // 대기와 하늘 — 무엇으로 되어 있고 어떤 색인가
  | "magnetism"    // 자기장 — 눈에 안 보이는 껍질
  // 어떻게 도나
  | "mechanism"    // 작동 원리 — 왜 도는가, 왜 그 색인가
  | "scale"        // 얼마나 먼가 — 거리를 몸으로 느끼는 비유
  | "moons"        // 달들 — 위성 이야기
  | "origin"       // 태어난 이야기 — 45억 년 전 어떻게 뭉쳤나
  | "orbit"        // 궤도와 이웃 — 다른 천체와의 관계
  // 가 봤나요
  | "visit"        // 가 본 것들 — 탐사선의 기록, 사람이 간다면
  | "research"     // 지금 연구 중 — 미해결 문제
  | "see"          // 찾아보기 — 언제 어디서 눈에 보이나
  | "future"       // 앞으로의 계획 — 예정된 탐사
  | "livehere"     // 사람이 산다면 — 무엇이 필요한가
  // 사람들이 아는 것
  | "history"      // 발견의 역사
  | "etymology"    // 이름의 유래
  | "culture"      // 말 속의 흔적 — 요일·별자리
  | "myths"        // 오해와 진실
  | "art";         // 그림과 이야기에 남은 것

/**
 * 심화 한 편에 붙는 그림 또는 영상.
 *
 * `kind` 로 가른 유니온이다. `image`/`video` 두 필드를 따로 두면 "둘 다
 * 있으면 어느 쪽?"이라는, 답할 필요가 없는 경우가 생긴다.
 */
export type DeepDiveMedia = {
  kind: "image" | "video";
  src: string;
  /** 그림에 무엇이 있는지. video 에서는 aria-label 로 붙는다. */
  alt: string;
  /** 왜 이 그림인지. 화면에 <figcaption> 으로 보인다. */
  caption?: string;
  /** video 전용. 첫 프레임이 곧 포스터라 대개 없어도 된다. */
  poster?: string;
};

/**
 * 심화 한 편.
 *
 * 카테고리만 층마다 다르다. 행성은 `DeepDiveCategory` 스무 개, 태양계
 * 밖은 `CosmosCategory` 열넷이다. 둘을 한 유니온으로 합치지 않고 타입
 * 매개변수로 받는 이유는, 합치면 행성 편이 `whatis` 를 쓰거나 은하 편이
 * `moons` 를 써도 타입이 통과하기 때문이다. 갈라 두면 그 자리에서 막힌다.
 *
 * 기본값이 `DeepDiveCategory` 라 기존 자리는 한 글자도 안 바뀐다 —
 * `DeepDive[]` 는 여전히 행성 편이고, 태양계 밖은
 * `DeepDive<CosmosCategory>[]` 라고 적는다.
 */
export type DeepDive<C = DeepDiveCategory> = {
  category: C;
  /**
   * Also the entry's identity, not just its heading: a panel keys its list on
   * this string and remembers which entry is open by it. Rewording a title
   * moves the furniture out from under that — so the easy reading gets
   * `titleEasy` beside it and this stays exactly as it is.
   */
  title: string;
  titleEasy?: string;
  /** The full reading. Written to be worth a grown-up's time. */
  body: string;
  /** The same passage said plainly. Falls back to `body` where unwritten. */
  bodyEasy?: string;
  /**
   * 이 편에 붙는 자료 하나. public/figures/<body>/<category>.<확장자>.
   * 없는 편이 있으므로 선택 필드. 출처와 라이선스는 ATTRIBUTION.md.
   *
   * 여럿이 아니라 하나인 이유: 심화 한 편은 문단 하나이고, 접힌 아코디언
   * 안에 갤러리를 넣으면 다섯 살에게 조작이 하나 더 는다. 여러 장이
   * 필요한 편이 생기면 그때 넓히면 되고 기존 데이터는 그대로 통과한다.
   *
   * 움직이는 GIF 는 `image` 다 — <img> 가 알아서 재생한다. `video` 는
   * mp4·webm 처럼 <video> 가 필요한 것에만 쓴다.
   */
  media?: DeepDiveMedia;
};

/**
 * 태양계 밖 항목이 심화를 나눠 갖는 각도. 넷씩 묶어 열넷이다.
 *
 * 행성용 스무 개를 그대로 쓸 수 없어서 따로 뒀다. `moons`·`orbit`·`visit`·
 * `livehere` 는 은하나 블랙홀에서 답할 말이 없고, 반대로 "어떻게 태어나
 * 어떻게 끝나나"는 행성에는 한 편뿐인 것이 여기서는 세 편이 된다.
 *
 * 열넷인 것은 스물이 많아서가 아니라 아직 모르기 때문이다. 항목을 몇 개
 * 써 보고 모자라면 늘리면 된다 — 카테고리를 더하는 값은 이 유니온과
 * 컴포넌트의 묶음 표, 두 곳뿐이다.
 */
export type CosmosCategory =
  // 무엇인가
  | "whatis"       // 무엇인가 — 정체
  | "size"         // 크기와 거리
  | "inside"       // 속은 어떻게 되어 있나
  | "light"        // 어떤 빛을 내나
  // 어떻게 되나
  | "birth"        // 어떻게 태어나나
  | "life"         // 살아가는 동안
  | "death"        // 어떻게 끝나나
  | "change"       // 시간이 지나면
  // 어떻게 알았나
  | "discover"     // 어떻게 찾아냈나
  | "observe"      // 무엇으로 보나
  | "unknown"      // 아직 모르는 것
  // 우리와의 관계
  | "ushere"       // 우리와 무슨 상관인가
  | "imagine"      // 상상 속에서
  | "scale2";      // 얼마나 큰지 느껴 보기

/**
 * 태양계 밖 항목의 id.
 *
 * `BodyId` 와 달리 유니온이 아니라 그냥 문자열이다. 아홉 천체는 3D 무대에
 * 구체로 떠 있는 것이 전부라 목록이 닫혀 있지만, 이쪽은 별·은하·성운·
 * 블랙홀·과정이 계속 늘어난다. 항목을 하나 더할 때마다 타입을 고치게 하는
 * 값이 얻는 것보다 크다.
 */
export type CosmosId = string;

/** 태양계 밖 항목이 무엇인지. 무대가 무엇을 그릴지도 이것으로 갈린다. */
export type CosmosKind =
  | "star"         // 별 — 일생, 초신성, 백색왜성
  | "galaxy"       // 은하
  | "nebula"       // 성운
  | "blackhole"    // 블랙홀
  | "process";     // 과정 — 빅뱅, 팽창. 천체가 아니라 시간축을 가진 일

/**
 * 태양계 밖 항목 하나. 2층의 `Body` + `BodyCopy` 에 해당한다.
 *
 * 둘을 갈라 두지 않고 한 타입에 담은 이유: 행성은 measured 값(`planets.ts`)과
 * 글(`copy.ts`)이 서로 다른 출처에서 와 파일을 나눌 값이 있었지만, 여기서는
 * 잴 것이 없다. 은하의 "크기"는 재서 넣는 숫자가 아니라 써서 넣는 문장이다.
 *
 * `facts` 가 목록인 것도 같은 이유다. 행성은 크기·하루·일 년·달 넷이 모든
 * 천체에 있어 고정 칸이 되지만, 블랙홀에는 하루가 없고 은하에는 달이 없다.
 * 항목마다 자기에게 있는 것만 적는다.
 */
export type Cosmos = {
  id: CosmosId;
  name: string;
  poetic: string;
  kind: CosmosKind;
  /** 왼쪽 목록의 색점. 행성의 `Body.tint` 와 같은 자리에 쓰인다. */
  tint: string;
  /**
   * 이 항목의 대표 그림. 2층은 3D 가 아니라 사진이 무대에 서는 층이라,
   * 이것이 사실상 본체다.
   *
   * 그런데도 선택 필드인 것은 `process` 때문이다. 빅뱅이나 우주의 팽창은
   * 찍은 사진이 없어 도해를 그려야 하는데, 그림이 준비되기 전에도 글은
   * 넣을 수 있어야 한다. 그림 없는 항목은 목록에 이름과 색점만으로 서고,
   * 무대는 그때 다른 것을 그리면 된다.
   */
  image?: { src: string; alt: string; caption?: string };
  description: string;
  /** 같은 말을 쉽게. 없으면 `description` 으로 떨어진다. */
  descriptionEasy?: string;
  /** 이 항목에 있는 것만 적는 자유 목록. 고정 칸이 아니다. */
  facts: { label: string; value: string }[];
  /** 밤하늘에서 찾아볼 수 있는 것에만. 빅뱅에는 없다. */
  lookUp?: string;
  deepDive?: DeepDive<CosmosCategory>[];
};

/** The prose for one body. See `copy.ts`. */
export type BodyCopy = {
  name: string;
  poetic: string;
  description: string;
  size: string;
  day: string;
  year: string;
  funFact: string;
  /** Something to try outside, or with their own body. */
  lookUp: string;
  /**
   * The layer underneath, folded away until asked for. Optional because it is
   * written a body at a time, and a body without one shows nothing rather than
   * an empty heading.
   */
  deepDive?: DeepDive[];
};
