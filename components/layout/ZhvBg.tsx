"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-driven canvas backdrop for the home editorial zone.
 * Starts at data-start (#firm) and fades with scroll through the marked .zhv-zone sections.
 */
export function ZhvBg({
  start = "#firm",
  end = "#contact",
  ambient = 0.6,
}: {
  start?: string;
  end?: string;
  ambient?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bg = rootRef.current;
    if (!bg) return;
    const startEl = document.querySelector(start);
    if (!startEl) return;
    const endEl = end ? document.querySelector(end) : null;
    const AMB = ambient;
    const cv = bg.querySelector("canvas");
    const title = bg.querySelector<HTMLElement>(".zhv-bg__title");
    if (!cv || !title) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const letters = [...title.querySelectorAll("span")];
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const bell = (t: number) => Math.sin(Math.PI * clamp(t));
    const stag = (t: number, d: number) => clamp((t - d * 0.4) / 0.6);
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const LAYERS = [1, 0.77, 0.54, 0.31];
    const INNER_START = 0.14;
    let W = 0;
    let H = 0;
    let M = 0;
    let CX = 0;
    let CY = 0;
    let R = 0;
    let G = 0;
    let GCY = 0;
    let BW = 0;
    let BASE = 0;
    let DPR = 1;

    function dropPoint(r: number, s: number) {
      const L = 2 * r + 1.5 * Math.PI * r;
      const d = s * L;
      const k = Math.SQRT1_2;
      const T = { x: CX, y: CY - r * Math.SQRT2 };
      const A = { x: CX - r * k, y: CY - r * k };
      const B = { x: CX + r * k, y: CY - r * k };
      if (d <= r) {
        const u = d / r;
        return { x: lerp(T.x, A.x, u), y: lerp(T.y, A.y, u) };
      }
      if (d <= r + 1.5 * Math.PI * r) {
        const a = (5 * Math.PI) / 4 - (d - r) / r;
        return { x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r };
      }
      const u = (d - r - 1.5 * Math.PI * r) / r;
      return { x: lerp(B.x, T.x, u), y: lerp(B.y, T.y, u) };
    }

    function traceDrop(r: number, s0: number, s1: number, close: boolean) {
      const n = Math.max(2, Math.ceil((s1 - s0) * 320));
      ctx!.beginPath();
      for (let j = 0; j <= n; j++) {
        const q = dropPoint(r, s0 + ((s1 - s0) * j) / n);
        if (j) ctx!.lineTo(q.x, q.y);
        else ctx!.moveTo(q.x, q.y);
      }
      if (close) ctx!.closePath();
    }

    type Particle = {
      sx: number;
      sy: number;
      ph: number;
      sp: number;
      sz: number;
      gx: number;
      gy: number;
      gz: number;
      bar: number;
      bh: number;
      bj: number;
      layer: number;
      ds: number;
      d: number;
    };

    const N = matchMedia("(max-width:700px)").matches ? 380 : 640;
    const P: Particle[] = [];
    const lsum = LAYERS.reduce((a, b) => a + b, 0);
    for (let i = 0; i < N; i++) {
      const k = i + 0.5;
      const phi = Math.acos(1 - (2 * k) / N);
      const th = Math.PI * (1 + Math.sqrt(5)) * k;
      let pick = Math.random() * lsum;
      let layer = 0;
      while (pick > LAYERS[layer]) {
        pick -= LAYERS[layer];
        layer++;
      }
      P.push({
        sx: Math.random(),
        sy: Math.random(),
        ph: rnd(0, 6.28),
        sp: rnd(0.25, 0.7),
        sz: rnd(0.55, 1.6),
        gx: Math.sin(phi) * Math.cos(th),
        gy: Math.cos(phi),
        gz: Math.sin(phi) * Math.sin(th),
        bar: i % 9,
        bh: Math.pow(Math.random(), 0.8),
        bj: rnd(-0.5, 0.5),
        layer,
        ds: layer === 3 ? rnd(INNER_START, 1) : Math.random(),
        d: Math.random(),
      });
    }

    type Vec = { gx: number; gy: number; gz: number };
    const NODES: Vec[] = [
      [25.76, -80.19],
      [18.47, -66.1],
      [25.08, 55.14],
    ].map(([la0, lo0]) => {
      const la = (la0 * Math.PI) / 180;
      const lo = (lo0 * Math.PI) / 180;
      return {
        gx: Math.cos(la) * Math.cos(lo),
        gy: -Math.sin(la),
        gz: Math.cos(la) * Math.sin(lo),
      };
    });

    function project(v: Vec, rot: number, tilt: number) {
      const x1 = v.gx * Math.cos(rot) - v.gz * Math.sin(rot);
      const z1 = v.gx * Math.sin(rot) + v.gz * Math.cos(rot);
      const y2 = v.gy * Math.cos(tilt) - z1 * Math.sin(tilt);
      const z2 = v.gy * Math.sin(tilt) + z1 * Math.cos(tilt);
      return { x: CX + x1 * G, y: GCY + y2 * G, z: z2 };
    }

    function slerp(a: Vec, b: Vec, t: number) {
      const dot = clamp(a.gx * b.gx + a.gy * b.gy + a.gz * b.gz, -1, 1);
      const om = Math.acos(dot);
      const so = Math.sin(om) || 1;
      const ka = Math.sin((1 - t) * om) / so;
      const kb = Math.sin(t * om) / so;
      const lift = 1 + 0.18 * Math.sin(Math.PI * t);
      return {
        gx: (a.gx * ka + b.gx * kb) * lift,
        gy: (a.gy * ka + b.gy * kb) * lift,
        gz: (a.gz * ka + b.gz * kb) * lift,
      };
    }

    function resize() {
      W = innerWidth;
      H = innerHeight;
      DPR = Math.min(2, devicePixelRatio || 1);
      cv!.width = W * DPR;
      cv!.height = H * DPR;
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
      const portrait = W < H;
      M = Math.min(W, H);
      R = M * (portrait ? 0.23 : 0.17);
      CX = W / 2;
      CY = H * 0.43 + 0.207 * R;
      G = M * (portrait ? 0.38 : 0.28);
      GCY = H * 0.47;
      BW = M * (portrait ? 0.78 : 0.64);
      BASE = H * 0.47 + M * (portrait ? 0.24 : 0.2);
      title!.style.fontSize = `${Math.max(20, R * 0.34)}px`;
      title!.style.top = `${CY + R + R * 0.52}px`;
    }

    let target = 0;
    let cur = reduce ? 1 : 0;
    let vis = 0;
    let raf = 0;
    let alive = true;

    function readZone() {
      const sy = scrollY;
      const vh = innerHeight;
      const top = startEl!.getBoundingClientRect().top + sy;
      const bottom = endEl
        ? endEl.getBoundingClientRect().bottom + sy
        : document.documentElement.scrollHeight;
      const raw = clamp((sy + vh - top) / Math.max(1, bottom - top));
      target = reduce ? 1 : clamp(raw / 0.92);
      vis = Math.min(clamp((sy + vh - top) / (vh * 0.5)), clamp((bottom - sy) / (vh * 0.5)));
      bg!.style.opacity = String(vis * 0.6);
    }

    function metal() {
      const g = ctx!.createLinearGradient(CX - R * 1.1, CY - R * 1.6, CX + R * 1.1, CY + R * 1.1);
      g.addColorStop(0, "#8c8c8c");
      g.addColorStop(0.2, "#f5f5f5");
      g.addColorStop(0.4, "#9a9a9a");
      g.addColorStop(0.58, "#ffffff");
      g.addColorStop(0.78, "#767676");
      g.addColorStop(1, "#dcdcdc");
      return g;
    }

    function frame(ms: number) {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      readZone();
      if (vis <= 0) return;
      const time = ms / 1000;
      cur += (target - cur) * 0.1;
      if (Math.abs(target - cur) < 1e-4) cur = target;
      const p = cur;
      ctx!.clearRect(0, 0, W, H);

      const scan = seg(p, 0.02, 0.2);
      const t1 = seg(p, 0.18, 0.32);
      const t2 = seg(p, 0.45, 0.56);
      const t3 = seg(p, 0.64, 0.75);
      const rot = p * 5.2 + time * 0.04;
      const tilt = 0.38;
      const growth = easeOut(seg(p, 0.5, 0.64));
      const fadeP = 1 - seg(p, 0.77, 0.87);
      const intro = 0.35 + 0.65 * easeOut(seg(p, 0, 0.06));
      const scanY = lerp(-0.1 * H, 1.1 * H, ease(scan));
      const sp = BW / 9;
      const barH = (b: number) => M * (0.06 + 0.34 * Math.pow(b / 8, 1.35)) * growth;

      ctx!.save();
      ctx!.globalAlpha = AMB;

      const gridA = bell(seg(p, 0, 0.24)) * 0.06;
      if (gridA > 0.002) {
        ctx!.strokeStyle = `rgba(255,255,255,${gridA})`;
        ctx!.lineWidth = 1;
        const step = M * 0.085;
        ctx!.beginPath();
        for (let x = CX % step; x < W; x += step) {
          ctx!.moveTo(x, 0);
          ctx!.lineTo(x, H);
        }
        for (let y = GCY % step; y < H; y += step) {
          ctx!.moveTo(0, y);
          ctx!.lineTo(W, y);
        }
        ctx!.stroke();
      }

      const scanA = bell(scan);
      if (scanA > 0.01) {
        const g = ctx!.createLinearGradient(0, scanY - M * 0.12, 0, scanY);
        g.addColorStop(0, "rgba(255,255,255,0)");
        g.addColorStop(1, `rgba(255,255,255,${0.07 * scanA})`);
        ctx!.fillStyle = g;
        ctx!.fillRect(0, scanY - M * 0.12, W, M * 0.12);
        const l = ctx!.createLinearGradient(0, 0, W, 0);
        l.addColorStop(0, "rgba(255,255,255,0)");
        l.addColorStop(0.5, `rgba(255,255,255,${0.85 * scanA})`);
        l.addColorStop(1, "rgba(255,255,255,0)");
        ctx!.fillStyle = l;
        ctx!.fillRect(0, scanY - 0.5, W, 1);
      }

      const gA = seg(p, 0.26, 0.34) * (1 - seg(p, 0.45, 0.5));
      if (gA > 0.01) {
        ctx!.strokeStyle = `rgba(255,255,255,${0.12 * gA})`;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.arc(CX, GCY, G, 0, Math.PI * 2);
        ctx!.stroke();
        const aT = ease(seg(p, 0.32, 0.43));
        for (let n = 0; n < 2; n++) {
          const a = NODES[n];
          const b = NODES[n + 1];
          const steps = 60;
          const lim = Math.floor(steps * aT);
          ctx!.beginPath();
          for (let j = 0; j <= lim; j++) {
            const q = project(slerp(a, b, j / steps), rot, tilt);
            if (j) ctx!.lineTo(q.x, q.y);
            else ctx!.moveTo(q.x, q.y);
          }
          ctx!.strokeStyle = `rgba(255,255,255,${0.7 * gA})`;
          ctx!.lineWidth = 1.2;
          ctx!.stroke();
        }
        NODES.forEach((nd, i) => {
          const q = project(nd, rot, tilt);
          if (q.z < -0.15) return;
          const pr = M * 0.03 * (1 + 0.5 * Math.sin(time * 3 + i * 2));
          const rg = ctx!.createRadialGradient(q.x, q.y, 0, q.x, q.y, pr);
          rg.addColorStop(0, `rgba(255,255,255,${0.9 * gA})`);
          rg.addColorStop(1, "rgba(255,255,255,0)");
          ctx!.fillStyle = rg;
          ctx!.beginPath();
          ctx!.arc(q.x, q.y, pr, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.fillStyle = `rgba(255,255,255,${gA})`;
          ctx!.beginPath();
          ctx!.arc(q.x, q.y, 2.2, 0, Math.PI * 2);
          ctx!.fill();
        });
      }

      const bA = seg(p, 0.5, 0.56) * (1 - seg(p, 0.64, 0.7));
      if (bA > 0.01) {
        ctx!.strokeStyle = `rgba(255,255,255,${0.25 * bA})`;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(CX - BW / 2 - sp * 0.3, BASE + 6);
        ctx!.lineTo(CX + BW / 2 + sp * 0.3, BASE + 6);
        ctx!.stroke();
        const cT = ease(seg(p, 0.55, 0.66));
        const pts = [];
        for (let b = 0; b < 9; b++) {
          pts.push({ x: CX - BW / 2 + (b + 0.5) * sp, y: BASE - barH(b) - M * 0.035 });
        }
        const total = 8 * cT;
        let end = pts[0];
        ctx!.beginPath();
        ctx!.moveTo(end.x, end.y);
        for (let j = 1; j < 9; j++) {
          const u = clamp(total - (j - 1));
          if (u <= 0) break;
          end = { x: lerp(pts[j - 1].x, pts[j].x, u), y: lerp(pts[j - 1].y, pts[j].y, u) };
          ctx!.lineTo(end.x, end.y);
        }
        const lg = ctx!.createLinearGradient(pts[0].x, 0, pts[8].x, 0);
        lg.addColorStop(0, `rgba(255,255,255,${0.15 * bA})`);
        lg.addColorStop(1, `rgba(255,255,255,${0.95 * bA})`);
        ctx!.strokeStyle = lg;
        ctx!.lineWidth = 1.6;
        ctx!.lineJoin = "round";
        ctx!.stroke();
        if (cT > 0) {
          const rg = ctx!.createRadialGradient(end.x, end.y, 0, end.x, end.y, M * 0.035);
          rg.addColorStop(0, `rgba(255,255,255,${bA})`);
          rg.addColorStop(1, "rgba(255,255,255,0)");
          ctx!.fillStyle = rg;
          ctx!.beginPath();
          ctx!.arc(end.x, end.y, M * 0.035, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      const halo = seg(p, 0.78, 0.96);
      if (halo > 0) {
        const rg = ctx!.createRadialGradient(CX, CY - R * 0.2, 0, CX, CY - R * 0.2, R * 2.2);
        rg.addColorStop(0, `rgba(255,255,255,${0.11 * halo})`);
        rg.addColorStop(1, "rgba(255,255,255,0)");
        ctx!.fillStyle = rg;
        ctx!.fillRect(0, 0, W, H);
      }
      const rp = seg(p, 0.8, 0.99);
      for (let k = 0; k < 3; k++) {
        const q = clamp(rp * 1.5 - k * 0.25);
        if (q <= 0 || q >= 1) continue;
        traceDrop(R * (1.08 + easeOut(q) * 1.1), 0, 1, true);
        ctx!.strokeStyle = `rgba(255,255,255,${(1 - q) * 0.22})`;
        ctx!.lineWidth = 1;
        ctx!.stroke();
      }
      ctx!.restore();

      if (fadeP > 0) {
        ctx!.fillStyle = "#fff";
        for (const q of P) {
          let x = q.sx * W + Math.sin(time * q.sp + q.ph) * M * 0.012;
          let y = q.sy * H + Math.cos(time * q.sp * 0.8 + q.ph) * M * 0.012;
          let a = 0.28;
          let s = q.sz;
          if (y < scanY) a = 0.55;
          if (Math.abs(y - scanY) < M * 0.04) a = 1;
          const e1 = ease(stag(t1, q.d));
          if (e1 > 0) {
            const g = project(q, rot, tilt);
            const dp = (g.z + 1) / 2;
            x = lerp(x, g.x, e1);
            y = lerp(y, g.y, e1);
            a = lerp(a, 0.15 + 0.85 * dp, e1);
            s = lerp(s, q.sz * (0.6 + 0.7 * dp), e1);
          }
          const e2 = ease(stag(t2, q.d));
          if (e2 > 0) {
            const bx = CX - BW / 2 + (q.bar + 0.5) * sp + q.bj * sp * 0.42;
            const by = BASE - q.bh * barH(q.bar);
            x = lerp(x, bx, e2);
            y = lerp(y, by, e2);
            a = lerp(a, 0.35 + 0.65 * q.bh, e2);
          }
          const e3 = ease(stag(t3, q.d));
          if (e3 > 0) {
            const dp = dropPoint(R * LAYERS[q.layer], q.ds);
            x = lerp(x, dp.x, e3);
            y = lerp(y, dp.y, e3);
            a = lerp(a, 0.9, e3);
            s = lerp(s, 1.1, e3);
          }
          ctx!.globalAlpha = clamp(a * intro * fadeP) * lerp(AMB, 1, e3);
          ctx!.beginPath();
          ctx!.arc(x, y, Math.max(0.6, s * M * 0.0019), 0, Math.PI * 2);
          ctx!.fill();
        }
        ctx!.globalAlpha = 1;
      }

      const lw = R * 0.078;
      const mg = metal();
      const glow = seg(p, 0.84, 0.97);
      const drawn: [number, number, number, boolean][] = [];
      ctx!.lineCap = "butt";
      ctx!.lineJoin = "miter";
      ctx!.miterLimit = 4;
      LAYERS.forEach((f, i) => {
        const t = ease(seg(p, 0.7 + i * 0.035, 0.83 + i * 0.03));
        if (t <= 0) return;
        const r = R * f;
        const s0 = i === 3 ? INNER_START : 0;
        const s1 = s0 + (1 - s0) * t;
        const closed = i < 3 && t >= 1;
        drawn.push([r, s0, s1, closed]);
        ctx!.save();
        ctx!.shadowColor = "rgba(255,255,255,.45)";
        ctx!.shadowBlur = R * (0.04 + 0.14 * glow);
        traceDrop(r, s0, s1, closed);
        ctx!.strokeStyle = mg;
        ctx!.lineWidth = lw;
        ctx!.stroke();
        ctx!.restore();
        if (t < 1) {
          const h = dropPoint(r, s1);
          const sr = R * 0.16;
          const rg = ctx!.createRadialGradient(h.x, h.y, 0, h.x, h.y, sr);
          rg.addColorStop(0, "rgba(255,255,255,.95)");
          rg.addColorStop(0.25, "rgba(255,255,255,.35)");
          rg.addColorStop(1, "rgba(255,255,255,0)");
          ctx!.fillStyle = rg;
          ctx!.beginPath();
          ctx!.arc(h.x, h.y, sr, 0, Math.PI * 2);
          ctx!.fill();
        }
      });

      const sh = seg(p, 0.86, 0.98);
      if (sh > 0 && sh < 1 && drawn.length) {
        const g = ctx!.createLinearGradient(CX - R * 1.3, CY - R * 1.7, CX + R * 1.3, CY + R * 1.2);
        const c = lerp(-0.1, 1.1, ease(sh));
        g.addColorStop(clamp(c - 0.12), "rgba(255,255,255,0)");
        g.addColorStop(clamp(c), "rgba(255,255,255,.9)");
        g.addColorStop(clamp(c + 0.12), "rgba(255,255,255,0)");
        ctx!.save();
        ctx!.globalCompositeOperation = "lighter";
        drawn.forEach(([r, s0, s1, cl]) => {
          traceDrop(r, s0, s1, cl);
          ctx!.strokeStyle = g;
          ctx!.lineWidth = lw;
          ctx!.stroke();
        });
        ctx!.restore();
      }

      letters.forEach((el, i) => {
        const o = easeOut(seg(p, 0.87 + i * 0.01, 0.93 + i * 0.01));
        (el as HTMLElement).style.opacity = String(o);
        (el as HTMLElement).style.transform = `translateY(${(1 - o) * 0.45}em)`;
        (el as HTMLElement).style.filter = `blur(${(1 - o) * 6}px)`;
      });
    }

    resize();
    addEventListener("resize", resize);
    raf = requestAnimationFrame(frame);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
    };
  }, [start, end, ambient]);

  return (
    <div
      ref={rootRef}
      className="zhv-bg"
      data-start={start}
      data-end={end}
      data-ambient={String(ambient)}
      aria-hidden="true"
    >
      <canvas className="zhv-bg__canvas" />
      <div className="zhv-bg__title">
        <span>Z</span>
        <span>O</span>
        <span>H</span>
        <span>A</span>
        <span>R</span>
        <span>A</span>
        <span>V</span>
      </div>
    </div>
  );
}
