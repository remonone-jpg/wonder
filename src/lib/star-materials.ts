import * as THREE from "three";

/**
 * 별 무대가 쓰는 셰이더 셋 — 별 표면, 파티클 구름, 중력렌즈.
 *
 * 왜 셰이더인가. 세 가지 다 텍스처로는 못 한다.
 *
 * **주연 감광**은 보는 각도에 달린 효과다. 별 가장자리가 어두운 것은 거기
 * 어두운 무늬가 칠해져 있어서가 아니라, 비스듬히 보느라 더 얕고 차가운
 * 층까지만 들여다보게 되기 때문이다. 시선과 법선의 각도를 프래그먼트마다
 * 재야 나오는 값이라, 구체에 감은 그림에는 담을 수가 없다.
 *
 * **표면의 일렁임**은 움직인다. 정지 그림으로는 안 된다.
 *
 * `textures/sun.jpg` 를 재활용하는 길도 있었지만 두 가지가 걸렸다. 하나는
 * 그것이 **태양의** 사진이라는 것이다 — 원시별이나 적색거성이나 초거성에
 * 태양 표면을 감으면 셋 다 태양이 된다. 다른 하나는 그 사진에 이미 주연
 * 감광이 찍혀 있다는 것이다. 위에 계산으로 한 번 더 씌우면 가장자리가
 * 두 번 어두워진다.
 *
 * 대신 이 재질은 조명을 받지 않는다. 별은 스스로 빛나므로 빛 계산이 통째로
 * 빠지고, 그만큼 `MeshStandardMaterial` 보다 싸다.
 */

/** 저전력 기기에서는 노이즈 옥타브를 하나 줄인다. */
const OCTAVES = { low: 2, full: 3 };

const NOISE_GLSL = /* glsl */ `
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float vnoise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x),
          mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
          mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
      f.z);
  }
  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < OCTAVES; i++) {
      v += a * vnoise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }
`;

const STAR_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vObject;
  void main() {
    vObject = normal;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const STAR_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  uniform float uGlow;
  uniform float uTime;
  uniform float uCell;
  uniform float uSpeed;
  uniform float uFlash;
  uniform float uDark;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vObject;

  ${NOISE_GLSL}

  void main() {
    if (uDark > 0.999) {
      gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      return;
    }
    float mu = max(dot(normalize(vNormal), normalize(vView)), 0.0);

    // 주연 감광. 지수와 바닥값은 태양의 가시광 관측을 눈대중으로 맞춘 것이다.
    float limb = 0.32 + 0.68 * pow(mu, 0.55);

    // 표면이 끓는 것. 노이즈 덩어리를 시간 축으로 밀면 대류 알갱이가
    // 솟았다 꺼지는 것처럼 보인다.
    //
    // 0.875 로 나누는 것은 fbm 의 진폭 합(0.5+0.25+0.125)이라 0~1 로 펴는
    // 값이다. 이 정규화 없이 계수만 얹었을 때는 폭이 ±8% 밖에 안 돼
    // 화면에서 색종이처럼 보였다.
    float f = fbm(vObject * uCell + vec3(0.0, 0.0, uTime * uSpeed)) / 0.875;
    float churn = 0.62 + 0.76 * f;

    vec3 col = uColor * uGlow * limb * churn * uFlash;
    // 가장자리는 조금 더 붉게. 얕은 층일수록 차갑다.
    col = mix(col * vec3(1.10, 0.70, 0.50), col, pow(mu, 0.4));
    gl_FragColor = vec4(mix(col, vec3(0.0), uDark), 1.0);
  }
`;

export function createStarMaterial(lowPower: boolean) {
  return new THREE.ShaderMaterial({
    defines: { OCTAVES: lowPower ? OCTAVES.low : OCTAVES.full },
    uniforms: {
      uColor: { value: new THREE.Color("#fff4d0") },
      uGlow: { value: 1.2 },
      uTime: { value: 0 },
      uCell: { value: 5 },
      uSpeed: { value: 0.5 },
      uFlash: { value: 1 },
      uDark: { value: 0 },
    },
    vertexShader: STAR_VERTEX,
    fragmentShader: STAR_FRAGMENT,
  });
}

/**
 * 알갱이 무늬의 크기와 속도는 별 크기에서 끌어낸다.
 *
 * 큰 별일수록 대류 알갱이가 크고 느리다 — 실제로 그렇고, 화면에서도
 * 그래야 크기가 읽힌다. 적색거성의 표면이 주계열성과 같은 속도로
 * 자글거리면 둘이 같은 크기로 보인다.
 */
export function churnOf(size: number) {
  const s = Math.max(size, 0.02);
  return { cell: 7 / Math.pow(s, 0.35), speed: 0.5 / Math.pow(s, 0.4) };
}

/**
 * 값 노이즈. 구름에 결을 내는 데만 쓴다.
 *
 * 셰이더의 것과 같은 꼴을 자바스크립트로 한 번 더 쓴 이유는, 이것이
 * **한 번만** 도는 계산이기 때문이다. 알갱이 자리는 만들 때 정해지고 그
 * 뒤로는 바뀌지 않으므로, 프레임마다 도는 셰이더로 밀어 넣을 값이 없다.
 */
function hash3(x: number, y: number, z: number) {
  let h = (x | 0) * 374761393 + (y | 0) * 668265263 + (z | 0) * 1274126177;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function vnoise(x: number, y: number, z: number) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const fx = x - ix, fy = y - iy, fz = z - iz;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const sz = fz * fz * (3 - 2 * fz);
  const mix = (a: number, b: number, t: number) => a + (b - a) * t;
  const at = (dx: number, dy: number, dz: number) => hash3(ix + dx, iy + dy, iz + dz);
  return mix(
    mix(mix(at(0, 0, 0), at(1, 0, 0), sx), mix(at(0, 1, 0), at(1, 1, 0), sx), sy),
    mix(mix(at(0, 0, 1), at(1, 0, 1), sx), mix(at(0, 1, 1), at(1, 1, 1), sx), sy),
    sz,
  );
}

/** 0~1. 옥타브 셋의 진폭 합 0.875 로 나눠 폭을 편다. */
function fbm3(x: number, y: number, z: number) {
  let v = 0;
  let a = 0.5;
  let s = 1;
  for (let i = 0; i < 3; i++) {
    v += a * vnoise(x * s, y * s, z * s);
    s *= 2.02;
    a *= 0.5;
  }
  return v / 0.875;
}

/**
 * 가운데가 밝고 가장자리로 갈수록 투명해지는 원.
 *
 * 파일로 두지 않고 캔버스에 그려 만든다. 64×64 짜리 그라디언트 하나 때문에
 * 받을 것이 늘어나는 쪽이 더 비싸다.
 */
export function softDiscTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const half = size / 2;
    const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.3, "rgba(255,255,255,0.42)");
    gradient.addColorStop(0.7, "rgba(255,255,255,0.08)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * 구름 알갱이들의 자리.
 *
 * 반지름을 `u^0.55` 로 뽑으면 밀도가 대략 중심에 반비례해 쌓인다 — 부피
 * 균등(`u^(1/3)`)으로 뿌리면 겉껍질만 두꺼운 공이 되어 구름으로 안 보인다.
 *
 * `aLag` 는 중심으로 빨려들 때의 시차다. 전부 같이 들어가면 축소일 뿐이고,
 * 제각각 들어가야 뭉치는 것으로 보인다.
 */
export function createCloudGeometry(count: number) {
  const position = new Float32Array(count * 3);
  const color = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const lag = new Float32Array(count);

  const inner = new THREE.Color("#ffd8f0");
  const outer = new THREE.Color("#6f86d8");
  const mixed = new THREE.Color();

  for (let i = 0; i < count; i++) {
    // 구면 위 한 점을 고르게 — z 를 균등하게 뽑아야 극에 몰리지 않는다.
    const z = Math.random() * 2 - 1;
    const angle = Math.random() * Math.PI * 2;
    const ring = Math.sqrt(1 - z * z);
    const radius = Math.pow(Math.random(), 0.55);

    let px = ring * Math.cos(angle) * radius;
    let py = ring * Math.sin(angle) * radius * 0.82;
    let pz = z * radius;

    // 결을 낸다. 고르게 뿌린 공은 알갱이로 만들어도 공이다 — 첫 판이
    // 그랬다. 진짜 성운은 뭉친 데와 빈 데와 검은 띠가 있다. 자리를 노이즈
    // 장으로 조금씩 밀면 뭉치가 생기고, 밝기를 같은 장으로 깎으면 그
    // 뭉치들 사이가 비어 보인다.
    const warp = 0.42;
    px += (fbm3(px * 1.7 + 11, py * 1.7, pz * 1.7) - 0.5) * warp;
    py += (fbm3(px * 1.7, py * 1.7 + 23, pz * 1.7) - 0.5) * warp;
    pz += (fbm3(px * 1.7, py * 1.7, pz * 1.7 + 37) - 0.5) * warp;

    position[i * 3] = px;
    position[i * 3 + 1] = py;
    position[i * 3 + 2] = pz;

    // 세제곱이 뭉친 데를 도드라지게 하고 나머지를 어둡게 눌러 준다.
    const wisp = Math.pow(fbm3(px * 2.6, py * 2.6, pz * 2.6), 3);

    mixed.copy(inner).lerp(outer, Math.min(1, radius * 1.25));
    const jitter = (0.16 + 2.4 * wisp) * (0.55 + Math.random() * 0.7);
    color[i * 3] = mixed.r * jitter;
    color[i * 3 + 1] = mixed.g * jitter;
    color[i * 3 + 2] = mixed.b * jitter;

    // 작은 것이 대부분이고 큰 것이 드물게. 세제곱이 그 분포를 만들고,
    // 뭉친 데의 알갱이를 조금 더 키워 덩어리로 뭉쳐 보이게 한다.
    size[i] = (0.012 + 0.11 * Math.pow(Math.random(), 3.2)) * (0.8 + 1.1 * wisp);
    lag[i] = Math.random() * 0.85;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(position, 3));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(color, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
  geometry.setAttribute("aLag", new THREE.BufferAttribute(lag, 1));
  return geometry;
}

const CLOUD_VERTEX = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aLag;
  uniform float uRadius;
  uniform float uCollapse;
  uniform float uShell;
  uniform float uHeight;
  varying vec3 vColor;
  varying float vFade;

  void main() {
    vec3 dir = normalize(position);
    float len = length(position);

    // 속이 찬 뭉치 ↔ 속이 빈 껍질. 행성상성운과 초신성 잔해는 껍질이다.
    float r = mix(len, 0.84 + 0.16 * len, uShell);

    // 중심으로 빨려드는 것. aLag 때문에 제각각 도착한다.
    float t = clamp((uCollapse - aLag) / max(0.001, 1.0 - aLag), 0.0, 1.0);
    r *= mix(1.0, 0.04, t * t);

    vec4 mv = modelViewMatrix * vec4(dir * r * uRadius, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = max(1.0, aSize * uRadius * uHeight / max(0.001, -mv.z));
    vColor = aColor;
    vFade = 1.0 - t;
  }
`;

const CLOUD_FRAGMENT = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uTint;
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vFade;

  void main() {
    float a = texture2D(uMap, gl_PointCoord).a;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor * uTint, a * vFade * uOpacity);
  }
`;

export function createCloudMaterial(map: THREE.Texture) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map },
      uTint: { value: new THREE.Color("#9a7ad0") },
      uOpacity: { value: 0 },
      uRadius: { value: 1 },
      uCollapse: { value: 0 },
      uShell: { value: 0 },
      uHeight: { value: 400 },
    },
    vertexShader: CLOUD_VERTEX,
    fragmentShader: CLOUD_FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

/**
 * 초신성의 폭풍 껍질.
 *
 * 그냥 색을 칠한 구체를 안쪽 면으로 부풀렸더니 베이지색 공이 커지는 것처럼
 * 보였다. 속이 빈 껍질은 가장자리를 비스듬히 볼 때 더 두꺼운 층을 통과해
 * 보게 되어 테가 밝다 — 그 한 줄이 공을 충격파로 바꾼다.
 */
export function createShellMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color("#ffd9b0") },
      uOpacity: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vView = -mv.xyz;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float mu = abs(dot(normalize(vNormal), normalize(vView)));
        float rim = pow(1.0 - mu, 2.2);
        // 바닥값이 0.10 이었을 때는 테 안쪽이 베이지색으로 차 보였다.
        // 껍질은 비어 있어야 껍질이다.
        gl_FragColor = vec4(uColor * (0.03 + 2.8 * rim), uOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  });
}

/**
 * 중력렌즈. 그려진 화면을 한 번 더 훑으면서 UV 를 휘어 다시 뽑는다.
 *
 * 휘는 방향이 요점이다. 뒤에서 오던 빛이 블랙홀 쪽으로 당겨지므로, 화면의
 * 어떤 점에 보이는 것은 **원래 그보다 중심에 가까이 있던** 것이다. 그래서
 * 샘플 자리를 중심 쪽으로 당긴다. 그 결과 배경이 검은 원 둘레로 밀려나며
 * 늘어나고, 은하수 띠가 고리처럼 휜다.
 *
 * 휘는 정도를 거리 제곱에 반비례시킨 것도 어림이 아니다. 실제 편향각이
 * 충돌 매개변수에 반비례하고, 화면에서 보이는 자리까지 옮기면 대체로
 * 이 꼴이 된다.
 */
export const LENS_SHADER = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uCenter: { value: new THREE.Vector2(0.5, 0.5) },
    uRadius: { value: 0.1 },
    uStrength: { value: 0 },
    uAspect: { value: 1 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uCenter;
    uniform float uRadius;
    uniform float uStrength;
    uniform float uAspect;
    varying vec2 vUv;

    void main() {
      vec2 d = (vUv - uCenter) * vec2(uAspect, 1.0);
      float r = length(d);

      // 사건의 지평선 안쪽. 아무것도 나오지 않는다.
      if (r < uRadius) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
      }

      vec2 dir = d / max(r, 1e-5);
      float bend = uStrength * uRadius * uRadius / (r * r);
      // 가장자리로 갈수록 힘이 빠져 화면 끝이 찢어지지 않게.
      bend *= smoothstep(0.9, 0.25, r);
      vec2 uv = vUv - vec2(dir.x / uAspect, dir.y) * bend;
      gl_FragColor = texture2D(tDiffuse, clamp(uv, 0.001, 0.999));
    }
  `,
};
