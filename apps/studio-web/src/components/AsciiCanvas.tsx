'use client';

import React, { useEffect, useRef } from 'react';

interface AsciiCanvasProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  mode: 'castle' | 'sky';
  className?: string;
  id?: string;
}

export function AsciiCanvas({ videoRef, mode, className = 'ascii-canvas', id }: AsciiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
    if (!offCtx) return;

    let w = 0, h = 0, cols = 0, rows = 0;
    let cellW = 8, cellH = 11;
    let running = true;
    let lastTime = 0;
    let animId = 0;

    function resize() {
      if (!canvas) return;
      w = canvas.clientWidth || window.innerWidth;
      h = canvas.clientHeight || window.innerHeight;
      if (!w || !h) return;

      cellW = w < 640 ? 7 : 8;
      cellH = w < 640 ? 10 : 11;

      cols = Math.ceil(w / cellW);
      rows = Math.ceil(h / cellH);

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

      offCanvas.width = cols;
      offCanvas.height = rows;
    }

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
    resize();

    function fract(n: number) {
      return n - Math.floor(n);
    }

    function render(time: number) {
      if (!running) return;
      animId = requestAnimationFrame(render);

      if (time - lastTime < 110) return;
      lastTime = time;

      if (!video || !video.videoWidth || !video.videoHeight || cols === 0 || rows === 0 || !ctx || !offCtx) return;

      try {
        const vW = video.videoWidth;
        const vH = video.videoHeight;
        const canvasAspect = w / h;
        const videoAspect = vW / vH;
        let sW, sH, sx, sy;

        if (canvasAspect > videoAspect) {
          sW = vW;
          sH = vW / canvasAspect;
          sx = 0;
          sy = (vH - sH) / 2;
        } else {
          sH = vH;
          sW = vH * canvasAspect;
          sx = (vW - sW) / 2;
          sy = 0;
        }

        offCtx.drawImage(video, sx, sy, sW, sH, 0, 0, cols, rows);
        const imgData = offCtx.getImageData(0, 0, cols, rows);
        const data = imgData.data;

        ctx.clearRect(0, 0, w, h);
        ctx.font = `500 ${cellH - 1}px "Geist Mono", monospace`;
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';

        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const idx = (y * cols + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            const L = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            const warm = r - b;
            const k = fract(Math.sin(x * 127.1 + y * 311.7) * 43758.545);

            const px = x * cellW + cellW / 2;
            const py = y * cellH;

            if (mode === 'castle') {
              if (L < 0.27) {
                ctx.fillStyle = 'rgba(8,16,30,.52)';
                ctx.fillRect(x * cellW, y * cellH, cellW, cellH);
                const chars = ':;1s5$:.' ;
                const ch = chars[Math.floor(k * 8 + L * 20) & 7];
                ctx.fillStyle = 'rgba(205,224,236,.5)';
                ctx.fillText(ch, px, py);
              } else if (warm > 20 && L < 0.70) {
                const chars = '@0G8@6C0';
                const ch = chars[Math.floor(k * 3 + L * 14) & 7];
                const alpha = 0.24 + (0.70 - L) * 0.55;
                ctx.fillStyle = `rgba(255,255,255,${alpha})`;
                ctx.fillText(ch, px, py);
              } else if (L > 0.60) {
                if (k >= 0.18) {
                  ctx.fillStyle = 'rgba(255,255,255,.46)';
                  ctx.fillText('.', px, py - 2);
                }
              } else if (k > 0.45) {
                const ch = L < 0.4 ? ':' : '.';
                ctx.fillStyle = 'rgba(255,255,255,.26)';
                ctx.fillText(ch, px, py - 1);
              }
            } else if (mode === 'sky') {
              if (warm < 14 || L < 0.56) continue;
              const ch = k > 0.7 ? '+' : (k > 0.35 ? ':' : '.');
              const col = L > 0.8 ? 'rgba(255,255,255,.34)' : 'rgba(92,112,104,.30)';
              ctx.fillStyle = col;
              ctx.fillText(ch, px, py);
            }
          }
        }
      } catch (err) {
        if (canvas) canvas.style.display = 'none';
        running = false;
      }
    }

    animId = requestAnimationFrame(render);

    return () => {
      running = false;
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [videoRef, mode]);

  return <canvas ref={canvasRef} className={className} id={id} />;
}
