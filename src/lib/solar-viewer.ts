import * as THREE from "three";
import { AU_KM, bodies } from "../data/planets";
import type { Body, BodyId } from "../data/types";
import { asset } from "./asset";
import { ViewerBase } from "./viewer-base";
import { HotspotLayer, localToLatLon } from "./hotspot-layer";
import { LON_OFFSET_DEG, type Hotspot } from "../data/hotspots";

/**
 * The solar system rendered from its real numbers.
 *
 * The one decision that matters here is scale. At true scale the planets are
 * invisible specks strung along an empty line — which is the honest picture,
 * and worth showing once — so the default view keeps the real *ratios* between
 * planets while compressing the Sun and the orbital distances that would
 * otherwise push everything off screen. `setTrueScale` swaps between them, and
 * the jump between the two is the lesson.
 *
 * 내부 단면(휠로 천체를 갈라 속을 보는 것)은 배선을 걷어 냈다. 만들던
 * 파일 `interior-viewer.ts` 와 `interior-stages.ts` 는 그대로 두었고,
 * 이 무대가 그것을 부르지 않을 뿐이다. 되살리려면 이 커밋을 되돌리면
 * 된다 — 걷어낸 자리가 한 커밋에 모여 있다.
 */

type Callbacks = {
  onPick: (id: BodyId | null) => void;
  onHover: (id: BodyId | null) => void;
  onReady: () => void;
  /** 점의 "자세히 보기". 읽기 패널이 그 편을 펼친다. */
  onOpenDeep?: (spot: Hotspot) => void;
};

/**
 * `?calib=1` 이면 구를 누를 때마다 그 자리의 위도·경도를 찍는다.
 *
 * 텍스처마다 경도의 기준선이 달라서, 지명목록의 값을 그대로 넣으면 점이
 * 통째로 돌아간 자리에 앉을 수 있다. 눈으로 찾을 수 있는 지형을 눌러
 * 나온 값과 실제 값의 차이가 곧 그 천체의 오프셋이다.
 */
const CALIBRATING = typeof location !== "undefined" && new URLSearchParams(location.search).get("calib") === "1";

/** 조준 거리의 몇 배 안쪽에서 점을 보여 줄 것인가. */
const SHOW_WITHIN = 1.35;

/** Scene units are Earth radii. Everything below is expressed in them. */
const EARTH_RADIUS_KM = 6371;

/** Nice view: planets keep their real ratios, the Sun is cut down to fit. */
const NICE = {
  sunScale: 0.09,
  /** Orbits laid out on a curve so the outer planets stay reachable. */
  orbitAt: (au: number) => 26 + Math.pow(au, 0.62) * 46,
  planetScale: 1.6,
};

/** True view: one scene unit is one Earth radius, for every body and distance. */
const TRUE = {
  sunScale: 1,
  orbitAt: (au: number) => (au * AU_KM) / EARTH_RADIUS_KM,
  planetScale: 1,
};

type Placed = {
  id: BodyId;
  pivot: THREE.Group;
  mesh: THREE.Mesh;
  orbit: THREE.Line | null;
  body: Body;
  angle: number;
};

export class SolarViewer extends ViewerBase {
  private callbacks: Callbacks;

  private placed: Placed[] = [];
  private selected: BodyId | null = null;
  private trueScale = false;

  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private pointerDown = { x: 0, y: 0 };
  private dragged = false;
  /** `frame()` 이 정한 조준 거리. 점을 언제 보여 줄지 재는 데 쓴다. */
  private focusedDistance = 0;
  private hotspots: HotspotLayer;
  private calibReadout: HTMLParagraphElement | null = null;


  constructor(container: HTMLElement, callbacks: Callbacks) {
    // 거리 범위가 천체 반지름부터 30 천문단위까지라, 줌은 느리게 잡는다.
    // 기본 속도로는 휠 한 번에 아이가 따라갈 수 없다.
    super(container, {
      cameraAt: [0, 90, 210],
      minDistance: 3,
      maxDistance: 4e6,
      ariaLabel: "돌려 보는 태양계 모형",
    });
    this.callbacks = callbacks;

    // The Sun is the only light source, which is also the reason a planet's far
    // side is dark — worth seeing rather than lighting away with ambient fill.
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.06));
    const sunLight = new THREE.PointLight(0xfff2e0, 3.4, 0, 0);
    this.scene.add(sunLight);

    this.build();
    this.hotspots = new HotspotLayer(container);
    this.hotspots.setOnDeepDive((spot) => this.callbacks.onOpenDeep?.(spot));
    if (CALIBRATING) {
      this.calibReadout = document.createElement("p");
      this.calibReadout.className = "calib-readout";
      this.calibReadout.textContent = "보정 모드 — 천체를 눌러 보세요";
      container.appendChild(this.calibReadout);
    }

    const canvas = this.renderer.domElement;
    canvas.addEventListener("pointerdown", this.onPointerDown);
    canvas.addEventListener("pointerup", this.onPointerUp);
    canvas.addEventListener("pointermove", this.onPointerMove);

    this.start();
  }

  private build() {
    for (const body of bodies) {
      const pivot = new THREE.Group();
      const map = this.loader.load(asset(body.texture));
      map.colorSpace = THREE.SRGBColorSpace;

      const isSun = body.id === "sun";
      const material = isSun
        // The Sun makes its own light, so it must not be lit by any.
        ? new THREE.MeshBasicMaterial({ map })
        : new THREE.MeshStandardMaterial({ map, roughness: 1, metalness: 0 });

      const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, this.lowPower ? 40 : 64, this.lowPower ? 28 : 48), material);
      mesh.rotation.order = "ZXY";
      mesh.rotation.z = THREE.MathUtils.degToRad(body.tiltDeg);
      mesh.userData.id = body.id;
      pivot.add(mesh);

      if (body.cloudTexture) {
        const cloudMap = this.loader.load(asset(body.cloudTexture));
        cloudMap.colorSpace = THREE.SRGBColorSpace;
        const clouds = new THREE.Mesh(
          new THREE.SphereGeometry(1.012, 48, 32),
          new THREE.MeshStandardMaterial({ map: cloudMap, transparent: true, opacity: 0.62, depthWrite: false }),
        );
        clouds.name = "clouds";
        mesh.add(clouds);
      }

      if (body.ringTexture) {
        const ringMap = this.loader.load(asset(body.ringTexture));
        ringMap.colorSpace = THREE.SRGBColorSpace;
        const ringGeometry = new THREE.RingGeometry(1.24, 2.28, 128);
        const position = ringGeometry.getAttribute("position");
        const uv = ringGeometry.getAttribute("uv");
        for (let i = 0; i < position.count; i++) {
          const radius = Math.hypot(position.getX(i), position.getY(i));
          uv.setXY(i, (radius - 1.24) / (2.28 - 1.24), .5);
        }
        const ring = new THREE.Mesh(
          ringGeometry,
          new THREE.MeshBasicMaterial({ map: ringMap, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }),
        );
        ring.rotation.x = Math.PI / 2;
        ring.name = "ring";
        mesh.add(ring);
      }

      const orbit = isSun ? null : this.buildOrbit(body.tint);
      if (orbit) this.scene.add(orbit);
      this.scene.add(pivot);
      this.placed.push({ id: body.id, pivot, mesh, orbit, body, angle: this.placed.length * 2.4 });
    }
    this.applyScale();
    this.callbacks.onReady();
  }

  private buildOrbit(tint: string) {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i += 1) {
      const a = (i / 128) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(a), 0, Math.sin(a)));
    }
    return new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: tint, transparent: true, opacity: 0.22 }),
    );
  }

  /** Re-derives every radius and orbit from the numbers for the active scale. */
  private applyScale() {
    const s = this.trueScale ? TRUE : NICE;
    for (const entry of this.placed) {
      const { body } = entry;
      const radius = (body.radiusKm / EARTH_RADIUS_KM) * (body.id === "sun" ? s.sunScale : s.planetScale);
      entry.mesh.scale.setScalar(radius);
      const distance = body.id === "sun" ? 0 : s.orbitAt(body.orbitAu);
      entry.pivot.position.set(Math.cos(entry.angle) * distance, 0, Math.sin(entry.angle) * distance);
      entry.orbit?.scale.setScalar(distance);
    }
  }

  setTrueScale(on: boolean) {
    if (this.trueScale === on) return;
    this.trueScale = on;
    this.applyScale();
    this.frame(this.selected ?? "earth");
  }

  setSelected(id: BodyId | null) {
    const changed = id !== this.selected;
    this.selected = id;
    // 천체가 바뀌면 점을 새로 걸고 열려 있던 말풍선은 닫는다. 점이 없는
    // 천체는 attach 가 빈 채로 끝나 아무것도 그리지 않는다.
    if (changed) {
      const entry = id ? this.placed.find((p) => p.id === id) : null;
      if (entry) this.hotspots.attach(entry.id, entry.mesh);
      else this.hotspots.clear();
    }
    for (const entry of this.placed) {
      if (!entry.orbit) continue;
      const material = entry.orbit.material as THREE.LineBasicMaterial;
      material.opacity = id === null ? 0.22 : entry.id === id ? 0.75 : 0.08;
    }
  }

  /** Puts one body on screen at a readable size, whatever the current scale. */
  frame(id: BodyId) {
    const entry = this.placed.find((p) => p.id === id);
    if (!entry) return;
    const radius = entry.mesh.scale.x;
    // Rings reach 2.4 radii, so they set the frame when they are present.
    const reach = entry.body.ringTexture ? radius * 2.4 : radius;
    const distance = Math.max(radius * 4.6, reach * 2.7, 0.05) * Math.max(1, 1 / this.camera.aspect);
    this.focusedDistance = distance;
    // Close enough to fill the frame with surface, and no closer — past this
    // the camera is inside the atmosphere of a photograph and there is nothing
    // more to see.
    this.controls.minDistance = Math.max(radius * 1.35, 0.02);
    const target = entry.pivot.position;
    this.controls.target.copy(target);
    // Approach from the Sun's side. The far side of a planet is genuinely dark,
    // and framing a child's first look at Earth on its night half is a waste of
    // the one texture they came to see.
    const direction = target.clone().negate().normalize();
    if (direction.lengthSq() === 0) direction.set(0, 0, 1);
    direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), .55);
    direction.y = .25;
    this.camera.position.copy(target).addScaledVector(direction.normalize(), distance);
    this.controls.update();
  }

  overview() {
    const extent = (this.trueScale ? TRUE : NICE).orbitAt(30.07);
    this.controls.minDistance = 3;
    this.controls.target.set(0, 0, 0);
    this.camera.position.set(0, extent * 1.7, extent * 2.4);
    this.camera.position.multiplyScalar(Math.max(1, 1 / this.camera.aspect));
    this.setSelected(null);
    this.controls.update();
  }

  private hit(event: PointerEvent): BodyId | null {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects(this.placed.map((p) => p.mesh), false)[0];
    return (hit?.object.userData.id as BodyId) ?? null;
  }

  private onPointerDown = (event: PointerEvent) => {
    this.pointerDown = { x: event.clientX, y: event.clientY };
    this.dragged = false;
  };

  private onPointerMove = (event: PointerEvent) => {
    if (event.buttons > 0) return;
    const id = this.hit(event);
    this.renderer.domElement.style.cursor = id ? "pointer" : "grab";
    this.callbacks.onHover(id);
  };

  private onPointerUp = (event: PointerEvent) => {
    if (Math.hypot(event.clientX - this.pointerDown.x, event.clientY - this.pointerDown.y) > 6) this.dragged = true;
    if (this.dragged) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    if (CALIBRATING && this.reportCalibration(event, rect)) return;

    // 점이 먼저다. 점은 늘 천체 표면 위에 있어 레이캐스트도 함께 맞으므로,
    // 순서가 곧 우선순위다. 뒤에 두면 점을 영영 누를 수 없다.
    const spot = this.hotspots.pick(event.clientX - rect.left, event.clientY - rect.top);
    if (spot) { this.hotspots.toggle(spot); return; }
    this.hotspots.select(null);

    const id = this.hit(event);
    if (id) this.callbacks.onPick(id);
  };

  /** 누른 자리의 위도·경도를 화면과 콘솔에 찍는다. 맞았으면 true. */
  private reportCalibration(event: PointerEvent, rect: DOMRect) {
    this.pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects(this.placed.map((p) => p.mesh), false)[0];
    if (!hit) return false;
    const mesh = hit.object as THREE.Mesh;
    const id = mesh.userData.id as BodyId;
    // 메시 로컬로 되돌리면 기울기와 자전이 함께 풀린다.
    const local = mesh.worldToLocal(hit.point.clone());
    const { lat, lon } = localToLatLon(local, LON_OFFSET_DEG[id] ?? 0);
    const text = `${id}  위도 ${lat.toFixed(2)}  동경 ${lon.toFixed(2)}  (오프셋 ${LON_OFFSET_DEG[id] ?? 0} 적용)`;
    console.log("[calib] " + text);
    if (this.calibReadout) this.calibReadout.textContent = text;
    return true;
  }

  protected onFrame(delta: number) {
    const entry = this.placed.find(entry => entry.id === this.selected);

    // 점은 고른 천체에 가까이 갔을 때만 보인다. 전체 궤도에서는 천체가
    // 몇 픽셀이라 이름표만 남는다.
    if (entry) {
      const near = this.camera.position.distanceTo(entry.pivot.position)
        <= Math.max(this.focusedDistance, entry.mesh.scale.x * 4.6) * SHOW_WITHIN;
      this.hotspots.setEnabled(near);
      this.hotspots.update(this.camera, entry.pivot.position,
        this.container.clientWidth, this.container.clientHeight);
    } else {
      this.hotspots.setEnabled(false);
    }

    // Spin rates keep the real order — a body with a shorter day turns faster —
    // but the spread is compressed so the slow ones still visibly move.
    for (const entry of this.placed) {
      const hours = entry.body.dayHours || 24;
      // ω = 0.3 / √(|dayHours| / 24). Earth still turns once every ~21 seconds,
      // the pace the rest of this scene was built around.
      //
      // Straight proportion — 0.3 / (|hours| / 24) — was true to the ratios and
      // useless to watch: Mercury took 20 minutes for one turn and Venus 84, so
      // both read as broken rather than slow. The square root pulls those to
      // 2.7 and 5.4 minutes and eases Jupiter from 9 seconds to 13, while every
      // body stays in the same order, because √ is monotonic. The ordering is
      // the claim this scene actually makes; the exact ratio is not.
      //
      // Tilts over 90° already encode retrograde rotation; do not reverse twice.
      entry.mesh.rotation.y += (delta * 0.3) / Math.sqrt(Math.abs(hours) / 24);
      const clouds = entry.mesh.getObjectByName("clouds");
      if (clouds) clouds.rotation.y += delta * 0.008;
    }
  }

  /** 이 무대가 자기 몫으로 붙인 것만 치우고 나머지는 base 에 맡긴다. */
  override dispose() {
    const canvas = this.renderer.domElement;
    canvas.removeEventListener("pointerdown", this.onPointerDown);
    canvas.removeEventListener("pointerup", this.onPointerUp);
    canvas.removeEventListener("pointermove", this.onPointerMove);
    this.hotspots.dispose();
    this.calibReadout?.remove();
    super.dispose();
  }
}
