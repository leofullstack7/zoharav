"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type Particle = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  delay: number;
  size: number;
  shade: number;
};

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.toUpperCase().split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function samplePoints(width: number, height: number, title: string, fontFamily: string) {
  const off = document.createElement("canvas");
  off.width = width;
  off.height = height;
  const ctx = off.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [] as Array<{ x: number; y: number }>;

  const fontSize = Math.min(width * 0.086, height * 0.12, 78);
  ctx.font = `400 ${fontSize}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  const lines = wrapLines(ctx, title, width * 0.78);
  const lineHeight = fontSize * 1.12;
  const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) => {
    ctx.fillText(line, width / 2, startY + index * lineHeight);
  });

  const { data } = ctx.getImageData(0, 0, width, height);
  const points: Array<{ x: number; y: number }> = [];
  const step = width < 700 ? 3 : 4;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (data[(y * width + x) * 4 + 3] > 140) points.push({ x, y });
    }
  }
  return points;
}

export function BookingSelectOverlay({ title, onDone }: { title: string; onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const t = window.setTimeout(onDone, 120);
      return () => {
        window.clearTimeout(t);
        document.body.style.overflow = previousOverflow;
      };
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const fontFamily =
      getComputedStyle(document.documentElement).getPropertyValue("--font-cormorant").trim() ||
      '"Cormorant Garamond", serif';
    const targets = samplePoints(width, height, title, fontFamily);
    const count = Math.min(Math.max(targets.length, 900), 2400);
    const particles: Particle[] = [];
    for (let i = 0; i < count; i += 1) {
      const dest = targets[i % Math.max(targets.length, 1)] ?? { x: width / 2, y: height / 2 };
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        tx: dest.x + (Math.random() - 0.5) * 1.4,
        ty: dest.y + (Math.random() - 0.5) * 1.4,
        delay: (i % 48) / 220,
        size: 0.7 + Math.random() * 1.7,
        shade: Math.random(),
      });
    }

    const gather = 2100;
    const hold = 700;
    const fade = 480;
    const total = gather + hold + fade;
    let raf = 0;
    const started = performance.now();

    const tick = (now: number) => {
      const elapsed = now - started;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);

      for (const particle of particles) {
        const local = Math.min(1, Math.max(0, (elapsed / gather - particle.delay) / (1 - particle.delay)));
        const ease = 1 - (1 - local) ** 3;
        const x = particle.x + (particle.tx - particle.x) * ease;
        const y = particle.y + (particle.ty - particle.y) * ease;
        const drift = elapsed > gather ? (elapsed - gather) * 0.004 : 0;
        const a = elapsed > gather + hold ? 1 - (elapsed - gather - hold) / fade : Math.min(1, 0.35 + ease * 0.65);
        const c = 78 + particle.shade * 72;
        ctx.fillStyle = `rgba(${c}, ${c - 8}, ${c - 16}, ${Math.max(0, a)})`;
        ctx.fillRect(x + drift * (particle.shade - 0.5), y, particle.size, particle.size);
      }

      if (elapsed < total) raf = requestAnimationFrame(tick);
      else onDone();
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = previousOverflow;
    };
  }, [title, onDone]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="booking-blackout" role="status" aria-live="polite">
      <canvas ref={canvasRef} />
      <p className="sr-only">{title}</p>
    </div>,
    document.body,
  );
}
