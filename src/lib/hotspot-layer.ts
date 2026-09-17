import * as THREE from "three";
import { hotspotsFor, LON_OFFSET_DEG, TEXTURE_FLIPPED, type Hotspot } from "../data/hotspots";
import type { BodyId } from "../data/types";

/**
 * 천체 표면의 점과, 눌렀을 때 뜨는 말풍선.
 *
 * 스프라이트가 아니라 HTML 을 쓴다. 이 책의 점은 한글 이름을 달고 있어야
 * 하는데 스프라이트에 글자를 넣으려면 글자마다 캔버스 텍스처를 구워야 하고,
 * 무대가 블룸을 지나 그려지기 때문에 밝은 점은 번져 버린다. `galaxy-viewer`
 * 가 이미 같은 방식으로 라벨을 달고 있어 손에 익은 길이기도 하다.
 *
 * 화면 크기 고정은 따로 계산하지 않는다. HTML 이라 CSS 가 정한 크기 그대로
 * 그려지고, 카메라가 멀어져도 글자가 작아지지 않는다. 앵커만 3D 에 두고
 * 매 프레임 화면 좌표로 투영해 위치를 옮긴다.
 *
 * 앵커는 천체 메시의 자식이다. 메시가 기울고(rotation.z) 돌기(rotation.y)
 * 때문에 점이 공짜로 따라 돈다. 메시의 지오메트리가 반지름 1 이고 scale 이
 * 곧 천체 반지름이라, 앵커를 길이 1 짜리 벡터에 두면 그대로 표면에 앉는다.
 *
 * 점과 이름표는 따로 논다. 점은 지형이 있는 자리에 못 박히고, 이름표는
 * 서로 겹치지 않도록 위아래로 밀려나며, 둘 사이를 가는 선이 잇는다.
 * 이름이 조금 비켜 있어도 어느 점의 것인지 알 수 있어야 하기 때문이다.
 */

/** 이 값보다 정면성이 낮으면 완전히 숨긴다. 0 이 지평선. */
const FADE_FROM = -0.05;
const FADE_TO = 0.22;
/** 손가락으로 누를 것을 생각한 판정 반경. CSS 픽셀. */
const PICK_RADIUS = 40;
/** 점과 이름표 사이. */
const GAP = 13;
/** 이름표와 말풍선이 무대 가장자리에서 떨어져 있을 만큼. */
const EDGE = 8;
/** 겹쳤다고 볼 세로 여유. 이름표 높이에 더해 쓴다. */
const ROW_GAP = 5;
/** 이름표를 위아래로 밀어 볼 횟수. 이 안에 자리를 못 찾으면 그대로 둔다. */
const NUDGE_TRIES = 12;
/**
 * 이름표가 점에서 멀어질 수 있는 한계. 너무 멀면 어느 점인지 알기 어렵다.
 *
 * 한 줄이 35픽셀이라 96이면 위아래로 두 줄씩밖에 못 간다. 좁은 화면에서
 * 점 다섯이 몰리면 자리가 모자라 둘이 같은 줄에 겹쳤다 — 지구의 알렉산드리아와
 * 파리가 그랬다. 세 줄까지 열어 주면 일곱 자리가 되어 넉넉하다.
 */
const MAX_NUDGE = 120;
/** 드래그로 볼 움직임. 천체 회전과 같은 기준을 쓴다. */
const DRAG_SLOP = 6;

type Pin = {
  spot: Hotspot;
  anchor: THREE.Object3D;
  /** 점·이름표·연결선을 담는 껍데기. 점의 정확한 자리에 놓인다. */
  root: HTMLDivElement;
  label: HTMLButtonElement;
  link: HTMLElement;
  /** 이름표의 크기. 글이 바뀌지 않으므로 한 번만 잰다. */
  labelW: number;
  labelH: number;
  /** 마지막으로 계산한 화면 좌표와 정면성. 판정에 다시 쓴다. */
  x: number;
  y: number;
  facing: number;
  onScreen: boolean;
  /**
   * 지난 프레임에 쓰던 줄. 자리를 다시 고를 때 이것부터 넣어 본다.
   *
   * 없으면 천체가 도는 동안 이름표가 매 프레임 다른 줄로 튄다. 자리를
   * 새로 계산할 때마다 점들의 세로 순서가 바뀌고, 순서가 바뀌면 먼저
   * 자리를 잡는 쪽이 달라지기 때문이다. 쓰던 줄이 아직 비어 있으면
   * 그대로 두는 것이 눈에 훨씬 편하다.
   */
  rung: number;
  /** 화면에 실제로 그려지는 세로 어긋남. 목표를 향해 부드럽게 따라간다. */
  dy: number;
};

type Box = { left: number; top: number; right: number; bottom: number };

/**
 * 위도·경도를 메시 로컬 단위벡터로.
 *
 * `THREE.SphereGeometry` 는 u 를 0 에서 1 로 돌리며
 * `x = -cos(u·2π)·sin(θ)`, `y = cos(θ)`, `z = sin(u·2π)·sin(θ)` 를 놓고,
 * uv 의 x 가 곧 u 다. 등장방형 그림은 본초자오선을 한가운데(u=0.5)에 두므로
 * `u = 0.5 + 경도/360` 이고, 이것을 위 식에 넣으면 아래가 남는다.
 */
export function latLonToLocal(latDeg: number, lonDeg: number, offsetDeg: number, flipped = false) {
  const lat = THREE.MathUtils.degToRad(flipped ? -latDeg : latDeg);
  const lon = THREE.MathUtils.degToRad((flipped ? -lonDeg : lonDeg) + offsetDeg);
  const cosLat = Math.cos(lat);
  return new THREE.Vector3(cosLat * Math.cos(lon), Math.sin(lat), -cosLat * Math.sin(lon));
}

/** 위 변환의 역. 보정 모드가 쓴다. */
export function localToLatLon(point: THREE.Vector3, offsetDeg: number, flipped = false) {
  const unit = point.clone().normalize();
  const lat = THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(unit.y, -1, 1)));
  const lon = THREE.MathUtils.radToDeg(Math.atan2(-unit.z, unit.x)) - offsetDeg;
  const wrapped = ((lon % 360) + 360) % 360;
  return flipped
    ? { lat: -lat, lon: (360 - wrapped) % 360 }
    : { lat, lon: wrapped };
}

const overlaps = (a: Box, b: Box) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

export class HotspotLayer {
  private pins: Pin[] = [];
  private card: HTMLDivElement;
  private cardTitle = document.createElement("b");
  private cardNote = document.createElement("small");
  private index: HTMLUListElement;
  private openId: string | null = null;
  private container: HTMLElement;
  private enabled = true;
  private onPick: ((spot: Hotspot) => void) | null = null;
  private onDeep: ((spot: Hotspot) => void) | null = null;
  private deepButton: HTMLButtonElement;
  private lastLayout = performance.now();

  private world = new THREE.Vector3();
  private center = new THREE.Vector3();
  private outward = new THREE.Vector3();
  private toCamera = new THREE.Vector3();
  private projected = new THREE.Vector3();

  constructor(container: HTMLElement) {
    this.container = container;

    this.card = document.createElement("div");
    this.card.className = "body-pin-card";
    this.card.hidden = true;
    const close = document.createElement("button");
    close.type = "button";
    close.className = "body-pin-close";
    close.setAttribute("aria-label", "닫기");
    close.textContent = "×";
    close.addEventListener("click", () => this.select(null));
    // 한 문장으로 끝나지 않는 아이를 심화로 보낸다. 말풍선이 들고 있는
    // 것은 맛보기 한 줄뿐이고, 그 뒤는 읽기 패널이 맡는다.
    this.deepButton = document.createElement("button");
    this.deepButton.type = "button";
    this.deepButton.className = "body-pin-deep";
    this.deepButton.textContent = "자세히 보기 ↗";
    this.deepButton.addEventListener("click", () => {
      const spot = this.pins.find((p) => p.spot.id === this.openId)?.spot;
      if (!spot) return;
      // 말풍선은 닫는다. 읽을 곳이 패널로 옮겨 갔는데 같은 한 줄을 든
      // 쪽지가 3D 위에 남아 있으면 어디를 보라는 것인지 흐려진다.
      this.select(null);
      this.onDeep?.(spot);
    });
    const inner = document.createElement("div");
    inner.className = "body-pin-body";
    inner.append(close, this.cardTitle, this.cardNote, this.deepButton);
    this.card.append(inner);
    container.appendChild(this.card);

    // 캔버스 위의 점은 보조 기술이 읽을 수 없다. 같은 내용을 글로도 둔다.
    this.index = document.createElement("ul");
    this.index.className = "body-pin-index";
    container.appendChild(this.index);
  }

  /** 천체가 바뀌면 점을 새로 건다. 데이터가 없는 천체는 빈 채로 둔다. */
  attach(bodyId: BodyId, mesh: THREE.Mesh) {
    this.clear();
    const offset = LON_OFFSET_DEG[bodyId] ?? 0;
    const flipped = TEXTURE_FLIPPED[bodyId] ?? false;
    for (const spot of hotspotsFor(bodyId)) {
      const anchor = new THREE.Object3D();
      anchor.position.copy(latLonToLocal(spot.lat, spot.lon, offset, flipped));
      mesh.add(anchor);

      const root = document.createElement("div");
      root.className = "body-pin";
      root.dataset.on = "false";

      // 점과 연결선은 그림이다. 이름과 누르는 일은 이름표가 맡고, 점 둘레를
      // 누르는 것은 캔버스가 받는다. 보조 기술에는 숨김 목록으로 전한다.
      const link = document.createElement("i");
      link.className = "body-pin-link";
      link.setAttribute("aria-hidden", "true");
      const dot = document.createElement("i");
      dot.className = "body-pin-dot";
      dot.setAttribute("aria-hidden", "true");
      const label = document.createElement("button");
      label.type = "button";
      label.className = "body-pin-label";
      label.textContent = spot.name;
      this.bindLabel(label, spot);

      root.append(link, dot, label);
      this.container.appendChild(root);

      const item = document.createElement("li");
      item.textContent = `${spot.name}. ${spot.note}`;
      this.index.appendChild(item);

      // 숨김은 visibility 로 한다. display:none 이면 상자가 없어 크기를 못 잰다.
      this.pins.push({
        spot, anchor, root, label, link,
        labelW: label.offsetWidth, labelH: label.offsetHeight,
        x: 0, y: 0, facing: -1, onScreen: false, rung: 0, dy: 0,
      });
    }
  }

  /**
   * 이름표를 직접 눌러도 열리게 한다.
   *
   * 이름표가 캔버스 위에 떠 있어서 클릭을 가로챈다. 여기서 받지 않으면
   * 눈에 보이는 이름을 눌렀을 때 아무 일도 일어나지 않는다. 캔버스 쪽
   * 판정은 점 둘레를 맡고, 이 핸들러는 이름표 자체를 맡는다.
   *
   * 천체를 돌리려고 이름표 위에서 끌기 시작하는 일이 있으므로, 캔버스와
   * 같은 여유를 두고 움직였으면 누른 것으로 세지 않는다.
   */
  private bindLabel(label: HTMLButtonElement, spot: Hotspot) {
    let start = { x: 0, y: 0 };
    let dragged = false;
    label.addEventListener("pointerdown", (event) => {
      start = { x: event.clientX, y: event.clientY };
      dragged = false;
    });
    label.addEventListener("pointermove", (event) => {
      if (event.buttons > 0 && Math.hypot(event.clientX - start.x, event.clientY - start.y) > DRAG_SLOP) dragged = true;
    });
    label.addEventListener("click", () => {
      if (dragged) { dragged = false; return; }
      this.toggle(spot);
      this.onPick?.(spot);
    });
  }

  /** 점이 눌렸을 때 바깥에 알린다. */
  setOnPick(handler: ((spot: Hotspot) => void) | null) {
    this.onPick = handler;
  }

  /** "자세히 보기"를 눌렀을 때. 읽기 패널이 심화 편을 여는 자리다. */
  setOnDeepDive(handler: ((spot: Hotspot) => void) | null) {
    this.onDeep = handler;
  }

  clear() {
    this.select(null);
    for (const pin of this.pins) {
      pin.anchor.removeFromParent();
      pin.root.remove();
    }
    this.pins = [];
    this.index.replaceChildren();
  }

  /** 단면이 열렸거나 너무 멀면 통째로 끈다. */
  setEnabled(on: boolean) {
    if (this.enabled === on) return;
    this.enabled = on;
    if (!on) this.select(null);
  }

  get count() {
    return this.pins.length;
  }

  /**
   * 화면 좌표와 정면성을 다시 잰다.
   *
   * 점이 구 위에 있어서 중심에서 점으로 향하는 방향이 곧 그 자리의 법선이다.
   * 그것과 카메라 쪽 방향의 내적이 양수면 이쪽을 보고 있는 면이고, 음수면
   * 천체 뒤로 넘어간 것이다. 메시를 레이캐스트할 필요가 없다.
   */
  update(camera: THREE.PerspectiveCamera, meshCenter: THREE.Vector3, width: number, height: number) {
    if (!this.pins.length) return;
    this.center.copy(meshCenter);
    for (const pin of this.pins) {
      if (!this.enabled) {
        pin.root.dataset.on = "false";
        pin.onScreen = false;
        continue;
      }
      pin.anchor.getWorldPosition(this.world);
      this.outward.copy(this.world).sub(this.center).normalize();
      this.toCamera.copy(camera.position).sub(this.world).normalize();
      pin.facing = this.outward.dot(this.toCamera);

      this.projected.copy(this.world).project(camera);
      pin.x = (this.projected.x * 0.5 + 0.5) * width;
      pin.y = (-this.projected.y * 0.5 + 0.5) * height;

      const opacity = THREE.MathUtils.smoothstep(pin.facing, FADE_FROM, FADE_TO);
      const inFrame = this.projected.z < 1
        && Math.abs(this.projected.x) < 0.98 && Math.abs(this.projected.y) < 0.98;
      pin.onScreen = opacity > 0.05 && inFrame;
      pin.root.dataset.on = String(pin.onScreen);
      if (!pin.onScreen) continue;
      pin.root.style.transform = `translate3d(${Math.round(pin.x)}px, ${Math.round(pin.y)}px, 0)`;
      pin.root.style.opacity = String(opacity);
      pin.root.dataset.open = String(this.openId === pin.spot.id);
    }
    this.layoutLabels(width, height);
    this.positionCard(width, height);
  }

  /**
   * 이름표 자리를 정한다.
   *
   * 점은 지형 위에 못 박혀 있어 서로 가까이 올 수밖에 없다. 그대로 두면
   * 이름표가 포개져 둘 다 못 읽는다. 그래서 점은 그 자리에 두고 이름표만
   * 위아래로 밀어 어긋나게 한다.
   *
   * 후보 자리는 0, +한 줄, -한 줄, +두 줄… 순으로 본다. 위아래로 번갈아
   * 벌리면 한쪽으로 몰리지 않는다. 각 후보를 무대 안으로 당긴 뒤에 겹침을
   * 보는 것이 요점이다 — 당기고 나서 보면 이미 늦어, 가장자리에서 당겨진
   * 이름표가 다른 것 위에 얹힌다.
   */
  private layoutLabels(width: number, height: number) {
    const now = performance.now();
    const elapsed = Math.min((now - this.lastLayout) / 1000, 0.05);
    this.lastLayout = now;
    const ease = 1 - Math.exp(-elapsed * 10);

    const shown = this.pins.filter((pin) => pin.onScreen).sort((a, b) => a.y - b.y);
    const placed: Box[] = [];

    for (const pin of shown) {
      // 이름표는 처음 보일 때 크기를 잰다. 숨어 있을 때는 상자가 없다.
      if (!pin.labelW) {
        pin.labelW = pin.label.offsetWidth;
        pin.labelH = pin.label.offsetHeight;
      }
      const w = pin.labelW;
      const h = pin.labelH;
      const step = h + ROW_GAP;
      // 오른쪽 끝에 붙은 점은 이름표를 왼쪽으로 펼친다.
      const toLeft = pin.x > width * 0.55;

      // 쓰던 줄을 맨 앞에 놓고, 그다음 0, +1, -1, +2, -2 … 로 본다.
      const order = [pin.rung];
      for (let i = 0; i < NUDGE_TRIES; i++) {
        const rung = Math.ceil(i / 2) * (i % 2 === 0 ? -1 : 1);
        if (!order.includes(rung)) order.push(rung);
      }

      let best: Box | null = null;
      let bestRung = pin.rung;
      for (const rung of order) {
        const nudge = rung * step;
        if (Math.abs(nudge) > MAX_NUDGE) continue;

        const wantLeft = toLeft ? pin.x - GAP - w : pin.x + GAP;
        const left = Math.min(Math.max(wantLeft, EDGE), Math.max(EDGE, width - w - EDGE));
        const wantTop = pin.y + nudge - h / 2;
        const top = Math.min(Math.max(wantTop, EDGE), Math.max(EDGE, height - h - EDGE));
        const box = { left, top, right: left + w, bottom: top + h };

        if (!placed.some((other) => overlaps(box, other))) { best = box; bestRung = rung; break; }
        // 자리를 못 찾으면 쓰던 줄 그대로 둔다. 튀는 것보다 낫다.
        if (!best) { best = box; bestRung = rung; }
      }
      if (!best) continue;
      placed.push(best);
      pin.rung = bestRung;

      const dx = best.left - pin.x;
      // 목표로 곧장 뛰지 않고 따라붙는다. 천체가 도는 동안 줄이 바뀌어도
      // 이름표가 미끄러지듯 옮겨 가 눈이 따라갈 수 있다.
      const target = best.top + h / 2 - pin.y;
      pin.dy += (target - pin.dy) * ease;
      if (Math.abs(target - pin.dy) < 0.5) pin.dy = target;
      const dy = pin.dy;
      pin.label.style.transform = `translate(${Math.round(dx)}px, calc(${Math.round(dy)}px - 50%))`;

      // 연결선은 점에서 이름표의 가까운 쪽 모서리 한가운데까지.
      const endX = best.left + w / 2 > pin.x ? dx : dx + w;
      const length = Math.hypot(endX, dy);
      pin.link.style.width = `${Math.round(length)}px`;
      pin.link.style.transform = `rotate(${Math.atan2(dy, endX)}rad)`;
      // 점에 바로 붙은 이름표에는 선이 필요 없다.
      pin.link.hidden = length < GAP + 2;
    }
  }

  /**
   * 화면 거리로 고른다. 메시 레이캐스트가 아니라 투영 N번이라 싸고, 뒤로
   * 넘어간 점은 `onScreen` 이 이미 걸러 준다 — 천체를 뚫고 반대편 점을
   * 누를 수 없다는 뜻이다.
   */
  pick(x: number, y: number): Hotspot | null {
    if (!this.enabled) return null;
    let best: Pin | null = null;
    let bestDistance = PICK_RADIUS;
    for (const pin of this.pins) {
      if (!pin.onScreen) continue;
      const distance = Math.hypot(pin.x - x, pin.y - y);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = pin;
      }
    }
    return best?.spot ?? null;
  }

  /** 같은 점을 다시 고르면 닫는다. */
  toggle(spot: Hotspot) {
    this.select(this.openId === spot.id ? null : spot.id);
  }

  select(id: string | null) {
    this.openId = id;
    const pin = this.pins.find((p) => p.spot.id === id);
    for (const other of this.pins) other.root.dataset.open = String(other.spot.id === id);
    if (!pin) {
      this.card.hidden = true;
      return;
    }
    this.cardTitle.textContent = pin.spot.name;
    this.cardNote.textContent = pin.spot.note;
    this.card.hidden = false;
  }

  /**
   * 말풍선을 점 옆에 붙인다.
   *
   * 뒤집기만으로는 모자란다. 360픽셀 화면에서 무대는 336픽셀인데 카드가
   * 230픽셀이라, 점이 한가운데 있으면 어느 쪽으로 펼쳐도 넘친다. 그래서
   * 뒤집은 뒤 가로세로 모두 무대 안으로 한 번 더 밀어 넣는다.
   */
  private positionCard(width: number, height: number) {
    if (this.card.hidden) return;
    const pin = this.pins.find((p) => p.spot.id === this.openId);
    if (!pin || !pin.onScreen) { this.card.hidden = true; return; }
    this.card.style.transform = `translate3d(${Math.round(pin.x)}px, ${Math.round(pin.y)}px, 0)`;

    const body = this.card.firstElementChild as HTMLElement;
    const cardWidth = body.offsetWidth;
    const cardHeight = body.offsetHeight;

    const toLeft = pin.x > width * 0.55;
    const wantLeft = toLeft ? pin.x - GAP - cardWidth : pin.x + GAP;
    const left = Math.min(Math.max(wantLeft, EDGE), Math.max(EDGE, width - cardWidth - EDGE));

    const up = pin.y > height * 0.6;
    const wantTop = up ? pin.y - GAP - cardHeight : pin.y + GAP;
    const top = Math.min(Math.max(wantTop, EDGE), Math.max(EDGE, height - cardHeight - EDGE));

    // 앵커가 점 위에 있으므로 카드는 점 기준 상대 위치로 준다.
    body.style.left = `${Math.round(left - pin.x)}px`;
    body.style.top = `${Math.round(top - pin.y)}px`;
  }

  dispose() {
    this.clear();
    this.card.remove();
    this.index.remove();
  }
}
