import * as THREE from "three";
import { hotspotsFor, LON_OFFSET_DEG, type Hotspot } from "../data/hotspots";
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
 */

/** 이 값보다 정면성이 낮으면 완전히 숨긴다. 0 이 지평선. */
const FADE_FROM = -0.05;
const FADE_TO = 0.22;
/** 손가락으로 누를 것을 생각한 판정 반경. CSS 픽셀. */
const PICK_RADIUS = 40;
/** 점과 말풍선 사이. */
const GAP = 14;
/** 말풍선이 무대 가장자리에서 떨어져 있을 만큼. */
const EDGE = 8;

type Pin = {
  spot: Hotspot;
  anchor: THREE.Object3D;
  element: HTMLButtonElement;
  /** 마지막으로 계산한 화면 좌표와 정면성. 판정에 다시 쓴다. */
  x: number;
  y: number;
  facing: number;
  onScreen: boolean;
};

/**
 * 위도·경도를 메시 로컬 단위벡터로.
 *
 * `THREE.SphereGeometry` 는 u 를 0 에서 1 로 돌리며
 * `x = -cos(u·2π)·sin(θ)`, `y = cos(θ)`, `z = sin(u·2π)·sin(θ)` 를 놓고,
 * uv 의 x 가 곧 u 다. 등장방형 그림은 본초자오선을 한가운데(u=0.5)에 두므로
 * `u = 0.5 + 경도/360` 이고, 이것을 위 식에 넣으면 아래가 남는다.
 */
export function latLonToLocal(latDeg: number, lonDeg: number, offsetDeg: number) {
  const lat = THREE.MathUtils.degToRad(latDeg);
  const lon = THREE.MathUtils.degToRad(lonDeg + offsetDeg);
  const cosLat = Math.cos(lat);
  return new THREE.Vector3(cosLat * Math.cos(lon), Math.sin(lat), -cosLat * Math.sin(lon));
}

/** 위 변환의 역. 보정 모드가 쓴다. */
export function localToLatLon(point: THREE.Vector3, offsetDeg: number) {
  const unit = point.clone().normalize();
  const lat = THREE.MathUtils.radToDeg(Math.asin(THREE.MathUtils.clamp(unit.y, -1, 1)));
  const lon = THREE.MathUtils.radToDeg(Math.atan2(-unit.z, unit.x)) - offsetDeg;
  return { lat, lon: ((lon % 360) + 360) % 360 };
}

export class HotspotLayer {
  private pins: Pin[] = [];
  private card: HTMLDivElement;
  private cardTitle = document.createElement("b");
  private cardNote = document.createElement("small");
  private index: HTMLUListElement;
  private openId: string | null = null;
  private container: HTMLElement;
  private enabled = true;

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
    const inner = document.createElement("div");
    inner.className = "body-pin-body";
    inner.append(close, this.cardTitle, this.cardNote);
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
    for (const spot of hotspotsFor(bodyId)) {
      const anchor = new THREE.Object3D();
      anchor.position.copy(latLonToLocal(spot.lat, spot.lon, offset));
      mesh.add(anchor);

      const element = document.createElement("button");
      element.type = "button";
      element.className = "body-pin";
      element.hidden = true;
      element.textContent = spot.name;
      element.dataset.id = spot.id;
      this.container.appendChild(element);

      const item = document.createElement("li");
      item.textContent = `${spot.name}. ${spot.note}`;
      this.index.appendChild(item);

      this.pins.push({ spot, anchor, element, x: 0, y: 0, facing: -1, onScreen: false });
    }
  }

  clear() {
    this.select(null);
    for (const pin of this.pins) {
      pin.anchor.removeFromParent();
      pin.element.remove();
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
        pin.element.hidden = true;
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
      pin.element.hidden = !pin.onScreen;
      if (!pin.onScreen) continue;
      pin.element.style.transform = `translate3d(${Math.round(pin.x)}px, ${Math.round(pin.y)}px, 0)`;
      pin.element.style.opacity = String(opacity);
      pin.element.dataset.open = String(this.openId === pin.spot.id);
    }
    this.positionCard(width, height);
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
    if (!pin) {
      this.card.hidden = true;
      for (const other of this.pins) other.element.dataset.open = "false";
      return;
    }
    this.cardTitle.textContent = pin.spot.name;
    this.cardNote.textContent = pin.spot.note;
    this.card.hidden = false;
  }

  /**
   * 말풍선을 점 옆에 붙인다.
   *
   * 좌우는 뒤집기만으로는 모자란다. 360픽셀 화면에서 무대는 336픽셀인데
   * 카드가 230픽셀이라, 점이 한가운데 있으면 오른쪽으로 펼쳐도 왼쪽으로
   * 펼쳐도 넘친다. 그래서 뒤집은 뒤 한 번 더 무대 안으로 밀어 넣는다.
   * 위아래는 카드가 낮아 뒤집기로 충분하다.
   */
  private positionCard(width: number, height: number) {
    if (this.card.hidden) return;
    const pin = this.pins.find((p) => p.spot.id === this.openId);
    if (!pin || !pin.onScreen) { this.card.hidden = true; return; }
    this.card.style.transform = `translate3d(${Math.round(pin.x)}px, ${Math.round(pin.y)}px, 0)`;
    this.card.dataset.vside = pin.y > height * 0.6 ? "up" : "down";

    const body = this.card.firstElementChild as HTMLElement;
    const cardWidth = body.offsetWidth;
    const toLeft = pin.x > width * 0.55;
    const wanted = toLeft ? pin.x - GAP - cardWidth : pin.x + GAP;
    const limit = Math.max(EDGE, width - cardWidth - EDGE);
    const left = Math.min(Math.max(wanted, EDGE), limit);
    // 앵커가 점 위에 있으므로 카드는 점 기준 상대 위치로 준다.
    body.style.left = `${Math.round(left - pin.x)}px`;
  }

  dispose() {
    this.clear();
    this.card.remove();
    this.index.remove();
  }
}
