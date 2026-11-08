/*!
 * ZOHARAV — THE GOLDEN CORE
 * Esfera cinética 3D (Three.js) + palabras con transición pixelada (Canvas 2D).
 * Archivo único y autocontenido: inyecta su propio CSS.
 *
 * USO:
 *   1. Añade el atributo  data-golden-core  al <section> del hero "Book a Strategic Session".
 *   2. Carga este archivo:  <script type="module" src="/js/zoharav-golden-core.js"></script>
 *   (Opcional) window.ZGC_THREE_URL = '/ruta/three.module.js'  antes de cargarlo, si no quieres CDN.
 *
 * API:  window.ZoharavGoldenCore.init(el) -> instancia { destroy() }
 *       window.ZoharavGoldenCore.destroyAll()
 */

const THREE_URL =
  (typeof window !== 'undefined' && window.ZGC_THREE_URL) ||
  'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js';

const WORDS = ['STRATEGY', 'FINANCE', 'ENERGY', 'OPERATIONS', 'SUSTAINABILITY', 'ADVISORY'];
const INTERVAL = 5000; // ms entre inicios de transición
const TRANSITION = 900; // ms

/* ------------------------------------------------------------------ */
/* CSS                                                                 */
/* ------------------------------------------------------------------ */
const CSS = `
[data-golden-core]{position:relative;isolation:isolate;overflow-x:clip}
.zgc-layer{
  position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:1;
  --zgc-font:"Cormorant Garamond","Cormorant","Playfair Display",Georgia,"Times New Roman",serif;
  --zgc-size:clamp(340px,27vw,460px);
  --zgc-cx:77.5%;           /* centro de la columna derecha (55% + 45%/2) */
  --zgc-cy:50%;
  --zgc-geo-opacity:1;
}
.zgc-stage{
  position:absolute;width:var(--zgc-size);height:var(--zgc-size);
  left:var(--zgc-cx);top:var(--zgc-cy);transform:translate(-50%,-50%);
  contain:layout paint size;
}
.zgc-gl,.zgc-fallback{position:absolute;inset:0;width:100%;height:100%;display:block;opacity:var(--zgc-geo-opacity);transition:opacity .9s ease}
.zgc-gl{opacity:0}
.zgc-gl.is-ready{opacity:var(--zgc-geo-opacity)}
.zgc-words{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:block}
.zgc-sr{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.zgc-fallback{
  border-radius:50%;
  background:
    radial-gradient(circle at 50% 50%,rgba(20,16,12,.92) 0 27%,transparent 31%),
    radial-gradient(circle at 32% 28%,rgba(255,240,205,.85),transparent 22%),
    conic-gradient(from 200deg,#2b241c,#c9963f,#f3dfb2,#8a5f22,#2a221a,#d9ac57,#fbe9c3,#6b4a1c,#2b241c);
  box-shadow:inset -18px -26px 50px rgba(0,0,0,.6),inset 14px 16px 40px rgba(255,230,180,.25);
  animation:zgc-spin 60s linear infinite;
}
@keyframes zgc-spin{to{transform:rotate(360deg)}}

/* Tablet 768–1023 */
@media (max-width:1023.98px){
  .zgc-layer{--zgc-size:clamp(200px,27vw,280px);--zgc-cx:79%;--zgc-cy:var(--zgc-t-top,33%);--zgc-geo-opacity:.72}
}
/* Mobile <768: ornamento de fondo anclado a la derecha */
@media (max-width:767.98px){
  .zgc-layer{
    --zgc-size:clamp(120px,40vw,180px);
    --zgc-geo-opacity:.32;
    --zgc-cx:calc(100% - var(--zgc-size) * .42);
    --zgc-cy:var(--zgc-m-top, calc(var(--zgc-size) * .5 + 8px));
  }
}
@media (prefers-reduced-motion:reduce){.zgc-fallback{animation:none}}
`;

function injectCSS() {
  if (document.getElementById('zgc-style')) return;
  const s = document.createElement('style');
  s.id = 'zgc-style';
  s.textContent = CSS;
  document.head.appendChild(s);
}

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
function rng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function breakpoint() {
  const w = window.innerWidth;
  return w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop';
}
function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}
const reducedMQ = () => window.matchMedia('(prefers-reduced-motion: reduce)');

/* ------------------------------------------------------------------ */
/* PALABRAS — Canvas 2D con fragmentación real                         */
/* ------------------------------------------------------------------ */
class WordEngine {
  constructor(canvas, layer, stage) {
    this.c = canvas;
    this.ctx = canvas.getContext('2d');
    this.layer = layer;
    this.stage = stage;
    this.index = 0;
    this.cache = new Map();
    this.state = 'intro'; // intro | idle | transition
    this.t = 0;           // ms dentro de la transición
    this.clock = 0;       // ms acumulados visibles desde el último inicio
    this.dirty = true;
    this.reduced = reducedMQ().matches;
  }

  measure() {
    const size = this.stage.clientWidth || 300;
    const bp = breakpoint();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Ancho máximo del texto: dentro del núcleo en desktop/tablet;
    // en móvil, todo lo que permita el borde derecho visible.
    let maxW;
    if (bp === 'desktop') maxW = size * 0.58;
    else if (bp === 'tablet') maxW = size * 0.66;
    else {
      const lr = this.layer.getBoundingClientRect();
      const sr = this.stage.getBoundingClientRect();
      const cx = sr.left + sr.width / 2;
      const room = Math.min(lr.right, window.innerWidth) - cx - 6;
      maxW = Math.max(60, Math.min(size * 1.0, room * 2));
    }
    const baseFont = bp === 'desktop' ? size * 0.075 : bp === 'tablet' ? size * 0.082 : Math.max(13, size * 0.1);
    const spacing = bp === 'mobile' ? 0.1 : 0.2;
    const minFont = bp === 'mobile' ? 9.5 : 11;

    const W = Math.ceil(maxW + (bp === 'mobile' ? 24 : 90));
    const H = Math.ceil(Math.max(baseFont * 3.2, 60));

    this.m = { size, bp, dpr, maxW, baseFont, spacing, minFont, W, H };
    this.c.width = Math.round(W * dpr);
    this.c.height = Math.round(H * dpr);
    this.c.style.width = W + 'px';
    this.c.style.height = H + 'px';
    this.cache.clear();
    this.dirty = true;
  }

  font(px) {
    const fam = getComputedStyle(this.layer).getPropertyValue('--zgc-font').trim() || 'Georgia, serif';
    return `600 ${px}px ${fam}`;
  }

  textWidth(ctx, word, px, sp) {
    ctx.font = this.font(px);
    let w = 0;
    for (const ch of word) w += ctx.measureText(ch).width;
    return w + sp * px * (word.length - 1);
  }

  drawSpaced(ctx, word, px, sp, cx, cy) {
    ctx.font = this.font(px);
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    const total = this.textWidth(ctx, word, px, sp);
    let x = cx - total / 2;
    for (const ch of word) {
      ctx.fillText(ch, x, cy);
      x += ctx.measureText(ch).width + sp * px;
    }
    return total;
  }

  prepare(word) {
    if (this.cache.has(word)) return this.cache.get(word);
    const { dpr, maxW, baseFont, spacing, minFont, bp } = this.m;
    const cw = this.c.width, ch = this.c.height;

    const probe = document.createElement('canvas').getContext('2d');
    let px = baseFont;
    const w0 = this.textWidth(probe, word, px, spacing);
    if (w0 > maxW) px = Math.max(minFont, px * (maxW / w0));
    let sp = spacing;
    // Si aun con fuente mínima no cabe, reduce el tracking.
    while (this.textWidth(probe, word, px, sp) > maxW && sp > 0.02) sp -= 0.02;

    // Versión nítida (con sombra para contraste)
    const crisp = document.createElement('canvas');
    crisp.width = cw; crisp.height = ch;
    const g = crisp.getContext('2d');
    g.scale(dpr, dpr);
    const cy = ch / dpr / 2;
    const grad = g.createLinearGradient(0, cy - px * 0.6, 0, cy + px * 0.6);
    grad.addColorStop(0, '#FBF2DE');
    grad.addColorStop(0.55, '#F1E1BC');
    grad.addColorStop(1, '#DCC089');
    g.shadowColor = 'rgba(0,0,0,0.65)';
    g.shadowBlur = px * 0.55;
    g.fillStyle = grad;
    const tw = this.drawSpaced(g, word, px, sp, cw / dpr / 2, cy);
    g.shadowBlur = 0;
    g.shadowColor = 'transparent';
    this.drawSpaced(g, word, px, sp, cw / dpr / 2, cy);

    // Máscara para muestreo de píxeles
    const mask = document.createElement('canvas');
    mask.width = cw; mask.height = ch;
    const mg = mask.getContext('2d', { willReadFrequently: true });
    mg.scale(dpr, dpr);
    mg.fillStyle = '#fff';
    this.drawSpaced(mg, word, px, sp, cw / dpr / 2, cy);
    const data = mg.getImageData(0, 0, cw, ch).data;

    const step = Math.max(2, Math.round((px / (bp === 'mobile' ? 7 : 10)) * dpr));
    const cap = bp === 'mobile' ? 380 : bp === 'tablet' ? 650 : 1000;
    const r = rng(word.length * 977 + 13);
    let parts = [];
    for (let y = 0; y < ch; y += step) {
      for (let x = 0; x < cw; x += step) {
        const a = data[((y + (step >> 1)) * cw + (x + (step >> 1))) * 4 + 3] || data[(y * cw + x) * 4 + 3];
        if (a > 70) {
          const pick = r();
          const mult = pick < 0.62 ? 1 : pick < 0.85 ? 1.6 : 2.3;
          parts.push({
            tx: x + step / 2, ty: y + step / 2,
            s: step * mult * 0.92,
            a: a / 255,
            d: r(),                      // retardo normalizado
            dir: (r() * 0.8 + 0.4),
            vy: (r() - 0.5),
            sx: (r() - 0.5), sy: (r() - 0.5),
          });
        }
      }
    }
    if (parts.length > cap) {
      const k = parts.length / cap;
      parts = parts.filter((_, i) => Math.floor(i % k) === 0).slice(0, cap);
      parts.forEach((p) => (p.s *= Math.sqrt(k)));
    }
    const out = { crisp, parts, px, tw: tw * dpr, step };
    this.cache.set(word, out);
    return out;
  }

  start() {
    this.state = this.reduced ? 'idle' : 'intro';
    this.t = 0;
    this.clock = 0;
    this.dirty = true;
  }

  tick(dt) {
    if (this.state === 'idle') {
      this.clock += dt;
      if (this.clock >= INTERVAL) {
        this.clock -= INTERVAL;
        this.from = WORDS[this.index];
        this.index = (this.index + 1) % WORDS.length;
        this.state = 'transition';
        this.t = 0;
      } else if (this.dirty) {
        this.render();
      }
      return;
    }
    // intro = solo reconstrucción (500–900) de la primera palabra
    this.t += dt;
    this.clock += dt;
    const end = TRANSITION;
    if (this.state === 'intro' && this.t < 500) this.t = 500;
    if (this.t >= end) {
      this.state = 'idle';
      this.dirty = true;
      if (this.clock >= INTERVAL) this.clock = 0;
      this.render();
      return;
    }
    this.render();
  }

  render() {
    const ctx = this.ctx;
    const cw = this.c.width, ch = this.c.height;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cw, ch);
    const cur = this.prepare(WORDS[this.index]);

    if (this.state === 'idle') {
      ctx.globalAlpha = 1;
      ctx.drawImage(cur.crisp, 0, 0);
      this.dirty = false;
      return;
    }

    if (this.reduced) { ctx.drawImage(cur.crisp, 0, 0); return; }

    const t = this.t;
    const cx = cw / 2, cy = ch / 2;
    const dpr = this.m.dpr;
    const spread = (this.m.bp === 'mobile' ? 10 : 26) * dpr;

    /* Fase 1–2: desintegración y disolución de la palabra anterior */
    if (this.state === 'transition' && t < 520) {
      const prev = this.prepare(this.from);
      ctx.globalAlpha = 1 - clamp(t / 110, 0, 1);
      if (ctx.globalAlpha > 0) ctx.drawImage(prev.crisp, 0, 0);
      ctx.fillStyle = '#F3E4C4';
      const v = clamp((t - 300) / 200, 0, 1); // fase 2
      const ev = easeInOut(v);
      for (const p of prev.parts) {
        const u = easeOut(clamp((t - p.d * 120) / 300, 0, 1));
        const side = Math.sign(p.tx - cx) || 1;
        let x = p.tx + side * p.dir * spread * u;
        let y = p.ty + p.vy * 6 * dpr * u;
        x = lerp(x, cx + (x - cx) * 0.18, ev);
        y = lerp(y, cy + (y - cy) * 0.2, ev);
        const alpha = p.a * (t < 300 ? 1 - u * 0.55 : 0.45 * (1 - ev));
        const s = p.s * (1 - 0.55 * ev) * (0.85 + 0.35 * u);
        if (alpha <= 0.01) continue;
        ctx.globalAlpha = alpha;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
    }

    /* Destello dorado sutil (fase 2) */
    if (this.state === 'transition' && t > 280 && t < 620) {
      const k = Math.sin(((t - 280) / 340) * Math.PI);
      const R = Math.max(cur.tw, 80 * dpr) * 0.55;
      const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
      rg.addColorStop(0, `rgba(255,222,160,${0.16 * k})`);
      rg.addColorStop(0.5, `rgba(214,168,88,${0.07 * k})`);
      rg.addColorStop(1, 'rgba(214,168,88,0)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, cw, ch);
      const lg = ctx.createLinearGradient(cx - R, 0, cx + R, 0);
      lg.addColorStop(0, 'rgba(255,230,180,0)');
      lg.addColorStop(0.5, `rgba(255,236,196,${0.32 * k})`);
      lg.addColorStop(1, 'rgba(255,230,180,0)');
      ctx.fillStyle = lg;
      ctx.fillRect(cx - R, cy - 0.6 * dpr, R * 2, 1.2 * dpr);
    }

    /* Fase 3: reconstrucción (500–900) */
    if (t >= 500) {
      const crispA = clamp((t - 760) / 140, 0, 1);
      ctx.fillStyle = '#F3E4C4';
      for (const p of cur.parts) {
        const u = easeOut(clamp((t - 500 - p.d * 150) / 230, 0, 1));
        if (u <= 0) continue;
        const sx = cx + p.sx * cur.tw * 0.45;
        const sy = cy + p.sy * cur.px * dpr * 1.4;
        const x = lerp(sx, p.tx, u);
        const y = lerp(sy, p.ty, u);
        const s = lerp(cur.step * 2.2, p.s, u);
        ctx.globalAlpha = p.a * u * (1 - crispA);
        if (ctx.globalAlpha <= 0.01) continue;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
      if (crispA > 0) { ctx.globalAlpha = crispA; ctx.drawImage(cur.crisp, 0, 0); }
    }
    ctx.globalAlpha = 1;
  }

  // Modo reduced-motion: cambio con fundido simple
  tickReduced(dt) {
    this.clock += dt;
    if (this.clock >= INTERVAL) {
      this.clock -= INTERVAL;
      this.index = (this.index + 1) % WORDS.length;
      this.fade = 0;
    }
    if (this.fade !== undefined && this.fade < 1) {
      this.fade = Math.min(1, this.fade + dt / 400);
      const ctx = this.ctx;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, this.c.width, this.c.height);
      ctx.globalAlpha = this.fade;
      ctx.drawImage(this.prepare(WORDS[this.index]).crisp, 0, 0);
      ctx.globalAlpha = 1;
    } else if (this.dirty) {
      this.state = 'idle';
      this.render();
    }
  }
}

/* ------------------------------------------------------------------ */
/* ESFERA — Three.js                                                   */
/* ------------------------------------------------------------------ */
async function createSphere(THREE, canvas, opts) {
  const renderer = new THREE.WebGLRenderer({
    canvas, alpha: true, antialias: true, powerPreference: 'high-performance', premultipliedAlpha: true,
  });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const DIST = 4.6;
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, DIST);

  /* Entorno de estudio: softboxes cálidos sobre fondo oscuro -> reflejos de oro líquido */
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = new THREE.Scene();
  env.background = new THREE.Color(0x040302);
  const envDisposables = [];
  const panel = (w, h, hex, k, pos, look) => {
    const geo = new THREE.PlaneGeometry(w, h);
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(k), side: THREE.DoubleSide });
    const m = new THREE.Mesh(geo, mat);
    m.position.set(...pos); m.lookAt(...look);
    env.add(m); envDisposables.push(geo, mat);
  };
  panel(6, 2.2, 0xfff1d6, 5.0, [0, 5, 2], [0, 0, 0]);       // softbox superior
  panel(1.0, 7, 0xffe2b0, 4.0, [-5, 0.5, 2.5], [0, 0, 0]);  // strip izquierdo
  panel(0.6, 6, 0xffd08a, 6.0, [5, -0.5, -1.5], [0, 0, 0]); // rim derecho
  panel(3, 0.5, 0xfff4e0, 3.0, [1.5, 2, 5], [0, 0, 0]);     // kicker frontal
  panel(8, 8, 0x5a3a12, 0.35, [0, -5, 0], [0, 0, 0]);       // rebote cálido suelo
  panel(2, 2, 0xffffff, 1.2, [-2.5, -2, -4], [0, 0, 0]);    // relleno trasero
  const envRT = pmrem.fromScene(env, 0.035);
  scene.environment = envRT.texture;

  const key = new THREE.DirectionalLight(0xffe7c2, 2.2);
  key.position.set(-3, 4, 5);
  const rim = new THREE.DirectionalLight(0xffc77a, 1.6);
  rim.position.set(4, -1, -3);
  scene.add(key, rim);

  /* Uniforms compartidos */
  const U = {
    uTime: { value: 0 },
    uDist: { value: DIST },
    uAp0: { value: opts.mobile ? 0.26 : 0.3 },
    uAp1: { value: opts.mobile ? 0.5 : 0.58 },
  };

  // pass 0 = mitad trasera (opaca), pass 1 = mitad frontal con apertura central
  function metal(hex, rough, pass, seed, extra = {}) {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(hex), metalness: 1, roughness: rough,
      clearcoat: 0.55, clearcoatRoughness: 0.12, envMapIntensity: 1.25,
      side: THREE.DoubleSide, transparent: pass === 1, depthWrite: pass === 0, ...extra,
    });
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, U, { uSeed: { value: seed } });
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nuniform float uTime; uniform float uSeed;')
        .replace('#include <begin_vertex>', `#include <begin_vertex>
          float zw = sin(uTime*0.55 + position.y*2.6 + position.x*1.7 + uSeed)
                   + 0.6*sin(uTime*0.37 - position.z*3.1 + uSeed*1.7);
          transformed += objectNormal * zw * 0.011;`);
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform float uDist; uniform float uAp0; uniform float uAp1;')
        .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
          vec3 zP = -vViewPosition;
          ${pass === 0 ? 'if (zP.z > -uDist) discard;' : 'if (zP.z <= -uDist) discard;'}
          float zK = length(zP.xy / -zP.z) * uDist;
          float zFade = smoothstep(uAp0, uAp1, zK);`)
        .replace('#include <opaque_fragment>', `#include <opaque_fragment>
          ${pass === 1 ? 'gl_FragColor.a *= zFade; if (gl_FragColor.a < 0.004) discard;' : ''}`);
    };
    m.customProgramCacheKey = () => 'zgc-' + pass;
    return m;
  }

  /* Bandas: cintas de sección lenticular que siguen la superficie de la esfera */
  const PALETTE = [
    { hex: 0xe9c98f, rough: 0.16 }, // oro champaña
    { hex: 0xd9a446, rough: 0.12 }, // oro cálido
    { hex: 0xf3dcb0, rough: 0.2 },  // champaña claro
    { hex: 0x3a332c, rough: 0.24 }, // titanio oscuro
    { hex: 0xc48a2c, rough: 0.1 },  // oro profundo
  ];
  const r = rng(20261108);
  const SEG = opts.mobile ? 150 : 240;
  const RAD = opts.mobile ? 14 : 22;
  const BANDS = opts.mobile ? 9 : 12;

  const root = new THREE.Group();   // inclinación cursor
  const spin = new THREE.Group();   // rotación autónoma
  root.add(spin);
  scene.add(root);
  const disposables = [];
  const bandGroups = [];

  const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
  for (let b = 0; b < BANDS; b++) {
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(r() * Math.PI * 2, r() * Math.PI * 2, r() * Math.PI * 2));
    const span = 0.62 + r() * 0.36;
    const amp = 0.22 + r() * 0.42;
    const freq = 0.8 + r() * 0.9;
    const ph = r() * Math.PI * 2;
    const lat0 = (r() - 0.5) * 0.5;
    const width = 0.26 + r() * 0.2;
    const thick = 0.045 + r() * 0.045;
    const radius = 1.0 - (b % 4) * 0.018;

    const center = (s) => {
      const phi = s * span * Math.PI * 2;
      const th = lat0 + amp * Math.sin(freq * Math.PI * 2 * s + ph);
      return v3(Math.cos(th) * Math.cos(phi), Math.sin(th), Math.cos(th) * Math.sin(phi)).applyQuaternion(q);
    };

    const pos = new Float32Array((SEG + 1) * RAD * 3);
    let k = 0;
    const tmp = new THREE.Vector3();
    for (let i = 0; i <= SEG; i++) {
      const s = i / SEG;
      const C = center(s);
      const T = center(Math.min(1, s + 1e-3)).sub(center(Math.max(0, s - 1e-3))).normalize();
      const N = C.clone().normalize();
      const B = new THREE.Vector3().crossVectors(T, N).normalize();
      const prof = Math.pow(Math.sin(Math.PI * s), 0.55);
      const w = Math.max(0.003, width * prof * (1 + 0.28 * Math.sin(3 * Math.PI * s + ph)));
      const th = Math.max(0.002, thick * Math.pow(Math.sin(Math.PI * s), 0.8));
      for (let j = 0; j < RAD; j++) {
        const a = (j / RAD) * Math.PI * 2;
        const lat = Math.cos(a) * w;
        const sa = Math.sin(a);
        const lift = Math.sign(sa) * Math.pow(Math.abs(sa), 0.75) * th;
        tmp.copy(C).multiplyScalar(radius).addScaledVector(B, lat).normalize().multiplyScalar(radius + lift);
        pos[k++] = tmp.x; pos[k++] = tmp.y; pos[k++] = tmp.z;
      }
    }
    const idx = [];
    for (let i = 0; i < SEG; i++) {
      for (let j = 0; j < RAD; j++) {
        const a = i * RAD + j, bb = i * RAD + ((j + 1) % RAD);
        const c = (i + 1) * RAD + j, d = (i + 1) * RAD + ((j + 1) % RAD);
        idx.push(a, c, bb, bb, c, d);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();

    const pal = PALETTE[b % PALETTE.length];
    const m0 = metal(pal.hex, pal.rough, 0, b * 1.37);
    const m1 = metal(pal.hex, pal.rough, 1, b * 1.37);
    const g = new THREE.Group();
    const back = new THREE.Mesh(geo, m0);
    const front = new THREE.Mesh(geo, m1);
    back.renderOrder = 1; front.renderOrder = 3;
    g.add(back, front);
    g.userData = { ax: r() * 2 - 1, ay: r() * 2 - 1, sp: 0.05 + r() * 0.07, ph: r() * 10 };
    spin.add(g);
    bandGroups.push(g);
    disposables.push(geo, m0, m1);
  }

  /* Núcleo interior: titanio oscuro pulido (base de contraste para las palabras) */
  const coreGeo = new THREE.SphereGeometry(0.6, 64, 48);
  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x16120e, metalness: 1, roughness: 0.42, envMapIntensity: 0.45, clearcoat: 0.3, clearcoatRoughness: 0.4,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.renderOrder = 0;
  spin.add(core);
  disposables.push(coreGeo, coreMat);

  /* Cáscara envolvente sutil (cohesión esférica, solo mitad trasera) */
  const shellGeo = new THREE.SphereGeometry(0.965, 96, 64);
  const shellMat = metal(0x2a241e, 0.3, 0, 7.7, { envMapIntensity: 0.55 });
  const shell = new THREE.Mesh(shellGeo, shellMat);
  shell.renderOrder = 0;
  spin.add(shell);
  disposables.push(shellGeo, shellMat);

  /* Estado */
  let w = 0, h = 0, exposure = 1;
  function resize(size, dpr, bp) {
    w = h = Math.max(1, Math.round(size));
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
    exposure = bp === 'desktop' ? 1.05 : bp === 'tablet' ? 0.85 : 0.72;
    renderer.toneMappingExposure = exposure;
  }

  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
  function setTiltTarget(nx, ny) {
    const max = THREE.MathUtils.degToRad(5);
    tilt.tx = clamp(ny, -1, 1) * max;
    tilt.ty = clamp(nx, -1, 1) * max;
  }

  let elapsed = 0;
  function update(dt) {
    elapsed += dt;
    const t = elapsed;
    U.uTime.value = t;
    // rotación muy lenta + variaciones orgánicas de orientación (sin traslación: el centro no se mueve)
    spin.rotation.y = t * 0.085;
    spin.rotation.x = Math.sin(t * 0.13) * 0.16 + Math.sin(t * 0.051) * 0.08;
    spin.rotation.z = Math.sin(t * 0.09 + 1.3) * 0.1;
    for (const g of bandGroups) {
      const d = g.userData;
      g.rotation.x = Math.sin(t * d.sp + d.ph) * 0.05 * d.ax;
      g.rotation.y = Math.sin(t * d.sp * 0.8 + d.ph * 1.3) * 0.06 * d.ay;
    }
    // reflejos que se desplazan: el entorno "gira" sutilmente vía luces
    key.position.set(-3 + Math.sin(t * 0.21) * 1.5, 4, 5 + Math.cos(t * 0.17) * 1.2);
    // inclinación por cursor con interpolación suave
    const k = 1 - Math.pow(0.0025, dt);
    tilt.x = lerp(tilt.x, tilt.tx, k);
    tilt.y = lerp(tilt.y, tilt.ty, k);
    root.rotation.x = tilt.x;
    root.rotation.y = tilt.y;
  }
  function render() { renderer.render(scene, camera); }

  function dispose() {
    disposables.forEach((d) => d.dispose());
    envDisposables.forEach((d) => d.dispose());
    envRT.dispose();
    pmrem.dispose();
    renderer.dispose();
    try { renderer.forceContextLoss(); } catch (e) {}
  }

  return { resize, update, render, setTiltTarget, dispose };
}

/* ------------------------------------------------------------------ */
/* Componente                                                          */
/* ------------------------------------------------------------------ */
const instances = new Set();

function init(host) {
  if (!host || host.__zgc) return host && host.__zgc;
  injectCSS();

  // Capa decorativa (absoluta, recortada: sin scroll horizontal)
  const layer = document.createElement('div');
  layer.className = 'zgc-layer';
  layer.setAttribute('role', 'img');
  layer.setAttribute('aria-label', 'Strategy, Finance, Energy, Operations, Sustainability, Advisory');
  const stage = document.createElement('div');
  stage.className = 'zgc-stage';
  const words = document.createElement('canvas');
  words.className = 'zgc-words';
  words.setAttribute('aria-hidden', 'true');
  const sr = document.createElement('span');
  sr.className = 'zgc-sr';
  sr.textContent = 'Strategy, Finance, Energy, Operations, Sustainability, Advisory';
  stage.appendChild(words);
  layer.appendChild(stage);
  layer.appendChild(sr);

  // Jerarquía: el contenido funcional del hero queda por encima de la capa
  const lifted = [];
  for (const el of Array.from(host.children)) {
    const cs = getComputedStyle(el);
    if (cs.position === 'static') {
      lifted.push([el, el.style.position, el.style.zIndex]);
      el.style.position = 'relative';
      el.style.zIndex = '2';
    } else if (cs.position === 'relative' && (cs.zIndex === 'auto')) {
      lifted.push([el, el.style.position, el.style.zIndex]);
      el.style.zIndex = '2';
    }
  }
  host.appendChild(layer);

  const engine = new WordEngine(words, layer, stage);
  let sphere = null, glCanvas = null, fallback = null;
  let visible = true, pageVisible = !document.hidden, raf = 0, last = 0, destroyed = false;
  let reduced = reducedMQ().matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function sizes() {
    const size = stage.clientWidth;
    const bp = breakpoint();
    const dpr = Math.min(window.devicePixelRatio || 1, bp === 'desktop' ? 2 : 1.5);
    engine.measure();
    if (sphere) {
      sphere.resize(size, dpr, bp);
      sphere.render();
    }
  }

  function loop(now) {
    raf = 0;
    if (destroyed || !visible || !pageVisible) return;
    const raw = last ? now - last : 16;
    last = now;
    const dt = Math.min(0.05, raw / 1000);   // esfera: paso suave
    const wdt = Math.min(250, raw);          // palabras: tiempo real (ritmo exacto de 5 s)
    if (reduced) engine.tickReduced(wdt);
    else engine.tick(wdt);
    if (sphere && !reduced) { sphere.update(dt); sphere.render(); }
    raf = requestAnimationFrame(loop);
  }
  function play() {
    if (!raf && visible && pageVisible && !destroyed) { last = 0; raf = requestAnimationFrame(loop); }
  }
  function pause() { if (raf) cancelAnimationFrame(raf); raf = 0; }

  // Observadores
  const ro = new ResizeObserver(() => sizes());
  ro.observe(layer);
  const io = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) { play(); loadSphere(); } else pause();
  }, { rootMargin: '150px' });
  io.observe(layer);
  const onVis = () => { pageVisible = !document.hidden; pageVisible ? play() : pause(); };
  document.addEventListener('visibilitychange', onVis);
  const mq = reducedMQ();
  const onMQ = () => {
    reduced = mq.matches; engine.reduced = reduced; engine.start();
    if (sphere) sphere.render();
  };
  mq.addEventListener ? mq.addEventListener('change', onMQ) : mq.addListener(onMQ);
  const onMove = (e) => {
    if (!sphere || e.pointerType !== 'mouse') return;
    const rct = stage.getBoundingClientRect();
    const nx = (e.clientX - (rct.left + rct.width / 2)) / (window.innerWidth * 0.5);
    const ny = (e.clientY - (rct.top + rct.height / 2)) / (window.innerHeight * 0.5);
    sphere.setTiltTarget(nx, ny);
  };
  const onLeave = () => sphere && sphere.setTiltTarget(0, 0);
  if (finePointer) {
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
  }

  // Carga diferida de Three.js
  let loading = false;
  function loadSphere() {
    if (loading || destroyed) return;
    loading = true;
    if (!hasWebGL()) return useFallback();
    const go = async () => {
      try {
        const THREE = await import(/* @vite-ignore */ THREE_URL);
        if (destroyed) return;
        glCanvas = document.createElement('canvas');
        glCanvas.className = 'zgc-gl';
        glCanvas.setAttribute('aria-hidden', 'true');
        stage.insertBefore(glCanvas, words);
        sphere = await createSphere(THREE, glCanvas, { mobile: breakpoint() === 'mobile' });
        glCanvas.addEventListener('webglcontextlost', (ev) => { ev.preventDefault(); useFallback(); }, { once: true });
        sizes();
        sphere.update(0.016);
        sphere.render();
        requestAnimationFrame(() => glCanvas && glCanvas.classList.add('is-ready'));
      } catch (err) {
        console.warn('[GoldenCore] WebGL no disponible, usando alternativa estática.', err);
        useFallback();
      }
    };
    ('requestIdleCallback' in window) ? requestIdleCallback(go, { timeout: 1200 }) : setTimeout(go, 200);
  }
  function useFallback() {
    if (sphere) { try { sphere.dispose(); } catch (e) {} sphere = null; }
    if (glCanvas) { glCanvas.remove(); glCanvas = null; }
    if (fallback) return;
    fallback = document.createElement('div');
    fallback.className = 'zgc-fallback';
    fallback.setAttribute('aria-hidden', 'true');
    stage.insertBefore(fallback, words);
  }

  const startWords = () => { sizes(); engine.start(); play(); };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => {
    if (!destroyed) startWords();
  });

  const inst = {
    host,
    engine,
    destroy() {
      destroyed = true;
      pause();
      ro.disconnect(); io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      mq.removeEventListener ? mq.removeEventListener('change', onMQ) : mq.removeListener(onMQ);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      if (sphere) sphere.dispose();
      layer.remove();
      lifted.forEach(([el, p, z]) => { el.style.position = p; el.style.zIndex = z; });
      instances.delete(inst);
      delete host.__zgc;
    },
  };
  host.__zgc = inst;
  instances.add(inst);
  return inst;
}

function autoInit() {
  document.querySelectorAll('[data-golden-core]').forEach((el) => init(el));
}

if (typeof window !== 'undefined') {
  window.ZoharavGoldenCore = { init, destroyAll: () => [...instances].forEach((i) => i.destroy()) };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoInit, { once: true });
  else autoInit();
}

export { init };
export default init;