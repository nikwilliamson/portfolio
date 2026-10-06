// nikw.co, alive. One fixed WebGL canvas behind the page redraws everything big as goo: display type (from
// signed distance fields of the real DOM text), the section fills with wavy, dripping edges, ambient blobs,
// the cursor, and the work as jelly cards that bend with scroll and lean into the pointer.
// The DOM stays the source of truth: text, links and images are real; the canvas is aria-hidden.
// Build: npx esbuild alive/alive.js --bundle --minify --format=esm --outfile=public/alive/alive.js
import { DataTexture, FloatType, LinearFilter, Mesh, OrthographicCamera, PlaneGeometry, RedFormat, Scene, ShaderMaterial, CanvasTexture, Vector2, Vector3, Vector4, WebGLRenderer, GLSL3, CustomBlending, OneFactor, OneMinusSrcAlphaFactor } from 'three';

/* ---------- motion preference ---------- */
const KEY = 'nikw-motion-paused';
const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
let paused = false;
try { paused = localStorage.getItem(KEY) === '1'; } catch { /* storage blocked */ }
const still = () => paused || reduceQuery.matches;
const motionButton = document.querySelector('[data-motion]');
const syncMotion = () => {
  document.documentElement.classList.toggle('still', still());
  motionButton.setAttribute('aria-pressed', String(still()));
  motionButton.textContent = still() ? 'Play motion' : 'Pause motion';
};
motionButton.addEventListener('click', () => {
  paused = !still();
  try { localStorage.setItem(KEY, paused ? '1' : '0'); } catch { /* this view only */ }
  syncMotion();
});
reduceQuery.addEventListener('change', syncMotion);
syncMotion();

/* ---------- palette and layers ---------- */
// Goo layers, bottom to top. Same colors fuse, different colors overlap with clean edges. Layer 6 is the
// full-screen wash used for page transitions; it takes whatever color the transition needs.
const LAYER_HEX = ['#C2F23D', '#FF5F1F', '#FF8AD8', '#FFFFFF', '#7A35FF', '#170B33'];
const WASH = 6, SEC0 = 7, MAX_SECS = 4, MAX_BLOBS = 112, MAX_TEXTS = 18;
const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgbOf = (css) => (css.match(/[\d.]+/g) || ['0', '0', '0']).slice(0, 3).map(Number);
const layerOf = (css) => {
  const c = rgbOf(css);
  let best = 5, bd = Infinity;
  LAYER_HEX.forEach((h, i) => { const d = hexRgb(h).reduce((a, v, k) => a + (v - c[k]) ** 2, 0); if (d < bd) { bd = d; best = i; } });
  return best;
};
const vec3Of = (rgb) => new Vector3(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);

const K = 1.8, T = (1 - 1 / (K * K)) ** 2, SPREAD = 26;

/* ---------- shaders ---------- */
const quadVertex = /* glsl */ `void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`;
const quadFragment = /* glsl */ `
  precision highp float;
  out vec4 fragColor;
  uniform vec2 uView; uniform float uDpr; uniform float uTime; uniform float uVel;
  uniform vec2 uMouse; uniform float uMouseOn;
  uniform vec4 uBlobs[${MAX_BLOBS}]; uniform int uBlobCount;
  uniform vec4 uTexts[${MAX_TEXTS}]; uniform vec4 uTextUV[${MAX_TEXTS}]; uniform vec4 uTextInfo[${MAX_TEXTS}]; uniform int uTextCount;
  uniform sampler2D uAtlas;
  uniform vec4 uSecs[${MAX_SECS}]; uniform vec3 uSecColor[${MAX_SECS}]; uniform int uSecCount;
  uniform vec3 uColors[6]; uniform vec3 uWash; uniform vec3 uGround;
  const float K = ${K.toFixed(4)}; const float T = ${T.toFixed(6)}; const float SPREAD = ${SPREAD.toFixed(1)};

  float aa(float f) { return clamp((f - T) / max(fwidth(f), 1e-4) + 0.5, 0.0, 1.0); }
  float edgeField(float sd, float spread) { float q = max(0.0, 1.0 - sd / spread); return T * min(q * q, 6.0); }
  // Section edges: two slow travelling waves, taller while the page is scrolling
  float wave(float x, float amp, float seed) {
    return sin(x * 0.0055 + uTime * 0.6 + seed * 2.3) * amp + sin(x * 0.0131 - uTime * 0.9 + seed) * amp * 0.45;
  }

  void main() {
    vec2 p = vec2(gl_FragCoord.x, uView.y * uDpr - gl_FragCoord.y) / uDpr;
    float f[${7 + MAX_SECS}];
    for (int i = 0; i < ${7 + MAX_SECS}; i++) f[i] = 0.0;

    for (int i = 0; i < ${MAX_BLOBS}; i++) {
      if (i >= uBlobCount) break;
      vec4 b = uBlobs[i];
      vec2 d = p - b.xy;
      float R = b.z * K, dd = dot(d, d);
      if (dd >= R * R) continue;
      float q = 1.0 - dd / (R * R);
      f[int(b.w)] += q * q;
    }

    for (int i = 0; i < ${MAX_TEXTS}; i++) {
      if (i >= uTextCount) break;
      vec4 r = uTexts[i];
      vec2 lp = p - r.xy;
      if (lp.x < 0.0 || lp.y < 0.0 || lp.x > r.z || lp.y > r.w) continue;
      vec4 info = uTextInfo[i]; // layer, wobble px, swell px, seed
      float w = info.y * (1.0 + min(abs(uVel) * 0.12, 4.0));
      vec2 wob = vec2(sin(p.y * 0.05 + uTime * 1.9 + info.w), cos(p.x * 0.041 + uTime * 1.6 + info.w)) * w;
      vec2 uv = mix(uTextUV[i].xy, uTextUV[i].zw, clamp((lp + wob) / r.zw, 0.0, 1.0));
      float sd = texture(uAtlas, uv).r;
      vec2 dm = p - uMouse;
      sd -= uMouseOn * info.z * exp(-dot(dm, dm) / 15000.0);
      f[int(info.x)] += edgeField(sd, SPREAD);
    }

    for (int s = 0; s < ${MAX_SECS}; s++) {
      if (s >= uSecCount) break;
      vec4 S = uSecs[s]; // top, bottom, wave amp, top is wavy (1) or flat
      float top = S.x + (S.w > 0.5 ? wave(p.x, S.z, float(s) + 7.0) : 0.0);
      float bottom = S.y + wave(p.x, S.z, float(s));
      f[${SEC0} + s] += edgeField(max(top - p.y, p.y - bottom), 36.0);
    }

    vec3 col = uGround;
    // Later sections first, so each section's wavy bottom and drips sit over the one below it
    for (int s = ${MAX_SECS} - 1; s >= 0; s--) {
      if (s >= uSecCount) continue;
      col = mix(col, uSecColor[s], aa(f[${SEC0} + s]));
    }
    for (int l = 0; l < 6; l++) col = mix(col, uColors[l], aa(f[l]));
    col = mix(col, uWash, aa(f[${WASH}]));
    fragColor = vec4(col, 1.0);
  }
`;

// The page-transition wash draws over everything, cards included
const washFragment = /* glsl */ `
  precision highp float;
  out vec4 fragColor;
  uniform vec2 uView; uniform float uDpr; uniform vec4 uWashBlobs[32]; uniform int uWashCount; uniform vec3 uWash;
  const float K = ${K.toFixed(4)}; const float T = ${T.toFixed(6)};
  void main() {
    vec2 p = vec2(gl_FragCoord.x, uView.y * uDpr - gl_FragCoord.y) / uDpr;
    float f = 0.0;
    for (int i = 0; i < 32; i++) {
      if (i >= uWashCount) break;
      vec4 b = uWashBlobs[i];
      vec2 d = p - b.xy;
      float R = b.z * K, q = max(0.0, 1.0 - dot(d, d) / (R * R));
      f += q * q;
    }
    float a = clamp((f - T) / max(fwidth(f), 1e-4) + 0.5, 0.0, 1.0);
    fragColor = vec4(uWash * a, a);
  }
`;

const cardVertex = /* glsl */ `
  uniform vec4 uRect; uniform vec2 uView; uniform float uVel; uniform vec2 uMouse;
  uniform float uHover; uniform float uPress; uniform float uTime; uniform float uPhase; uniform float uAlive;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec2 u = vec2(uv.x, 1.0 - uv.y);
    vec2 c = uRect.xy + uRect.zw * 0.5;
    vec2 px = uRect.xy + u * uRect.zw;
    // Jelly: the middle lags behind the edges while the page scrolls
    px.y += uVel * sin(u.x * 3.14159) * (0.7 + 0.3 * sin(u.y * 3.14159)) * 1.6;
    // Breathing, a little stronger on hover
    px += vec2(sin(u.y * 5.0 + uTime * 2.1 + uPhase), cos(u.x * 4.0 + uTime * 1.7 + uPhase)) * (1.4 + uHover * 3.0) * uAlive;
    // Hover swells it and the surface bulges toward the pointer; press squashes it
    float scale = 1.0 + uHover * 0.03 - uPress * 0.04;
    px = c + (px - c) * vec2(scale, scale - uPress * 0.02);
    vec2 toM = uMouse - px;
    float near = exp(-dot(toM, toM) / (uRect.z * uRect.z * 0.18));
    px += toM * near * uHover * 0.08;
    gl_Position = vec4(px.x / uView.x * 2.0 - 1.0, 1.0 - px.y / uView.y * 2.0, 0.0, 1.0);
  }
`;
const cardFragment = /* glsl */ `
  uniform sampler2D uTex; uniform vec4 uRect;
  varying vec2 vUv;
  void main() {
    vec2 size = uRect.zw, q = vUv * size - size * 0.5;
    vec2 k = abs(q) - size * 0.5 + 28.0;
    float sd = length(max(k, 0.0)) + min(max(k.x, k.y), 0.0) - 28.0;
    vec4 c = texture2D(uTex, vUv);
    gl_FragColor = vec4(c.rgb, c.a * clamp(0.5 - sd, 0.0, 1.0));
  }
`;

/* ---------- signed distance fields from DOM text ---------- */
const INF = 1e20;
const edt1d = (f, n, d, v, z) => {
  let k = 0;
  v[0] = 0; z[0] = -INF; z[1] = INF;
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) { k--; s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]); }
    k++; v[k] = q; z[k] = s; z[k + 1] = INF;
  }
  k = 0;
  for (let q = 0; q < n; q++) { while (z[k + 1] < q) k++; const dq = q - v[k]; d[q] = dq * dq + f[v[k]]; }
};
const edt = (grid, w, h) => {
  const n = Math.max(w, h), f = new Float64Array(n), d = new Float64Array(n), v = new Int32Array(n), z = new Float64Array(n + 1);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) f[y] = grid[y * w + x];
    edt1d(f, h, d, v, z);
    for (let y = 0; y < h; y++) grid[y * w + x] = d[y];
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) f[x] = grid[y * w + x];
    edt1d(f, w, d, v, z);
    for (let x = 0; x < w; x++) grid[y * w + x] = d[x];
  }
  return grid;
};
const sdfFromAlpha = (alpha, w, h) => {
  const out = new Float64Array(w * h), inn = new Float64Array(w * h);
  for (let i = 0; i < w * h; i++) { const a = alpha[i] > 127; out[i] = a ? 0 : INF; inn[i] = a ? INF : 0; }
  edt(out, w, h); edt(inn, w, h);
  const sd = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const a = alpha[i] / 255;
    sd[i] = a > 0 && a < 1 ? 0.5 - a : a >= 0.5 ? 0.5 - Math.sqrt(inn[i]) : Math.sqrt(out[i]) - 0.5;
  }
  return sd;
};

const PAD = 44;
// Draws each word of an element at its exact laid-out position, one canvas per text color
const rasterize = (el) => {
  const box = el.getBoundingClientRect();
  const W = Math.ceil(box.width + PAD * 2), H = Math.ceil(box.height + PAD * 2);
  const byLayer = new Map();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const cs = getComputedStyle(node.parentElement);
    const layer = layerOf(el.style.color || cs.color);
    if (!byLayer.has(layer)) {
      const c = document.createElement('canvas');
      c.width = W; c.height = H;
      byLayer.set(layer, c.getContext('2d', { willReadFrequently: true }));
    }
    const ctx = byLayer.get(layer);
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    if ('letterSpacing' in ctx) ctx.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
    ctx.fillStyle = '#000';
    const text = node.textContent, upper = cs.textTransform === 'uppercase';
    for (const m of text.matchAll(/\S+/g)) {
      range.setStart(node, m.index); range.setEnd(node, m.index + m[0].length);
      const r = range.getClientRects()[0];
      if (!r) continue;
      const word = upper ? m[0].toUpperCase() : m[0];
      const ascent = ctx.measureText(word).fontBoundingBoxAscent ?? parseFloat(cs.fontSize) * 0.8;
      ctx.fillText(word, r.left - box.left + PAD, r.top - box.top + PAD + ascent);
    }
  }
  return [...byLayer].map(([layer, ctx]) => {
    const alpha = ctx.getImageData(0, 0, W, H).data, a = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) a[i] = alpha[i * 4 + 3];
    // Drip origins: undersides of strokes thick enough to hang a drop from
    const drips = [];
    if (el.hasAttribute('data-drip')) {
      for (let x = PAD; x < W - PAD; x += 4) for (let y = PAD; y < H - 2; y++) {
        if (a[y * W + x] > 127 && a[(y + 2) * W + x] < 64 && a[(y - 10) * W + x] > 127) drips.push([x, y]);
      }
    }
    return { el, layer, w: W, h: H, sd: sdfFromAlpha(a, W, H), drips, size: parseFloat(getComputedStyle(el).fontSize) };
  });
};

/* ---------- start ---------- */
const canvas = document.querySelector('canvas.world');
const webgl2 = (() => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } })();
const saveData = navigator.connection?.saveData;

if (webgl2 && !saveData) start().catch((e) => { console.error(e); document.documentElement.classList.remove('gl'); });
else wireCasesWithoutGl();

async function start() {
  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.autoClear = false;
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const scene = new Scene();

  const blobs = Array.from({ length: MAX_BLOBS }, () => new Vector4());
  const texts = Array.from({ length: MAX_TEXTS }, () => new Vector4());
  const textUV = Array.from({ length: MAX_TEXTS }, () => new Vector4());
  const textInfo = Array.from({ length: MAX_TEXTS }, () => new Vector4());
  const secs = Array.from({ length: MAX_SECS }, () => new Vector4());
  const secColor = Array.from({ length: MAX_SECS }, () => new Vector3());
  const uniforms = {
    uView: { value: new Vector2(1, 1) }, uDpr: { value: 1 }, uTime: { value: 0 }, uVel: { value: 0 },
    uMouse: { value: new Vector2(-9999, -9999) }, uMouseOn: { value: 0 },
    uBlobs: { value: blobs }, uBlobCount: { value: 0 },
    uTexts: { value: texts }, uTextUV: { value: textUV }, uTextInfo: { value: textInfo }, uTextCount: { value: 0 },
    uAtlas: { value: null },
    uSecs: { value: secs }, uSecColor: { value: secColor }, uSecCount: { value: 0 },
    uColors: { value: LAYER_HEX.map((h) => vec3Of(hexRgb(h))) }, uWash: { value: new Vector3() }, uGround: { value: vec3Of(hexRgb('#F4F0FF')) },
  };
  const quad = new Mesh(new PlaneGeometry(2, 2), new ShaderMaterial({ vertexShader: quadVertex, fragmentShader: quadFragment, uniforms, glslVersion: GLSL3, depthTest: false, depthWrite: false }));
  quad.frustumCulled = false;
  scene.add(quad);
  const washBlobs = Array.from({ length: 32 }, () => new Vector4());
  const washUniforms = { uView: uniforms.uView, uDpr: uniforms.uDpr, uWash: uniforms.uWash, uWashBlobs: { value: washBlobs }, uWashCount: { value: 0 } };
  const washMesh = new Mesh(new PlaneGeometry(2, 2), new ShaderMaterial({ vertexShader: quadVertex, fragmentShader: washFragment, uniforms: washUniforms, glslVersion: GLSL3, transparent: true, premultipliedAlpha: true, blending: CustomBlending, blendSrc: OneFactor, blendDst: OneMinusSrcAlphaFactor, depthTest: false, depthWrite: false }));
  washMesh.frustumCulled = false;
  washMesh.renderOrder = 2;
  washMesh.visible = false;
  scene.add(washMesh);

  const view = { w: innerWidth, h: innerHeight, dpr: 1 };
  const resize = () => {
    view.w = innerWidth; view.h = innerHeight;
    view.dpr = Math.min(devicePixelRatio || 1, view.w < 700 ? 1.5 : 1.25);
    renderer.setPixelRatio(view.dpr);
    renderer.setSize(view.w, view.h, false);
    uniforms.uView.value.set(view.w, view.h);
    uniforms.uDpr.value = view.dpr;
  };
  resize();

  /* text atlas */
  let items = [];
  const buildAtlas = () => {
    const html = document.documentElement, had = html.classList.contains('gl');
    html.classList.remove('gl'); // read real text colors
    const els = [...document.querySelectorAll('[data-goo]')];
    const next = els.flatMap(rasterize);
    if (had) html.classList.add('gl');
    const AW = Math.max(2048, ...next.map((i) => i.w));
    let x = 0, y = 0, row = 0;
    [...next].sort((a, b) => b.h - a.h).forEach((it) => {
      if (x + it.w > AW) { x = 0; y += row + 2; row = 0; }
      it.ax = x; it.ay = y; x += it.w + 2; row = Math.max(row, it.h);
    });
    const AH = y + row;
    const data = new Float32Array(AW * AH).fill(SPREAD * 4);
    next.forEach((it) => { for (let r = 0; r < it.h; r++) data.set(it.sd.subarray(r * it.w, (r + 1) * it.w), (it.ay + r) * AW + it.ax); it.uv = new Vector4(it.ax / AW, it.ay / AH, (it.ax + it.w) / AW, (it.ay + it.h) / AH); it.sd = null; });
    const tex = new DataTexture(data, AW, AH, RedFormat, FloatType);
    tex.internalFormat = 'R16F';
    tex.minFilter = tex.magFilter = LinearFilter;
    tex.flipY = false;
    tex.needsUpdate = true;
    uniforms.uAtlas.value?.dispose();
    uniforms.uAtlas.value = tex;
    items = next.map((it, i) => ({ ...it, seed: i * 1.7, wob: it.size > 120 ? 1.6 : it.size > 50 ? 1.1 : 0.6, swell: it.size > 120 ? 9 : it.size > 50 ? 6 : 3 }));
  };

  /* jelly cards */
  const cardEls = [...document.querySelectorAll('.card')];
  const cards = cardEls.map((el, i) => {
    const mat = new ShaderMaterial({
      vertexShader: cardVertex, fragmentShader: cardFragment, transparent: true, depthTest: false, depthWrite: false,
      uniforms: { uRect: { value: new Vector4() }, uView: uniforms.uView, uVel: { value: 0 }, uMouse: uniforms.uMouse, uHover: { value: 0 }, uPress: { value: 0 }, uTime: uniforms.uTime, uPhase: { value: i * 1.3 }, uAlive: { value: 1 }, uTex: { value: null } },
    });
    const mesh = new Mesh(new PlaneGeometry(1, 1, 40, 28), mat);
    mesh.frustumCulled = false;
    mesh.renderOrder = 1;
    mesh.visible = false;
    scene.add(mesh);
    const c = { el, mat, mesh, hover: 0, hv: 0, hoverT: 0, press: 0, pv: 0, pressT: 0, lag: 0, lv: 0 };
    const on = () => (c.hoverT = 1), off = () => { if (!el.matches(':hover') && document.activeElement !== el) c.hoverT = 0; c.pressT = 0; };
    el.addEventListener('pointerenter', on); el.addEventListener('focus', on);
    el.addEventListener('pointerleave', off); el.addEventListener('blur', off);
    el.addEventListener('pointerdown', () => (c.pressT = 1));
    el.addEventListener('pointerup', () => (c.pressT = 0));
    return c;
  });
  // Draws an element's words where the browser laid them out, so wrapping and spacing match the DOM exactly
  const drawWords = (ctx, el, box, dx = 0, dy = 0) => {
    const range = document.createRange(), walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const cs = getComputedStyle(node.parentElement);
      ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      if ('letterSpacing' in ctx) ctx.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
      for (const m of node.textContent.matchAll(/\S+/g)) {
        range.setStart(node, m.index); range.setEnd(node, m.index + m[0].length);
        const r = range.getClientRects()[0];
        if (!r) continue;
        const word = cs.textTransform === 'uppercase' ? m[0].toUpperCase() : m[0];
        const ascent = ctx.measureText(word).fontBoundingBoxAscent ?? parseFloat(cs.fontSize) * 0.8;
        ctx.fillText(word, r.left - box.left + dx, r.top - box.top + dy + ascent);
      }
    }
  };
  const roundRect = (ctx, x, y, w, h, r) => { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); };
  const paintCards = async () => {
    await Promise.all(cards.map(async (c) => {
      const img = c.el.querySelector('img');
      img.loading = 'eager';
      try { await img.decode(); } catch { /* draw without it */ }
      const box = c.el.getBoundingClientRect(), s = Math.min(devicePixelRatio || 1, 2);
      const cv = document.createElement('canvas');
      cv.width = Math.ceil(box.width * s); cv.height = Math.ceil(box.height * s);
      const ctx = cv.getContext('2d');
      ctx.scale(s, s);
      const cs = getComputedStyle(c.el);
      ctx.fillStyle = cs.getPropertyValue('--cf').trim();
      ctx.fillRect(0, 0, box.width, box.height);
      const shot = c.el.querySelector('.shot').getBoundingClientRect();
      const sx = shot.left - box.left, sy = shot.top - box.top;
      ctx.save();
      roundRect(ctx, sx, sy, shot.width, shot.height, 18);
      ctx.clip();
      if (img.naturalWidth) {
        const k = shot.width / img.naturalWidth;
        ctx.drawImage(img, sx, sy, shot.width, img.naturalHeight * k);
      }
      ctx.restore();
      ctx.fillStyle = cs.getPropertyValue('--ct').trim();
      ctx.textBaseline = 'alphabetic';
      for (const t of c.el.querySelectorAll('h3, span')) drawWords(ctx, t, box);
      const tex = new CanvasTexture(cv);
      c.mat.uniforms.uTex.value?.dispose();
      c.mat.uniforms.uTex.value = tex;
      c.mesh.visible = true;
    }));
  };

  await document.fonts.ready;
  buildAtlas();
  await paintCards();
  document.documentElement.classList.add('gl');

  let rebuildTimer = 0, lastW = innerWidth;
  addEventListener('resize', () => {
    resize();
    if (innerWidth === lastW) return; // phone toolbars change the height only
    lastW = innerWidth;
    clearTimeout(rebuildTimer);
    rebuildTimer = setTimeout(() => { buildAtlas(); paintCards(); }, 180);
  });

  /* sections */
  const sectionEls = [...document.querySelectorAll('[data-section]')].slice(0, MAX_SECS);
  const sectionRgb = sectionEls.map((el) => vec3Of(hexRgb(getComputedStyle(el).getPropertyValue('--bg').trim())));
  // Same wave as the shader, so section drips hang from the real edge
  const wave = (x, amp, seed, t) => Math.sin(x * 0.0055 + t * 0.6 + seed * 2.3) * amp + Math.sin(x * 0.0131 - t * 0.9 + seed) * amp * 0.45;

  /* pointer */
  const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, vx: 0, vy: 0, on: 0, onV: 0, onT: 0, layer: 4 };
  addEventListener('pointermove', (e) => {
    if (mouse.tx < -9000) { mouse.x = e.clientX; mouse.y = e.clientY; }
    mouse.tx = e.clientX; mouse.ty = e.clientY; mouse.onT = 1;
  }, { passive: true });
  document.addEventListener('pointerleave', () => (mouse.onT = 0));
  addEventListener('blur', () => (mouse.onT = 0));

  /* drips, splashes, ambient */
  const drips = [];
  const splashes = [];
  const rand = (a, b) => a + Math.random() * (b - a);
  const hero = document.querySelector('.hero');
  // Ambient goo over the headline: anchors are fractions of the h1 box (x across it, y up from its top
  // toward the nav), except the grape ones that live beside "squishy." and keep melting into it
  const heroTitle = hero.querySelector('h1'), heroEm = heroTitle.querySelector('em');
  const L = (h) => LAYER_HEX.indexOf(h);
  const AMBIENT = [
    ['top', L('#C2F23D'), 0.66, 0.62, 0.075, 0.3, 0], ['top', L('#C2F23D'), 0.76, 0.38, 0.045, 0.4, 1.3], ['top', L('#FF8AD8'), 0.86, 0.74, 0.05, 0.5, 2.1],
    ['top', L('#FF5F1F'), 0.93, 0.45, 0.06, 0.45, 4.2], ['top', L('#C2F23D'), 0.97, 0.82, 0.03, 0.6, 5.5], ['top', L('#FF5F1F'), 0.58, 0.88, 0.028, 0.5, 6.1],
    ['em', L('#7A35FF'), 1.12, 0.5, 0.05, 0.35, 3.4], ['em', L('#7A35FF'), 1.3, 0.3, 0.032, 0.55, 7.7], ['em', L('#7A35FF'), 1.22, 0.78, 0.024, 0.5, 8.2],
  ].map(([at, layer, x, y, s, sp, ph]) => ({ at, layer, x, y, s, sp, ph, ox: 0, oy: 0, vx: 0, vy: 0 }));

  // Poke: a splash of droplets in the color of whatever goo text was hit
  addEventListener('pointerdown', (e) => {
    if (still()) return;
    const hit = items.find((it) => { const r = it.el.getBoundingClientRect(); return e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom; });
    if (!hit) return;
    for (let i = 0; i < 7; i++) {
      const a = rand(-Math.PI * 0.95, -Math.PI * 0.05);
      splashes.push({ x: e.clientX, y: e.clientY + scrollY, vx: Math.cos(a) * rand(120, 420), vy: Math.sin(a) * rand(200, 520), r: rand(5, 13) * (hit.size > 100 ? 1.4 : 1), layer: hit.layer, life: 0 });
    }
  });

  /* case studies: wash in, dialog, wash out */
  const data = JSON.parse(document.getElementById('work-data').textContent);
  const dialog = document.getElementById('case');
  let wash = null;
  const fillDialog = (d) => {
    dialog.style.setProperty('--cf', d.fill); dialog.style.setProperty('--ct', d.text);
    dialog.querySelector('h2').textContent = d.title;
    dialog.querySelector('.sum').textContent = `${d.client}. ${d.summary}`;
    const img = dialog.querySelector('img');
    img.src = `work/${d.slug}.webp`; img.alt = d.alt; img.height = d.height;
    dialog.querySelector('.problem').innerHTML = `<p>${d.problem}</p>`;
    dialog.querySelector('.did').innerHTML = d.did.map((p) => `<p>${p}</p>`).join('');
  };
  const startWash = (color, from, dir, done) => {
    uniforms.uWash.value.copy(vec3Of(hexRgb(color)));
    const cols = 6, rows = 5, cw = view.w / cols, ch = view.h / rows, R = Math.hypot(cw, ch) * 0.72;
    const cells = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = (c + 0.5 + rand(-0.2, 0.2)) * cw, y = (r + 0.5 + rand(-0.2, 0.2)) * ch;
      cells.push({ x, y, R: R * rand(0.95, 1.15), lag: Math.hypot(x - from.x, y - from.y) / Math.hypot(view.w, view.h) * 0.45 + rand(0, 0.12) });
    }
    wash = { t: 0, dir, from, cells, done, dur: 0.75 };
  };
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);
  let activeCard = null;
  cardEls.forEach((el) => el.addEventListener('click', (e) => {
    e.preventDefault();
    const d = data.find((x) => x.slug === el.dataset.case);
    fillDialog(d);
    activeCard = el;
    const r = el.getBoundingClientRect();
    if (still()) { dialog.showModal(); return; }
    startWash(d.fill, { x: r.left + r.width / 2, y: r.top + r.height / 2 }, 1, () => { dialog.showModal(); dialog.setAttribute('data-in', ''); });
  }));
  const closeCase = () => dialog.close();
  dialog.querySelector('[data-close]').addEventListener('click', closeCase);
  dialog.addEventListener('close', () => {
    dialog.removeAttribute('data-in');
    const r = activeCard?.getBoundingClientRect();
    if (!still() && r) startWash(getComputedStyle(dialog).getPropertyValue('--cf').trim(), { x: r.left + r.width / 2, y: r.top + r.height / 2 }, -1, null);
    activeCard?.focus();
  });

  /* frame */
  let time = 0, last = performance.now(), lastScroll = scrollY, vel = 0, nextDrip = 1, nextSecDrip = 0.5;
  const spring = (o, key, vkey, target, k = 0.08, d = 0.82) => { o[vkey] = (o[vkey] + (target - o[key]) * k) * d; o[key] += o[vkey]; };

  const frame = (now) => {
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (dialog.open && !wash) return; // the case study covers the canvas
    const s = still();
    if (!s) time += dt;
    const dy = scrollY - lastScroll;
    lastScroll = scrollY;
    vel += ((s ? 0 : Math.max(-90, Math.min(90, dy))) - vel) * 0.18;
    uniforms.uTime.value = time;
    uniforms.uVel.value = vel;

    let n = 0;
    const push = (x, y, r, layer) => {
      if (n >= MAX_BLOBS || r < 0.6) return;
      const R = r * K;
      if (x + R < 0 || x - R > view.w || y + R < 0 || y - R > view.h) return;
      blobs[n++].set(x, y, r, layer);
    };

    // pointer: springs to the cursor, stretches along travel, takes the color of the nearest goo text
    if (s) mouse.onT = 0;
    spring(mouse, 'on', 'onV', mouse.onT, 0.12, 0.7);
    mouse.vx = (mouse.vx + (mouse.tx - mouse.x) * 0.08) * 0.82;
    mouse.vy = (mouse.vy + (mouse.ty - mouse.y) * 0.08) * 0.82;
    mouse.x += mouse.vx; mouse.y += mouse.vy;
    uniforms.uMouse.value.set(mouse.tx, mouse.ty);
    uniforms.uMouseOn.value = Math.max(0, mouse.on);

    // visible text items
    let tn = 0, nearest = null, nd = 260;
    const rects = new Map();
    for (const it of items) {
      const r = it.el.getBoundingClientRect();
      const x = r.left - PAD, y = r.top - PAD;
      rects.set(it, { x, y });
      if (y > view.h || y + it.h < 0 || x > view.w || x + it.w < 0 || tn >= MAX_TEXTS) continue;
      texts[tn].set(x, y, it.w, it.h);
      textUV[tn].copy(it.uv);
      textInfo[tn].set(it.layer, s ? 0 : it.wob, it.swell, it.seed);
      tn++;
      const dx = Math.max(r.left - mouse.tx, 0, mouse.tx - r.right), dyy = Math.max(r.top - mouse.ty, 0, mouse.ty - r.bottom), dd = Math.hypot(dx, dyy);
      if (dd < nd) { nd = dd; nearest = it; }
    }
    uniforms.uTextCount.value = tn;
    if (nearest) mouse.layer = nearest.layer;
    // The cursor blob only shows up near goo type, so it never sits under body copy
    if (!s && mouse.tx > -9000) mouse.onT = nearest && nd < 90 && document.hasFocus() ? 1 : 0;

    const mOn = Math.max(0, mouse.on);
    if (mOn > 0.02) {
      const speed = Math.hypot(mouse.vx, mouse.vy), st = Math.min(speed / 40, 0.6), r = 18 * mOn;
      push(mouse.x, mouse.y, r, mouse.layer);
      if (st > 0.04) push(mouse.x - mouse.vx * 2.2, mouse.y - mouse.vy * 2.2, r * (0.45 + st * 0.5), mouse.layer);
    }

    // wordmark drops
    document.querySelectorAll('[data-blob]').forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const wob = s ? 0 : Math.sin(time * 2.4 + i) * 0.08;
      push(r.left + r.width / 2, r.top + r.height / 2 + (s ? 0 : Math.sin(time * 1.7 + i) * 1.5), (r.width / 2) * (1 + wob), 0);
    });

    // hero ambient: drifts, flees the pointer on a spring, lags behind scroll
    const hr = hero.getBoundingClientRect();
    if (hr.bottom > -200) {
      const S = Math.min(hr.width, view.h);
      const tr = heroTitle.getBoundingClientRect(), er = heroEm.getClientRects()[0] || tr, navH = 90;
      for (const b of AMBIENT) {
        const ax = b.at === 'em' ? er.left + b.x * er.width : tr.left + b.x * tr.width;
        const ay = b.at === 'em' ? er.top + b.y * er.height : tr.top - b.y * Math.max(tr.top - navH, 60);
        const bx = ax + Math.cos(time * b.sp + b.ph) * S * 0.03;
        const by = ay + Math.sin(time * b.sp * 1.3 + b.ph) * S * 0.03;
        let tx = 0, ty = 0;
        const dx = bx - mouse.x, dyy = by - mouse.y, d = Math.hypot(dx, dyy), reach = b.s * S + 120;
        if (mOn > 0.1 && d < reach) { const k = (1 - d / reach) * 90; tx = (dx / (d || 1)) * k; ty = (dyy / (d || 1)) * k; }
        ty += -vel * 1.4 * (b.s * 10);
        spring(b, 'ox', 'vx', tx); spring(b, 'oy', 'vy', ty);
        push(bx + b.ox, by + b.oy, b.s * S, b.layer);
      }
    }

    // text drips: one at a time from a random underside, ooze, stretch, let go, get absorbed
    if (!s) {
      nextDrip -= dt;
      const drippy = items.filter((it) => it.drips.length && rects.get(it).y < view.h && rects.get(it).y + it.h > 0);
      if (nextDrip <= 0 && drippy.length && drips.length < 14) {
        const it = drippy[Math.floor(Math.random() * drippy.length)];
        const [ox, oy] = it.drips[Math.floor(Math.random() * it.drips.length)];
        const rMax = Math.min(Math.max(it.size * 0.055, 5), 15) * rand(0.8, 1.2);
        drips.push({ kind: 'text', it, ox, oy, rMax, t: 0, len: 0, v: 0, detach: rMax * rand(5, 9), layer: it.layer });
        nextDrip = rand(0.35, 1.1);
      }
      nextSecDrip -= dt;
      if (nextSecDrip <= 0 && drips.length < 20) {
        const visible = sectionEls.map((el, i) => [el.getBoundingClientRect(), i]).filter(([r]) => r.bottom > 0 && r.bottom < view.h + 40);
        if (visible.length) {
          const [, i] = visible[Math.floor(Math.random() * visible.length)];
          const rMax = rand(12, 26);
          drips.push({ kind: 'sec', i, ox: rand(0.05, 0.95), rMax, t: 0, len: 0, v: 0, detach: rMax * rand(4, 8), layer: SEC0 + i });
        }
        nextSecDrip = rand(0.4, 1.2);
      }
    }
    const secRects = sectionEls.map((el) => el.getBoundingClientRect());
    for (let i = drips.length - 1; i >= 0; i--) {
      const d = drips[i];
      if (!s) {
        d.t += dt;
        if (d.t > 1.1) { d.v += (d.len > d.detach ? 900 : 70) * dt; d.len += d.v * dt; }
      }
      let x, y;
      if (d.kind === 'text') { const r = rects.get(d.it); x = r.x + d.ox; y = r.y + d.oy; }
      else { const r = secRects[d.i]; x = d.ox * view.w; y = r.bottom + wave(x, 8 + Math.min(Math.abs(vel) * 0.9, 40), d.i, time) - 6; }
      const grow = Math.min(d.t / 1.1, 1), r = d.rMax * (grow < 1 ? ease(grow) : 1);
      if (d.len <= d.detach) {
        push(x, y + r * 0.35, r * 0.8, d.layer);
        if (d.len > 2) push(x, y + r * 0.35 + d.len * 0.5, r * 0.62 * (1 - (d.len / d.detach) * 0.55), d.layer);
        push(x, y + r * 0.35 + d.len, r, d.layer);
      } else {
        // let go: falls and is absorbed fast, so it never sits over body copy
        const k = Math.max(0, 1 - (d.len - d.detach) / (d.rMax * 4));
        push(x, y + r * 0.35 + d.len, r * k, d.layer);
        if (k <= 0) drips.splice(i, 1);
      }
    }

    // splashes
    for (let i = splashes.length - 1; i >= 0; i--) {
      const p = splashes[i];
      p.life += dt; p.vy += 1500 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      const k = 1 - p.life / 0.9;
      if (k <= 0) { splashes.splice(i, 1); continue; }
      push(p.x, p.y - scrollY, p.r * k, p.layer);
    }

    // sections
    sectionEls.forEach((el, i) => {
      const r = secRects[i];
      secs[i].set(i === 0 ? r.top : r.top - 90, r.bottom, s ? 6 : 8 + Math.min(Math.abs(vel) * 0.9, 40), i === 0 ? 1 : 0);
      secColor[i].copy(sectionRgb[i]);
    });
    uniforms.uSecCount.value = sectionEls.length;

    // wash
    let wn = 0;
    if (wash) {
      wash.t += dt;
      let doneAll = true;
      for (const c of wash.cells) {
        let k = Math.min(Math.max((wash.t - c.lag) / wash.dur, 0), 1);
        if (k < 1) doneAll = false;
        k = ease(k);
        if (wash.dir < 0) k = 1 - k;
        washBlobs[wn++].set(wash.from.x + (c.x - wash.from.x) * k, wash.from.y + (c.y - wash.from.y) * k, c.R * (0.15 + 0.85 * k), 0);
      }
      if (doneAll) { const cb = wash.done; wash = null; cb?.(); }
    }
    washUniforms.uWashCount.value = wn;
    washMesh.visible = wn > 0;

    uniforms.uBlobCount.value = n;

    // cards
    for (const c of cards) {
      const r = c.el.getBoundingClientRect();
      c.mesh.visible = !!c.mat.uniforms.uTex.value && r.bottom > -100 && r.top < view.h + 100;
      if (!c.mesh.visible) continue;
      if (s) { c.hover = c.hoverT; c.press = c.pressT; c.hv = c.pv = 0; }
      else { spring(c, 'hover', 'hv', c.hoverT); spring(c, 'press', 'pv', c.pressT, 0.2, 0.7); }
      c.mat.uniforms.uRect.value.set(r.left, r.top, r.width, r.height);
      c.mat.uniforms.uHover.value = c.hover;
      c.mat.uniforms.uPress.value = c.press;
      c.mat.uniforms.uVel.value = vel;
      c.mat.uniforms.uAlive.value = s ? 0 : 1;
    }

    renderer.render(scene, camera);
  };
  requestAnimationFrame(frame);
}

function wireCasesWithoutGl() {
  const data = JSON.parse(document.getElementById('work-data').textContent);
  const dialog = document.getElementById('case');
  document.querySelectorAll('.card').forEach((el) => el.addEventListener('click', (e) => {
    e.preventDefault();
    const d = data.find((x) => x.slug === el.dataset.case);
    dialog.style.setProperty('--cf', d.fill); dialog.style.setProperty('--ct', d.text);
    dialog.querySelector('h2').textContent = d.title;
    dialog.querySelector('.sum').textContent = `${d.client}. ${d.summary}`;
    const img = dialog.querySelector('img');
    img.src = `work/${d.slug}.webp`; img.alt = d.alt;
    dialog.querySelector('.problem').innerHTML = `<p>${d.problem}</p>`;
    dialog.querySelector('.did').innerHTML = d.did.map((p) => `<p>${p}</p>`).join('');
    dialog.showModal();
  }));
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
}
