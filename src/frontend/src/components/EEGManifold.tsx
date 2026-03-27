import { useEffect, useRef, useState } from "react";

// Icosahedron vertices
const PHI = (1 + Math.sqrt(5)) / 2;
const RAW_VERTS: [number, number, number][] = [
  [-1, PHI, 0],
  [1, PHI, 0],
  [-1, -PHI, 0],
  [1, -PHI, 0],
  [0, -1, PHI],
  [0, 1, PHI],
  [0, -1, -PHI],
  [0, 1, -PHI],
  [PHI, 0, -1],
  [PHI, 0, 1],
  [-PHI, 0, -1],
  [-PHI, 0, 1],
];
const EDGES: [number, number][] = [
  [0, 1],
  [0, 5],
  [0, 11],
  [0, 7],
  [0, 10],
  [1, 5],
  [1, 9],
  [1, 8],
  [1, 7],
  [2, 3],
  [2, 4],
  [2, 11],
  [2, 10],
  [2, 6],
  [3, 4],
  [3, 9],
  [3, 8],
  [3, 6],
  [4, 5],
  [4, 9],
  [4, 11],
  [5, 9],
  [5, 11],
  [6, 7],
  [6, 8],
  [6, 10],
  [7, 8],
  [7, 10],
  [8, 9],
  [10, 11],
];

function normalize(v: [number, number, number]): [number, number, number] {
  const len = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
  return [v[0] / len, v[1] / len, v[2] / len];
}

const VERTS = RAW_VERTS.map(normalize);

function rotateY(
  v: [number, number, number],
  a: number,
): [number, number, number] {
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return [v[0] * cos + v[2] * sin, v[1], -v[0] * sin + v[2] * cos];
}

function rotateX(
  v: [number, number, number],
  a: number,
): [number, number, number] {
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  return [v[0], v[1] * cos - v[2] * sin, v[1] * sin + v[2] * cos];
}

function project(
  v: [number, number, number],
  scale: number,
  cx: number,
  cy: number,
): [number, number, number] {
  const fov = 2.5;
  const z = v[2] + fov;
  const x = (v[0] / z) * scale + cx;
  const y = (v[1] / z) * scale + cy;
  return [x, y, z];
}

export default function EEGManifold() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0);
  const rafRef = useRef<number>(0);
  const [metrics, setMetrics] = useState({
    coherence: 94.2,
    sync: 87.6,
    power: 42.8,
  });

  useEffect(() => {
    const id = setInterval(() => {
      setMetrics({
        coherence: Number.parseFloat((92 + Math.random() * 4).toFixed(1)),
        sync: Number.parseFloat((85 + Math.random() * 5).toFixed(1)),
        power: Number.parseFloat((40 + Math.random() * 6).toFixed(1)),
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const scale = 90;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      // Background glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100);
      grad.addColorStop(0, "oklch(65% 0.28 305 / 0.08)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      const a = angleRef.current;
      const rotated = VERTS.map((v) => rotateX(rotateY(v, a), a * 0.4));
      const projected = rotated.map((v) => project(v, scale, cx, cy));

      // Draw edges
      for (const [i, j] of EDGES) {
        const [x1, y1, z1] = projected[i];
        const [x2, y2, z2] = projected[j];
        const depth = ((z1 + z2) / 2 - 2) / 1.5;
        const alpha = 0.2 + depth * 0.6;

        const grad2 = ctx.createLinearGradient(x1, y1, x2, y2);
        grad2.addColorStop(0, `oklch(65% 0.28 305 / ${alpha})`);
        grad2.addColorStop(1, `oklch(85% 0.18 200 / ${alpha})`);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = grad2;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw vertices
      for (const [x, y, z] of projected) {
        const depth = (z - 2) / 1.5;
        const alpha = 0.4 + depth * 0.6;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(85% 0.18 200 / ${alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = "oklch(85% 0.18 200)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      angleRef.current += 0.008;
      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      className="card-glow rounded-lg border border-border p-5"
      style={{ background: "oklch(12% 0.025 270)" }}
      data-ocid="eeg.card"
    >
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-4">
        EEG Geometric Manifold
      </p>

      {/* Top metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Coherence", value: `${metrics.coherence}%` },
          { label: "Sync", value: `${metrics.sync}%` },
          { label: "Power", value: `${metrics.power}W` },
        ].map((m) => (
          <div
            key={m.label}
            className="rounded p-2 text-center"
            style={{ background: "oklch(16% 0.03 270)" }}
          >
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
              {m.label}
            </p>
            <p className="text-sm font-bold text-cyan">{m.value}</p>
          </div>
        ))}
      </div>

      {/* 3D Canvas */}
      <div className="flex justify-center" data-ocid="eeg.canvas_target">
        <canvas
          ref={canvasRef}
          width={260}
          height={220}
          style={{ borderRadius: "6px", background: "oklch(10% 0.02 270)" }}
        />
      </div>

      {/* Bottom metrics */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {[
          { label: "Delta", value: "12.4 Hz" },
          { label: "Theta", value: "8.1 Hz" },
          { label: "Alpha", value: "10.3 Hz" },
        ].map((m) => (
          <div key={m.label} className="text-center">
            <p className="text-[10px] text-muted-foreground">{m.label}</p>
            <p className="text-xs font-medium text-foreground">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
