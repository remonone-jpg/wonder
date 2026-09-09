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
  // 어떻게 도나
  | "mechanism"    // 작동 원리 — 왜 도는가, 왜 그 색인가
  | "scale"        // 얼마나 먼가 — 거리를 몸으로 느끼는 비유
  | "moons"        // 달들 — 위성 이야기
  | "origin"       // 태어난 이야기 — 45억 년 전 어떻게 뭉쳤나
  // 가 봤나요
  | "visit"        // 가 본 것들 — 탐사선의 기록, 사람이 간다면
  | "research"     // 지금 연구 중 — 미해결 문제
  | "see"          // 찾아보기 — 언제 어디서 눈에 보이나
  // 사람들이 아는 것
  | "history"      // 발견의 역사
  | "etymology"    // 이름의 유래
  | "culture"      // 말 속의 흔적 — 요일·별자리
  | "myths";       // 오해와 진실

export type DeepDive = {
  category: DeepDiveCategory;
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
