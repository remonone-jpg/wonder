import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { ViewerBase } from "./viewer-base";
import { asset } from "./asset";
import type { InteriorLayer, InteriorStage } from "./interior-stages";

function detailTexture(size: number) {
  const pixels = new Uint8Array(size * size);
  const hash = (x: number, y: number) => {
    let value = Math.imul(x + 71, 374761393) ^ Math.imul(y + 139, 668265263);
    value = Math.imul(value ^ (value >>> 13), 1274126177);
    return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
  };
  const noise = (x: number, y: number, cells: number) => {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix, fy = y - iy;
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
    const a = hash(ix % cells, iy % cells), b = hash((ix + 1) % cells, iy % cells);
    const c = hash(ix % cells, (iy + 1) % cells), d = hash((ix + 1) % cells, (iy + 1) % cells);
    return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy;
  };
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      pixels[y * size + x] = Math.round(255 * (
        noise(x / size * 4, y / size * 4, 4) * 0.5 +
        noise(x / size * 16, y / size * 16, 16) * 0.3 +
        noise(x / size * 64, y / size * 64, 64) * 0.2
      ));
    }
  }
  const texture = new THREE.DataTexture(pixels, size, size, THREE.RedFormat);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

function cutSphere(radius: number, segments: number) {
  const parts = [0, 1].map(half => {
    const part = new THREE.SphereGeometry(radius, segments, segments / 4, 0, Math.PI * 2, half * Math.PI / 2, Math.PI / 2);
    const uv = part.getAttribute("uv");
    for (let index = 0; index < uv.count; index++) uv.setY(index, uv.getY(index) * 0.5 + (1 - half) * 0.5);
    part.setAttribute("cutMask", new THREE.BufferAttribute(new Float32Array(uv.count).fill(1 - half), 1));
    return part;
  });
  const geometry = mergeGeometries(parts)!;
  for (const part of parts) part.dispose();
  return geometry;
}

export class InteriorViewer extends ViewerBase {
  private shells: { cut: { value: number }; caps: THREE.Mesh[]; top: THREE.Mesh; profile: Float32Array }[] = [];
  private depthMaterials: THREE.MeshDepthMaterial[] = [];
  private detail: THREE.DataTexture;
  private environment: THREE.WebGLRenderTarget;
  private globe = new THREE.Group();
  private key = new THREE.DirectionalLight(0xfff0dc, 2.8);

  constructor(
    container: HTMLElement,
    layers: readonly InteriorLayer[],
    progress = 0.66,
    bodyId?: InteriorStage["bodyId"],
  ) {
    const sorted = [...layers].sort((a, b) => a.radiusKm - b.radiusKm);
    if (!sorted.length || sorted.some((layer, index) =>
      !Number.isFinite(layer.radiusKm) || layer.radiusKm <= 0 ||
      !Number.isInteger(layer.color) || layer.color < 0 || layer.color > 0xffffff ||
      (index > 0 && layer.radiusKm === sorted[index - 1].radiusKm)
    )) throw new RangeError();

    super(container, {
      sky: false, near: 0.1, far: 100, fov: 36,
      cameraAt: [5.4, 3.2, 5.4], minDistance: 4.5, maxDistance: 18, ariaLabel: "",
      bloom: { strength: 0.24, radius: 0.5, threshold: 1.15 },
    });
    Object.assign(this.renderer.domElement.style, { display: "block", width: "100%", height: "100%" });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.scene.background = new THREE.Color(0x03060d);
    this.controls.enablePan = false;
    this.detail = detailTexture(256);
    const room = new RoomEnvironment();
    const generator = new THREE.PMREMGenerator(this.renderer);
    this.environment = generator.fromScene(room, 0.08, 0.1, 100, { size: this.lowPower ? 128 : 256 });
    this.scene.environment = this.environment.texture;
    this.scene.environmentIntensity = 0.3;
    room.traverse(object => { if ((object as THREE.InstancedMesh).isInstancedMesh) (object as THREE.InstancedMesh).dispose(); });
    room.dispose();
    generator.dispose();
    this.scene.add(new THREE.HemisphereLight(0xb2caff, 0x160a05, 0.1));
    this.key.position.set(-4, 6, 7);
    this.key.castShadow = true;
    this.key.shadow.mapSize.setScalar(this.lowPower ? 1024 : 2048);
    Object.assign(this.key.shadow.camera, { left: -2.8, right: 2.8, top: 2.8, bottom: -2.8, near: 0.5, far: 20 });
    this.key.shadow.bias = -0.00025;
    this.key.shadow.normalBias = 0.012;
    this.key.shadow.radius = 2;
    const rim = new THREE.DirectionalLight(0x7baaff, 1.3);
    rim.position.set(4, 1, -4);
    const fill = new THREE.DirectionalLight(0xffbc72, 0.35);
    fill.position.set(2, -3, 5);
    this.scene.add(this.key, rim, fill);
    this.globe.rotation.set(0.05, 0, -0.28);
    this.scene.add(this.globe);

    const exterior = bodyId ? this.loader.load(
      asset(`/textures/${bodyId === "earth" ? "earth_daymap" : bodyId}.jpg`),
    ) : null;
    if (exterior) {
      exterior.colorSpace = THREE.SRGBColorSpace;
      exterior.wrapS = THREE.RepeatWrapping;
      exterior.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
    }

    const segments = this.lowPower ? 64 : 128;
    const maximum = sorted[sorted.length - 1].radiusKm;
    for (let index = 0; index < sorted.length; index++) {
      const layer = sorted[index];
      const outer = layer.radiusKm / maximum * 2;
      const inner = index === 0 ? 0 : sorted[index - 1].radiusKm / maximum * 2;
      const cut = { value: 0 };
      const isExterior = index === sorted.length - 1;
      const metalness = index === 0 ? 0.55 : index === 1 ? 0.22 : 0.04;
      const heat = isExterior ? 0.015 : index === 0 ? 1.5 / (1 + outer * outer * 2) : index === 1 ? 0.55 : 0.07;
      const fluid = bodyId === "jupiter" || bodyId === "saturn" || layer.id === "outer-core" || layer.id === "molten-silicate";
      const material = this.layerMaterial(layer.color, inner, outer, metalness, false, heat, fluid);
      if (isExterior && exterior) {
        material.map = exterior;
        material.color.set(0xffffff);
        material.roughness = bodyId === "earth" ? 0.5 : 0.85;
        material.metalness = 0;
        material.emissiveIntensity = 0;
        material.envMapIntensity = 0.25;
      }
      const decorate = material.onBeforeCompile.bind(material);
      material.onBeforeCompile = (shader, renderer) => {
        decorate(shader, renderer);
        if (isExterior && bodyId === "earth") {
          shader.fragmentShader = shader.fragmentShader.replace("#include <roughnessmap_fragment>", `
            #include <roughnessmap_fragment>
            float ocean = smoothstep(0.015, 0.12, diffuseColor.b - max(diffuseColor.r, diffuseColor.g));
            roughnessFactor = mix(0.92, 0.28, ocean);
          `);
        }
        shader.uniforms.uCut = cut;
        shader.vertexShader = `attribute float cutMask; uniform float uCut;\n${shader.vertexShader}`
          .replace("#include <uv_vertex>", `
            float phi = 1.57079632679 + uCut * cutMask * 0.5 + uv.x * (6.28318530718 - uCut * cutMask);
            float theta = (1.0 - uv.y) * 3.14159265359;
            vec3 direction = vec3(-cos(phi) * sin(theta), cos(theta), sin(phi) * sin(theta));
            #include <uv_vertex>
            #ifdef USE_MAP
              vMapUv = (mapTransform * vec3(phi / 6.28318530718, uv.y, 1.0)).xy;
            #endif
          `)
          .replace("#include <beginnormal_vertex>", "vec3 objectNormal = direction;")
          .replace("#include <begin_vertex>", "vec3 transformed = direction * length(position);");
      };
      material.customProgramCacheKey = () => `interior-surface-v3-${isExterior && !!exterior}`;
      const depth = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
      depth.onBeforeCompile = shader => {
        shader.uniforms.uCut = cut;
        shader.vertexShader = `attribute float cutMask; uniform float uCut;\n${shader.vertexShader}`.replace("#include <begin_vertex>", `
          float phi = 1.57079632679 + uCut * cutMask * 0.5 + uv.x * (6.28318530718 - uCut * cutMask);
          float theta = (1.0 - uv.y) * 3.14159265359;
          vec3 transformed = length(position) * vec3(-cos(phi) * sin(theta), cos(theta), sin(phi) * sin(theta));
        `);
      };
      depth.customProgramCacheKey = () => "interior-depth-v2";
      this.depthMaterials.push(depth);
      const surface = new THREE.Mesh(cutSphere(outer, segments), material);
      surface.name = layer.id;
      surface.castShadow = surface.receiveShadow = true;
      surface.customDepthMaterial = depth;
      this.globe.add(surface);

      const caps: THREE.Mesh[] = [];
      for (let side = 0; side < 2; side++) {
        const geometry = new THREE.RingGeometry(inner, outer, segments / 4, 1, 0, Math.PI / 2);
        if (side === 1) {
          const indices = geometry.index!;
          for (let index = 0; index < indices.count; index += 3) {
            const swap = indices.getX(index);
            indices.setX(index, indices.getX(index + 2));
            indices.setX(index + 2, swap);
          }
          const normals = geometry.getAttribute("normal");
          for (let index = 0; index < normals.count; index++) normals.setZ(index, -1);
        }
        const face = new THREE.Mesh(
          geometry,
          this.layerMaterial(layer.color, inner, outer, metalness, true, heat, fluid),
        );
        face.name = layer.id;
        face.castShadow = face.receiveShadow = true;
        caps.push(face);
        this.globe.add(face);
      }
      const topGeometry = new THREE.RingGeometry(inner, outer, segments / 2, 1, 0, Math.PI);
      const positions = topGeometry.getAttribute("position");
      const normals = topGeometry.getAttribute("normal");
      const profile = new Float32Array(positions.count * 2);
      for (let index = 0; index < positions.count; index++) {
        const x = positions.getX(index), y = positions.getY(index);
        profile[index * 2] = Math.hypot(x, y);
        profile[index * 2 + 1] = index % (segments / 2 + 1) / (segments / 2);
        normals.setXYZ(index, 0, 1, 0);
      }
      topGeometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), outer);
      const top = new THREE.Mesh(topGeometry, this.layerMaterial(layer.color, inner, outer, metalness, true, heat, fluid));
      top.castShadow = top.receiveShadow = true;
      this.globe.add(top);
      this.shells.push({ cut, caps, top, profile });
    }
    const outerCut = this.shells[this.shells.length - 1].cut;
    if (bodyId === "earth") this.buildAir(outerCut);
    if (bodyId === "saturn") {
      this.buildRing();
      this.camera.position.multiplyScalar(1.55);
    }
    this.setCut(Number.isFinite(progress) ? progress : 0);
    this.start();
  }

  private layerMaterial(color: number, inner: number, outer: number, metalness: number, cap: boolean, heat: number, fluid: boolean) {
    const material = new THREE.MeshStandardMaterial({
      color, roughness: 0.9 - metalness * 0.72, metalness,
      emissive: color, emissiveIntensity: heat,
      side: cap ? THREE.DoubleSide : THREE.FrontSide,
    });
    material.onBeforeCompile = shader => {
      shader.uniforms.uDetail = { value: this.detail };
      shader.uniforms.uRadii = { value: new THREE.Vector2(inner, outer) };
      shader.uniforms.uCap = { value: cap ? 1 : 0 };
      shader.uniforms.uFluid = { value: fluid ? 1 : 0 };
      shader.vertexShader = `varying vec3 vInterior;\n${shader.vertexShader}`
        .replace("#include <project_vertex>", "vInterior = (modelMatrix * vec4(transformed, 1.0)).xyz;\n#include <project_vertex>");
      shader.fragmentShader = `
        uniform sampler2D uDetail;
        uniform vec2 uRadii;
        uniform float uCap;
        uniform float uFluid;
        varying vec3 vInterior;
        float stoneNoise(vec3 p) {
          return (texture2D(uDetail, p.xy).r + texture2D(uDetail, p.yz + 0.37).r + texture2D(uDetail, p.zx + 0.71).r) / 3.0;
        }
      ${shader.fragmentShader}`
        .replace("#include <map_fragment>", `
          #include <map_fragment>
          #ifndef USE_MAP
          vec3 warp = vec3(stoneNoise(vInterior * 0.6), stoneNoise(vInterior * 0.6 + 1.3), stoneNoise(vInterior * 0.6 + 3.7));
          vec3 detailAt = vInterior * 1.2 + (warp - 0.5) * 1.8;
          float coarse = stoneNoise(detailAt);
          float fine = stoneNoise(detailAt * 12.0);
          float grain = stoneNoise(vInterior * 54.0);
          float veins = 1.0 - smoothstep(0.008, 0.034, abs(coarse - 0.5));
          float bands = 0.5 + 0.5 * sin(length(vInterior) * 96.0 + coarse * 32.0);
          float stone = clamp((coarse - 0.32) * 2.7, 0.0, 1.0);
          float ribbons = 0.5 + 0.5 * sin(vInterior.y * 12.0 + coarse * 46.0 + warp.z * 11.0);
          float surfaceHeight = mix(coarse * 0.018 + fine * 0.001 + grain * 0.0003, ribbons * 0.00008, uFluid);
            diffuseColor.rgb *= mix(mix(0.18, 1.1, stone) * (0.8 + fine * 0.4), 0.6 + coarse * 0.35 + ribbons * 0.12, uFluid);
            diffuseColor.rgb *= mix(mix(0.75, 1.0, bands * 0.4 + 0.6), 1.0, uFluid);
            float radius = length(vInterior);
            float edge = min(radius - uRadii.x, uRadii.y - radius);
            diffuseColor.rgb *= mix(1.0, mix(mix(0.2, 0.65, uFluid), 1.0, smoothstep(0.0, 0.035, edge)), uCap);
          #endif
        `)
        .replace("#include <roughnessmap_fragment>", `
          #include <roughnessmap_fragment>
          #ifndef USE_MAP
            roughnessFactor = mix(clamp(roughnessFactor + (grain - 0.5) * 0.4 + veins * 0.12, 0.18, 1.0), 0.34 + ribbons * 0.12, uFluid);
          #endif
        `)
        .replace("#include <emissivemap_fragment>", `
          #include <emissivemap_fragment>
          #ifndef USE_MAP
            totalEmissiveRadiance *= mix(0.35 + stone * 0.5 + veins * 0.4, 0.65 + ribbons * 0.18, uFluid);
          #endif
        `)
        .replace("#include <normal_fragment_maps>", `
          #include <normal_fragment_maps>
          #ifndef USE_MAP
            vec3 q0 = dFdx(-vViewPosition);
            vec3 q1 = dFdy(-vViewPosition);
            vec3 r0 = cross(q1, normal);
            vec3 r1 = cross(normal, q0);
            float determinant = dot(q0, r0);
            vec3 gradient = r0 * dFdx(surfaceHeight) + r1 * dFdy(surfaceHeight);
            if (abs(determinant) > 0.00000001) {
              normal = normalize(abs(determinant) * normal - sign(determinant) * gradient);
            }
          #endif
        `);
    };
    material.customProgramCacheKey = () => "interior-material-v3";
    return material;
  }

  private buildAir(cut: { value: number }) {
    const deform = `
      float phi = 1.57079632679 + uCut * cutMask * 0.5 + uv.x * (6.28318530718 - uCut * cutMask);
      float theta = (1.0 - uv.y) * 3.14159265359;
      vec3 direction = vec3(-cos(phi) * sin(theta), cos(theta), sin(phi) * sin(theta));
    `;
    const clouds = this.loader.load(asset("/textures/earth_clouds.jpg"));
    clouds.wrapS = THREE.RepeatWrapping;
    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff, alphaMap: clouds, transparent: true, opacity: 0.48,
      roughness: 1, depthWrite: false, alphaTest: 0.015,
    });
    cloudMaterial.onBeforeCompile = shader => {
      shader.uniforms.uCut = cut;
      shader.vertexShader = `attribute float cutMask; uniform float uCut;\n${shader.vertexShader}`
        .replace("#include <uv_vertex>", `${deform}\n#include <uv_vertex>\nvAlphaMapUv = vec2(phi / 6.28318530718, uv.y);`)
        .replace("#include <beginnormal_vertex>", "vec3 objectNormal = direction;")
        .replace("#include <begin_vertex>", "vec3 transformed = direction * length(position);");
    };
    cloudMaterial.customProgramCacheKey = () => "interior-clouds-v3";
    this.globe.add(new THREE.Mesh(cutSphere(2.008, 96), cloudMaterial));
    const air = new THREE.ShaderMaterial({
      uniforms: { uCut: cut }, transparent: true, depthWrite: false,
      side: THREE.BackSide, blending: THREE.AdditiveBlending,
      vertexShader: `attribute float cutMask; uniform float uCut; varying vec3 vNormal; varying vec3 vView;
        void main() {
          ${deform}
          vec4 viewed = modelViewMatrix * vec4(direction * length(position), 1.0);
          vNormal = normalize(normalMatrix * direction);
          vView = -viewed.xyz;
          gl_Position = projectionMatrix * viewed;
        }`,
      fragmentShader: `varying vec3 vNormal; varying vec3 vView;
        void main() {
          float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 3.5);
          gl_FragColor = vec4(vec3(0.07, 0.3, 0.75) * rim, rim * 0.55);
        }`,
    });
    this.globe.add(new THREE.Mesh(cutSphere(2.035, 96), air));
  }

  private buildRing() {
    const texture = this.loader.load(asset("/textures/saturn_ring_alpha.png"));
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
    const geometry = new THREE.RingGeometry(2.48, 4.56, 192);
    const positions = geometry.getAttribute("position");
    const uv = geometry.getAttribute("uv");
    for (let index = 0; index < positions.count; index++) {
      uv.setXY(index, (Math.hypot(positions.getX(index), positions.getY(index)) - 2.48) / 2.08, 0.5);
    }
    const ring = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
      map: texture, color: 0xc8b797, roughness: 0.95, metalness: 0,
      side: THREE.DoubleSide, transparent: true, opacity: 0.9, alphaTest: 0.02,
    }));
    ring.rotation.x = Math.PI / 2;
    ring.receiveShadow = true;
    this.globe.add(ring);
  }

  public setCut(progress: number) {
    if (this.disposed || !Number.isFinite(progress)) return;
    const value = Math.min(1, Math.max(0, progress));
    this.shells.forEach((shell, index) => {
      const offset = this.shells.length > 1 && index === 0 ? 0.72 : 0;
      const angle = Math.max(0, (value - offset) / (1 - offset)) * Math.PI;
      shell.cut.value = angle;
      shell.caps[0].rotation.y = Math.PI * 1.5 + angle / 2;
      shell.caps[1].rotation.y = Math.PI * 1.5 - angle / 2;
      for (const face of shell.caps) face.visible = angle > 0;
      shell.top.visible = angle > 0;
      const positions = shell.top.geometry.getAttribute("position");
      for (let vertex = 0; vertex < positions.count; vertex++) {
        const radius = shell.profile[vertex * 2];
        const phi = Math.PI / 2 - angle / 2 + shell.profile[vertex * 2 + 1] * angle;
        positions.setXYZ(vertex, -Math.cos(phi) * radius, 0, Math.sin(phi) * radius);
      }
      positions.needsUpdate = true;
    });
  }

  protected override resize() {
    super.resize();
    this.camera.zoom = Math.min(1, this.camera.aspect);
    this.camera.updateProjectionMatrix();
  }

  protected override onFrame() {}

  override dispose() {
    if (this.disposed) return;
    this.detail.dispose();
    this.scene.environment = null;
    this.environment.dispose();
    for (const material of this.depthMaterials) material.dispose();
    this.key.shadow.dispose();
    super.dispose();
    this.shells.length = 0;
    this.depthMaterials.length = 0;
  }
}
