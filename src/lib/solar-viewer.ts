import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { AU_KM, bodies } from "../data/planets";
import type { Body, BodyId } from "../data/types";
import { asset } from "./asset";

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
 * What is drawn is the outside of each body and nothing else: the photographed
 * surface, the clouds over it where there are any, and Saturn's rings. The
 * interior was drawn here once, as shells cut open by a wedge that followed the
 * camera; it is gone, and what replaces it is not a rendering problem.
 */

type Callbacks = {
  onPick: (id: BodyId | null) => void;
  onHover: (id: BodyId | null) => void;
  onReady: () => void;
};

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
};

export class SolarViewer {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(38, 1, 0.01, 5e7);
  private controls: OrbitControls;
  private loader = new THREE.TextureLoader();
  private callbacks: Callbacks;
  private container: HTMLElement;

  private placed: Placed[] = [];
  private selected: BodyId | null = null;
  private trueScale = false;

  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private pointerDown = { x: 0, y: 0 };
  private dragged = false;

  private composer!: EffectComposer;
  private raf = 0;
  private disposed = false;
  private clock = new THREE.Clock();
  private resizeObserver: ResizeObserver;

  constructor(container: HTMLElement, callbacks: Callbacks) {
    this.container = container;
    this.callbacks = callbacks;

    const lowPower = window.matchMedia("(max-width: 780px)").matches;
    this.renderer = new THREE.WebGLRenderer({ antialias: !lowPower, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.5 : 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.domElement.setAttribute("aria-label", "3D solar system");
    this.renderer.domElement.tabIndex = 0;
    container.appendChild(this.renderer.domElement);

    this.camera.position.set(0, 90, 210);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    // Slow on purpose. The distances here run from a body's own radius to
    // thirty astronomical units, and at the default speed one flick of the
    // wheel crosses more of that than a child can follow.
    this.controls.zoomSpeed = 0.25;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 4e6;

    // The Sun is the only light source, which is also the reason a planet's far
    // side is dark — worth seeing rather than lighting away with ambient fill.
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.06));
    const sunLight = new THREE.PointLight(0xfff2e0, 3.4, 0, 0);
    this.scene.add(sunLight);

    this.buildStars();
    this.build();
    this.buildComposer();

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    const canvas = this.renderer.domElement;
    canvas.addEventListener("pointerdown", this.onPointerDown);
    canvas.addEventListener("pointerup", this.onPointerUp);
    canvas.addEventListener("pointermove", this.onPointerMove);

    this.resize();
    this.animate();
  }

  /**
   * Bloom on a high threshold, so only what is genuinely incandescent spills
   * light — which is now the Sun alone. Bloom applied broadly is what makes a
   * scene look like a screensaver.
   */
  private buildComposer() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.62, 0.5, 0.72));
    this.composer.addPass(new OutputPass());
  }

  /** The real Milky Way, on the inside of a very large sphere. */
  private buildStars() {
    const texture = this.loader.load(asset("/textures/stars_milky_way.jpg"));
    texture.colorSpace = THREE.SRGBColorSpace;
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(2e6, 48, 32),
      new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide, depthWrite: false }),
    );
    sky.name = "sky";
    this.scene.add(sky);
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

      const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), material);
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
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(1.24, 2.28, 96),
          new THREE.MeshBasicMaterial({ map: ringMap, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }),
        );
        ring.rotation.x = Math.PI / 2;
        ring.name = "ring";
        mesh.add(ring);
      }

      const orbit = isSun ? null : this.buildOrbit(body.tint);
      if (orbit) this.scene.add(orbit);
      this.scene.add(pivot);
      this.placed.push({ id: body.id, pivot, mesh, orbit, body });
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
      const distance = s.orbitAt(body.orbitAu);
      entry.pivot.position.set(distance, 0, 0);
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
    this.selected = id;
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
    const distance = Math.max(radius * 4.6, reach * 2.7, 0.05);
    // Close enough to fill the frame with surface, and no closer — past this
    // the camera is inside the atmosphere of a photograph and there is nothing
    // more to see.
    this.controls.minDistance = Math.max(radius * 1.35, 0.02);
    const target = entry.pivot.position;
    this.controls.target.copy(target);
    // Approach from the Sun's side. The far side of a planet is genuinely dark,
    // and framing a child's first look at Earth on its night half is a waste of
    // the one texture they came to see.
    const towardSun = target.x >= 0 ? -1 : 1;
    this.camera.position.set(
      target.x + towardSun * distance * 0.42,
      radius * 0.3 + distance * 0.16,
      target.z + distance * 0.88,
    );
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
    const id = this.hit(event);
    if (id) this.callbacks.onPick(id);
  };

  private resize() {
    const rect = this.container.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    this.renderer.setSize(width, height, false);
    this.composer?.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private animate = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();
    // Spin rates are the real ones, scaled to a pace a child can watch: a body
    // with a shorter day visibly turns faster, which is the point.
    for (const entry of this.placed) {
      const hours = entry.body.dayHours || 24;
      // Earth turns once every ~21 seconds here. Anything faster reads as a
      // spinning top rather than a planet, and it makes a surface impossible
      // to look at.
      entry.mesh.rotation.y += ((delta * 0.3) / (Math.abs(hours) / 24)) * Math.sign(hours);
      const clouds = entry.mesh.getObjectByName("clouds");
      if (clouds) clouds.rotation.y += delta * 0.008;
    }
    this.controls.update();
    this.composer.render();
  };

  /**
   * 이 뷰어가 잡고 있던 것을 전부 놓는다.
   *
   * `renderer.dispose()` 만으로는 부족하다. 그것은 렌더러가 만든 프로그램과
   * 렌더 목록을 비울 뿐, WebGL 컨텍스트 자체도 장면에 매달린 지오메트리와
   * 텍스처도 그대로 남는다. 층을 스무 번 오가며 재 봤더니 브라우저가
   * "Too many active WebGL contexts. Oldest context will be lost." 를
   * 되풀이해 찍었다 — 컨텍스트가 쌓이다 가장 오래된 것부터 강제로 끊기고
   * 있었다는 뜻이다.
   *
   * 그래서 둘을 더한다. 장면을 훑어 지오메트리·재질·텍스처를 하나씩 놓고
   * (텍스처만 6 MB 다), 마지막에 `forceContextLoss()` 로 컨텍스트를 실제로
   * 반납한다.
   */
  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    const canvas = this.renderer.domElement;
    canvas.removeEventListener("pointerdown", this.onPointerDown);
    canvas.removeEventListener("pointerup", this.onPointerUp);
    canvas.removeEventListener("pointermove", this.onPointerMove);
    this.controls.dispose();

    this.scene.traverse((object) => {
      const mesh = object as Partial<THREE.Mesh>;
      mesh.geometry?.dispose();
      for (const material of [mesh.material].flat()) {
        if (!material) continue;
        // 재질이 들고 있는 맵은 재질을 놓는다고 함께 놓이지 않는다.
        for (const value of Object.values(material)) {
          if (value instanceof THREE.Texture) value.dispose();
        }
        material.dispose();
      }
    });
    this.scene.clear();

    this.composer?.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    canvas.remove();
  }
}
