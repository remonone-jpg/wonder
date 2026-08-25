import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { AU_KM, bodies, type Body, type BodyId } from "../data/planets";
import { layers, type Layer, type Material } from "../data/layers";

/**
 * The solar system rendered from its real numbers.
 *
 * The one decision that matters here is scale. At true scale the planets are
 * invisible specks strung along an empty line — which is the honest picture,
 * and worth showing once — so the default view keeps the real *ratios* between
 * planets while compressing the Sun and the orbital distances that would
 * otherwise push everything off screen. `setTrueScale` swaps between them, and
 * the jump between the two is the lesson.
 */

type Callbacks = {
  onPick: (id: BodyId | null) => void;
  onHover: (id: BodyId | null) => void;
  onReady: () => void;
  /** Fires as zooming opens the planet and a new layer comes into view. */
  onLayer: (layer: Layer | null) => void;
};

/**
 * Zooming in cuts a quarter out of the body and reveals what it is made of,
 * shell by shell. Distances are in multiples of the body's own radius, so the
 * same numbers work for Mercury and for the Sun.
 */
/**
 * The cut has to finish opening while the whole body is still in frame. At a
 * distance of d radii a sphere subtends asin(1/d); with this camera's 38° that
 * means staying beyond ~3.1 radii, or the planet overflows the view and all
 * you see is surface.
 */
/**
 * The descent runs over a short span of distance, not a long one. Pushing the
 * opening far out to buy more zoom travel left the planet a speck on arrival,
 * which reads as nothing having loaded. Travel comes from a slow wheel instead.
 */
const CUTAWAY_START = 4.4;
const CUTAWAY_FULL = 3.2;

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

/**
 * Where each shell is drawn, as a fraction of the body's radius.
 *
 * True radii cannot be used directly. Earth's ocean is 3.7km of 6371 — 0.06%
 * — and its crust 0.4%; drawn honestly they are thinner than a pixel and the
 * descent the child is being promised does not exist. So thickness on screen
 * is a compressed function of real thickness: order and rough proportion
 * survive, thin layers become visible, and the true figure stays on the card
 * beside it. The surface stays pinned at 1.0 so the cut lines up with the
 * photographed globe, and anything above it gets its own band outside.
 */
function displayRadii(layerSet: Layer[], radiusKm: number): number[] {
  const COMPRESSION = 0.35;
  const SKY_BAND = 0.17;
  const weight = (l: Layer) => Math.pow(Math.max(l.outerKm - l.innerKm, 1e-3), COMPRESSION);

  const above = layerSet.filter((l) => l.innerKm >= radiusKm);
  const below = layerSet.filter((l) => l.innerKm < radiusKm);
  const radii: number[] = [];

  const aboveTotal = above.reduce((sum, l) => sum + weight(l), 0) || 1;
  let cursor = 1 + SKY_BAND;
  for (const l of above) {
    radii.push(cursor);
    cursor -= (weight(l) / aboveTotal) * SKY_BAND;
  }

  const belowTotal = below.reduce((sum, l) => sum + weight(l), 0) || 1;
  cursor = 1;
  for (const l of below) {
    radii.push(cursor);
    cursor -= weight(l) / belowTotal;
  }
  return radii;
}

type PlacedLayer = {
  layer: Layer;
  mesh: THREE.Mesh;
  material: THREE.MeshStandardMaterial;
  /** Maps that drift, so molten rock reads as moving rather than painted. */
  flow: THREE.Texture[];
  /** Air sits outside the globe, so it has to stay faint or it hides it. */
  maxOpacity: number;
};

/**
 * Bodies with enough air to catch light at the limb, and the colour that
 * survives the trip through it: nitrogen scatters blue on Earth, sulphuric
 * acid burns yellow on Venus, methane leaves only cyan on the ice giants.
 */
const ATMOSPHERE: Partial<Record<BodyId, string>> = {
  venus: "#f0cf85",
  earth: "#6ba8ff",
  jupiter: "#e6cfa0",
  saturn: "#f0dcb8",
  uranus: "#8fe0f0",
  neptune: "#6f97ff",
};

/**
 * A limb glow drawn on the inside of a slightly larger sphere, so it shows
 * only where the surface curves away. Air glows where light passes through it,
 * so the night limb stays dark and what remains is the thin bright arc between
 * the two — the cue that says "world with an atmosphere" rather than "ball".
 */
function atmosphereMaterial(color: string, clip: THREE.Plane[]) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      /** The body's centre, so the shader knows which way is up. */
      uCenter: { value: new THREE.Vector3() },
    },
    vertexShader: `
      varying vec3 vWorld;
      varying vec3 vView;
      varying vec3 vNormalView;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorld = world.xyz;
        vec4 viewPosition = viewMatrix * world;
        vView = normalize(-viewPosition.xyz);
        vNormalView = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform vec3 uCenter;
      varying vec3 vWorld;
      varying vec3 vView;
      varying vec3 vNormalView;
      void main() {
        vec3 up = normalize(vWorld - uCenter);
        // Soft on purpose: a sharp exponent draws an outline, and an outline
        // is exactly what an atmosphere is not.
        float rim = 1.0 - abs(dot(normalize(vNormalView), normalize(vView)));
        float band = smoothstep(0.15, 0.92, rim);
        // The Sun is at the origin, so this is simply which way the Sun is.
        float lit = smoothstep(-0.32, 0.30, dot(up, normalize(-vWorld)));
        gl_FragColor = vec4(uColor, band * lit * 0.55);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false,
    clippingPlanes: clip,
    clipIntersection: true,
  });
}

/**
 * How each kind of shell is built. `maps` names a photographed CC0 material;
 * `glow` is how much of its own light the layer gives off, which is the whole
 * difference between a pastel disc and iron at five thousand degrees.
 *
 * `repeat` tiles the map across the sphere — a single 1K texture stretched over
 * a whole planet reads as a smear, and at this scale the eye wants grain, not
 * a map.
 */
const MATERIALS: Record<Material, { maps: string | null; glow: number; roughness: number; metalness: number; repeat: [number, number] }> = {
  water:  { maps: "water", glow: 0.10, roughness: 0.14, metalness: 0,   repeat: [5, 3] },
  sand:   { maps: "sand", glow: 0.03, roughness: 0.98, metalness: 0,    repeat: [9, 4] },
  deeprock: { maps: "deeprock", glow: 0.12, roughness: 0.92, metalness: 0, repeat: [6, 3] },
  rock:   { maps: "rock", glow: 0.05, roughness: 0.95, metalness: 0,    repeat: [7, 3] },
  molten: { maps: "lava", glow: 1.30, roughness: 0.62, metalness: 0,    repeat: [5, 3] },
  // Metalness without an environment map only darkens a surface — there is
  // nothing for it to reflect. Iron at 5000°C reads through its own glow.
  metal:  { maps: "iron", glow: 1.55, roughness: 0.38, metalness: 0.12, repeat: [4, 2] },
  ice:    { maps: "rock", glow: 0.20, roughness: 0.34, metalness: 0,    repeat: [6, 3] },
  gas:    { maps: null,   glow: 0.10, roughness: 1.0,  metalness: 0,    repeat: [1, 1] },
  plasma: { maps: "lava", glow: 2.60, roughness: 0.55, metalness: 0,    repeat: [4, 2] },
};

type Placed = {
  id: BodyId;
  pivot: THREE.Group;
  mesh: THREE.Mesh;
  orbit: THREE.Line | null;
  body: Body;
  layers: PlacedLayer[];
  /** Clips the same quarter out of the surface and every shell above the core. */
  clip: [THREE.Plane, THREE.Plane];
};

export class SolarViewer {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(38, 1, 0.01, 5e7);
  private controls: OrbitControls;
  private loader = new THREE.TextureLoader();
  /** One texture per file, shared by every shell that asks for it. */
  private mapCache = new Map<string, THREE.Texture>();
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
  private openLayer: Layer | null = null;
  /** Which way the wedge faces, eased so orbiting does not snap it around. */
  private wedgeDir = new THREE.Vector3(0, 0, 1);
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
    this.renderer.localClippingEnabled = true;
    this.renderer.domElement.setAttribute("aria-label", "3D solar system");
    this.renderer.domElement.tabIndex = 0;
    container.appendChild(this.renderer.domElement);

    this.camera.position.set(0, 90, 210);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    // Slow, because the descent is the content: nine layers over this span
    // takes about twenty-five turns of the wheel. At the default speed a child
    // crosses all of them in three flicks and sees none.
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
   * light: the Sun, and a core once its planet is opened. Bloom applied broadly
   * is what makes a scene look like a screensaver.
   */
  private buildComposer() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.62, 0.5, 0.72));
    this.composer.addPass(new OutputPass());
  }

  /**
   * Loads a material map once and hands out clones, because the repeat count
   * differs per layer and `repeat` lives on the texture rather than the
   * material — sharing the object outright would let one shell retile another.
   */
  private materialMap(name: string, kind: "color" | "normal" | "rough", repeat: [number, number]) {
    const key = `${name}_${kind}`;
    let base = this.mapCache.get(key);
    if (!base) {
      base = this.loader.load(`/textures/materials/${key}.jpg`);
      if (kind === "color") base.colorSpace = THREE.SRGBColorSpace;
      this.mapCache.set(key, base);
    }
    const texture = base.clone();
    texture.needsUpdate = true;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeat[0], repeat[1]);
    return texture;
  }

  /** The real Milky Way, on the inside of a very large sphere. */
  private buildStars() {
    const texture = this.loader.load("/textures/stars_milky_way.jpg");
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
      const map = this.loader.load(body.texture);
      map.colorSpace = THREE.SRGBColorSpace;

      const isSun = body.id === "sun";
      // Two planes cutting a right-angle wedge. `clipIntersection` keeps the
      // union of the half-spaces, so the corner where both fail is what gets
      // removed — a quarter out of the body rather than a half.
      const clip: [THREE.Plane, THREE.Plane] = [
        new THREE.Plane(new THREE.Vector3(1, 0, 0), 1e6),
        new THREE.Plane(new THREE.Vector3(0, 0, 1), 1e6),
      ];
      const material = isSun
        // The Sun makes its own light, so it must not be lit by any.
        ? new THREE.MeshBasicMaterial({ map, clippingPlanes: clip, clipIntersection: true, side: THREE.DoubleSide })
        : new THREE.MeshStandardMaterial({ map, roughness: 1, metalness: 0, clippingPlanes: clip, clipIntersection: true, side: THREE.DoubleSide });

      const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), material);
      mesh.rotation.z = THREE.MathUtils.degToRad(body.tiltDeg);
      mesh.userData.id = body.id;
      pivot.add(mesh);

      if (body.cloudTexture) {
        const cloudMap = this.loader.load(body.cloudTexture);
        cloudMap.colorSpace = THREE.SRGBColorSpace;
        const clouds = new THREE.Mesh(
          new THREE.SphereGeometry(1.012, 48, 32),
          new THREE.MeshStandardMaterial({ map: cloudMap, transparent: true, opacity: 0.62, depthWrite: false }),
        );
        clouds.name = "clouds";
        mesh.add(clouds);
      }

      if (body.ringTexture) {
        const ringMap = this.loader.load(body.ringTexture);
        ringMap.colorSpace = THREE.SRGBColorSpace;
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(1.24, 2.28, 96),
          new THREE.MeshBasicMaterial({ map: ringMap, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }),
        );
        ring.rotation.x = Math.PI / 2;
        ring.name = "ring";
        mesh.add(ring);
      }

      // Shells live inside the surface mesh, so they inherit its scale: every
      // radius below is a fraction of the body's own, which keeps the crust as
      // thin on screen as it really is.
      const placedLayers: PlacedLayer[] = [];
      const shellRadii = displayRadii(layers[body.id], body.radiusKm);
      for (const [layerIndex, layer] of layers[body.id].entries()) {
        const spec = MATERIALS[layer.material];
        const tint = new THREE.Color(layer.color);
        // A shell drawn outside the surface would otherwise sit in front of
        // the photographed globe — a second, blank planet over the real one.
        const aboveSurface = layer.innerKm >= body.radiusKm;
        const layerMaterial = new THREE.MeshStandardMaterial({
          // The tint stays as a multiplier over the photograph, so lava reads
          // as this planet's mantle rather than as a stock texture.
          color: tint,
          map: aboveSurface ? null : spec.maps ? this.materialMap(spec.maps, "color", spec.repeat) : map,
          normalMap: aboveSurface || !spec.maps ? null : this.materialMap(spec.maps, "normal", spec.repeat),
          roughnessMap: aboveSurface || !spec.maps ? null : this.materialMap(spec.maps, "rough", spec.repeat),
          normalScale: new THREE.Vector2(1.1, 1.1),
          roughness: spec.roughness,
          metalness: spec.metalness,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0,
          // The innermost shell is a solid ball and is never cut — otherwise
          // the centre of the planet would be missing.
          clippingPlanes: layer.innerKm === 0 ? [] : clip,
          clipIntersection: true,
          // A core lit only from the Sun outside would sit in permanent
          // shadow. It is at thousands of degrees; it should be its own light.
          emissive: tint,
          emissiveIntensity: spec.glow,
          emissiveMap: aboveSurface || !spec.maps ? null : this.materialMap(spec.maps, "color", spec.repeat),
        });
        // A shell sharing a radius with the textured surface z-fights into
        // confetti; a 0.2% inset is below the eye's resolution and resolves it.
        const shell = new THREE.Mesh(
          new THREE.SphereGeometry(shellRadii[layerIndex] * 0.998, 48, 32),
          layerMaterial,
        );
        shell.visible = false;
        mesh.add(shell);
        // Only what is genuinely fluid drifts. Rock or metal creeping would
        // read as a texture sliding over a shape, which is worse than still.
        const fluid = layer.material === "molten" || layer.material === "plasma";
        placedLayers.push({
          layer,
          mesh: shell,
          material: layerMaterial,
          flow: fluid
            ? ([layerMaterial.map, layerMaterial.normalMap, layerMaterial.emissiveMap].filter(Boolean) as THREE.Texture[])
            : [],
          maxOpacity: aboveSurface ? 0.16 : 1,
        });
      }

      const atmosphereColor = ATMOSPHERE[body.id];
      if (atmosphereColor) {
        const halo = new THREE.Mesh(
          new THREE.SphereGeometry(1.09, 48, 32),
          atmosphereMaterial(atmosphereColor, clip),
        );
        halo.name = "atmosphere";
        mesh.add(halo);
      }

      const orbit = isSun ? null : this.buildOrbit(body.tint);
      if (orbit) this.scene.add(orbit);
      this.scene.add(pivot);
      this.placed.push({ id: body.id, pivot, mesh, orbit, body, layers: placedLayers, clip });
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
      const halo = entry.mesh.getObjectByName("atmosphere") as THREE.Mesh | undefined;
      if (halo) (halo.material as THREE.ShaderMaterial).uniforms.uCenter.value.copy(entry.pivot.position);
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
    // Saturn's rings reach 2.3 radii, so a distance tuned to the globe alone
    // crops them; the widest thing attached to the body sets the frame.
    // Rings reach 2.4 radii, so they set the frame when they are present.
    const reach = entry.body.ringTexture ? radius * 2.4 : radius;
    // Just outside the opening, so the body arrives whole and filling the
    // frame, and the first turn of the wheel starts the descent.
    const distance = Math.max(radius * 4.6, reach * 2.7, 0.05);
    // Zooming in is how the body opens, so the near limit is the point where
    // the cut is fully open and still wholly visible.
    this.controls.minDistance = Math.max(radius * CUTAWAY_FULL * 0.97, 0.02);
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

      // Convection, at a pace that reads as slow churning rather than
      // scrolling. Colour and relief drift at different rates, which is what
      // stops it looking like one sheet sliding past.
      for (const placed of entry.layers) {
        if (!placed.mesh.visible) continue;
        placed.flow.forEach((texture, index) => {
          texture.offset.x += delta * (0.01 + index * 0.004);
          texture.offset.y += delta * (0.004 + index * 0.002);
        });
      }
    }
    this.updateCutaway();
    this.controls.update();
    this.composer.render();
  };

  /**
   * Opens the selected body as the camera closes in. The wedge widens first,
   * then each shell fades in from the outside, so the descent reads as
   * ground, then rock, then molten iron, then the core.
   */
  private updateCutaway() {
    const entry = this.placed.find((p) => p.id === this.selected);
    if (!entry) return;

    const radius = entry.mesh.scale.x;
    const distance = this.camera.position.distanceTo(entry.pivot.position) / Math.max(radius, 1e-6);
    const t = THREE.MathUtils.clamp(
      (CUTAWAY_START - distance) / (CUTAWAY_START - CUTAWAY_FULL),
      0,
      1,
    );

    // The wedge has to be cut out of the side facing the viewer, or the body
    // opens away from them and looks untouched. It follows the camera around
    // the orbit, eased so the cut does not snap from one side to the other.
    const toCamera = new THREE.Vector3()
      .subVectors(this.camera.position, entry.pivot.position)
      .setY(0);
    if (toCamera.lengthSq() > 1e-9) {
      this.wedgeDir.lerp(toCamera.normalize(), 0.08).normalize();
    }

    // With `clipIntersection`, a fragment survives if it passes either plane,
    // so what is removed is the corner where both fail. Placing the two normals
    // 45° either side of the direction *away* from the camera puts that corner
    // squarely between the viewer and the centre.
    const away = this.wedgeDir.clone().negate();
    const rotateY = (v: THREE.Vector3, angle: number) =>
      new THREE.Vector3(
        v.x * Math.cos(angle) + v.z * Math.sin(angle),
        0,
        -v.x * Math.sin(angle) + v.z * Math.cos(angle),
      );
    const normals = [rotateY(away, Math.PI / 4), rotateY(away, -Math.PI / 4)];

    // Planes are in world space, so the constant carries the body's own orbit.
    const offset = THREE.MathUtils.lerp(radius * 1.4, 0, t);
    normals.forEach((normal, index) => {
      entry.clip[index].set(normal, -normal.dot(entry.pivot.position) + offset);
    });

    let deepest: Layer | null = null;
    entry.layers.forEach((placed, index) => {
      // Each shell claims a slice of the remaining zoom, so they arrive in order.
      const from = 0.25 + (index / entry.layers.length) * 0.7;
      const to = from + 0.7 / entry.layers.length;
      const fade = THREE.MathUtils.clamp((t - from) / Math.max(to - from, 1e-6), 0, 1) * placed.maxOpacity;
      placed.material.opacity = fade;
      placed.mesh.visible = fade > 0.01;
      if (fade > 0.55 * placed.maxOpacity) deepest = placed.layer;
    });

    // Only the bodies that are not selected keep their wedge shut.
    for (const other of this.placed) {
      if (other.id === entry.id) continue;
      other.clip[0].constant = 1e6;
      other.clip[1].constant = 1e6;
      for (const placed of other.layers) placed.mesh.visible = false;
    }

    if (deepest !== this.openLayer) {
      this.openLayer = deepest;
      this.callbacks.onLayer(deepest);
    }
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    const canvas = this.renderer.domElement;
    canvas.removeEventListener("pointerdown", this.onPointerDown);
    canvas.removeEventListener("pointerup", this.onPointerUp);
    canvas.removeEventListener("pointermove", this.onPointerMove);
    this.controls.dispose();
    this.composer?.dispose();
    this.renderer.dispose();
    canvas.remove();
  }
}
