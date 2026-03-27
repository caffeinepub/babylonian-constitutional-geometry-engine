import { useEffect, useRef } from "react";

interface MerkabahSolarShaderProps {
  parameters: {
    uPhi: number;
    uActiveDomains: number;
    uPendingVotes: number;
    uConsensusLevel: number;
  };
  merkabahMetrics: {
    chiHermetica: number;
    toroidalField: number;
    haResonance: number;
    ar4366Flux: number;
    autisticContinuum: boolean;
  };
  isPlaying: boolean;
}

export default function MerkabahSolarShader({
  parameters,
  merkabahMetrics,
  isPlaying,
}: MerkabahSolarShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      if (!isPlaying) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const time = (Date.now() - startTimeRef.current) / 1000;
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      const centerX = width / 2;
      const centerY = height / 2;

      // Clear canvas with gradient background
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        Math.max(width, height) / 2,
      );
      gradient.addColorStop(0, "oklch(0.15 0.05 280)");
      gradient.addColorStop(1, "oklch(0.05 0.02 280)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw toroidal field
      const toroidalIntensity = merkabahMetrics.toroidalField;
      const toroidalRadius = Math.min(width, height) * 0.3;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Outer torus ring
      for (let i = 0; i < 36; i++) {
        const angle = (i / 36) * Math.PI * 2 + time * 0.5;
        const x = Math.cos(angle) * toroidalRadius;
        const y = Math.sin(angle) * toroidalRadius * 0.6;

        const pulseSize =
          3 + toroidalIntensity * 5 + Math.sin(time * 2 + i * 0.5) * 2;

        const particleGradient = ctx.createRadialGradient(
          x,
          y,
          0,
          x,
          y,
          pulseSize * 2,
        );
        particleGradient.addColorStop(
          0,
          `oklch(0.7 0.25 280 / ${0.8 * toroidalIntensity})`,
        );
        particleGradient.addColorStop(1, "oklch(0.7 0.25 280 / 0)");

        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(x, y, pulseSize * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw tetrahedra (masculine and feminine)
      const tetraSize = 40;
      const rotationSpeed = merkabahMetrics.autisticContinuum ? 2.0 : 1.0;

      // Masculine tetrahedron (pointing up)
      ctx.save();
      ctx.rotate(time * rotationSpeed);
      ctx.strokeStyle = `oklch(0.65 0.25 320 / ${0.6 + toroidalIntensity * 0.4})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -tetraSize);
      ctx.lineTo(-tetraSize * 0.866, tetraSize * 0.5);
      ctx.lineTo(tetraSize * 0.866, tetraSize * 0.5);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // Feminine tetrahedron (pointing down)
      ctx.save();
      ctx.rotate(-time * rotationSpeed);
      ctx.strokeStyle = `oklch(0.65 0.25 240 / ${0.6 + toroidalIntensity * 0.4})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, tetraSize);
      ctx.lineTo(-tetraSize * 0.866, -tetraSize * 0.5);
      ctx.lineTo(tetraSize * 0.866, -tetraSize * 0.5);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // Draw chi signature (2.000012)
      const chiDeviation = Math.abs(merkabahMetrics.chiHermetica - 2.000012);
      const chiColor =
        chiDeviation < 0.000005 ? "oklch(0.7 0.25 140)" : "oklch(0.7 0.25 0)";

      ctx.strokeStyle = chiColor;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(0, 0, toroidalRadius * 1.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Hα resonance waves
      const haIntensity = merkabahMetrics.haResonance;
      for (let i = 0; i < 3; i++) {
        const waveRadius = toroidalRadius * (1.3 + i * 0.15);
        const waveAlpha = haIntensity * 0.3 * (1 - i * 0.3);

        ctx.strokeStyle = `oklch(0.65 0.2 40 / ${waveAlpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();

        for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
          const wave = Math.sin(angle * 6 + time * 3 + (i * Math.PI) / 3) * 5;
          const x = Math.cos(angle) * (waveRadius + wave);
          const y = Math.sin(angle) * (waveRadius + wave);

          if (angle === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Draw AR4366 flux indicators
      const fluxCount = 8;
      for (let i = 0; i < fluxCount; i++) {
        const angle = (i / fluxCount) * Math.PI * 2 + time * 0.3;
        const distance = toroidalRadius * 1.5;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        const fluxGradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
        fluxGradient.addColorStop(
          0,
          `oklch(0.75 0.25 60 / ${merkabahMetrics.ar4366Flux * 0.8})`,
        );
        fluxGradient.addColorStop(1, "oklch(0.75 0.25 60 / 0)");

        ctx.fillStyle = fluxGradient;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Draw autistic continuum indicator
      if (merkabahMetrics.autisticContinuum) {
        ctx.save();
        ctx.translate(centerX, centerY);

        const continuumRadius = toroidalRadius * 1.8;
        ctx.strokeStyle = "oklch(0.8 0.3 280 / 0.4)";
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.arc(0, 0, continuumRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [parameters, merkabahMetrics, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
