import { useEffect, useRef } from "react";

interface ConstitutionalShaderProps {
  parameters: {
    uPhi: number;
    uActiveDomains: number;
    uPendingVotes: number;
    uConsensusLevel: number;
  };
  isPlaying: boolean;
}

export default function ConstitutionalShader({
  parameters,
  isPlaying,
}: ConstitutionalShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment shader with constitutional mathematics
    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform float uPhi;
      uniform float uActiveDomains;
      uniform float uPendingVotes;
      uniform float uConsensusLevel;

      // Babylonian base-60 inspired rotation
      float babylonianRotation(float angle) {
        return mod(angle * 60.0, 360.0) / 60.0;
      }

      // Euclidean GCD visualization
      float euclideanPattern(vec2 uv, float a, float b) {
        float gcd = a;
        float temp = b;
        for (int i = 0; i < 10; i++) {
          if (temp < 0.01) break;
          float r = mod(gcd, temp);
          gcd = temp;
          temp = r;
        }
        return gcd;
      }

      // Sacred geometry pattern
      float hexagonPattern(vec2 uv, float scale) {
        vec2 p = uv * scale;
        float a = atan(p.y, p.x);
        float r = length(p);
        float hexagon = cos(floor(0.5 + a / 1.047197) * 1.047197 - a) * r;
        return hexagon;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
        
        float time = uTime * 0.5;
        float dist = length(uv);
        float angle = atan(uv.y, uv.x);
        
        // Phi spiral
        float phiSpiral = mod(dist * uPhi - time * 0.3, 1.0);
        
        // Node orbits (3 nodes: SP-BR, LIS-PT, JNB-ZA)
        vec3 nodeColors = vec3(0.0);
        for (float i = 0.0; i < 3.0; i++) {
          float nodeAngle = angle + time * 0.5 + i * 2.094395; // 120 degrees
          float nodeOrbit = 0.4 + sin(time + i) * 0.1;
          vec2 nodePos = vec2(cos(nodeAngle), sin(nodeAngle)) * nodeOrbit;
          float nodeDist = length(uv - nodePos);
          
          float nodeGlow = 0.02 / (nodeDist + 0.01);
          nodeColors.r += nodeGlow * (i == 0.0 ? 1.0 : 0.3);
          nodeColors.g += nodeGlow * (i == 1.0 ? 1.0 : 0.3);
          nodeColors.b += nodeGlow * (i == 2.0 ? 1.0 : 0.3);
        }
        
        // Consensus rings
        float consensusRing = smoothstep(0.02, 0.0, abs(dist - 0.3 - uConsensusLevel * 0.2));
        consensusRing += smoothstep(0.02, 0.0, abs(dist - 0.5 - uConsensusLevel * 0.15));
        
        // Hexagonal sacred geometry
        float hexPattern = hexagonPattern(uv, 3.0 + sin(time * 0.2) * 0.5);
        float hexGrid = smoothstep(0.95, 1.0, cos(hexPattern * 3.14159 * 2.0));
        
        // Babylonian division pattern
        float babylonPattern = babylonianRotation(angle + time);
        float divisionLines = smoothstep(0.98, 1.0, cos(babylonPattern * 3.14159 * 60.0));
        
        // Pending votes particle effect
        float particles = 0.0;
        for (float i = 0.0; i < 20.0; i++) {
          if (i >= uPendingVotes) break;
          float particleAngle = i * 0.314159 + time * 2.0;
          float particleRadius = 0.2 + mod(time * 0.3 + i * 0.1, 0.4);
          vec2 particlePos = vec2(cos(particleAngle), sin(particleAngle)) * particleRadius;
          float particleDist = length(uv - particlePos);
          particles += 0.005 / (particleDist + 0.01);
        }
        
        // Active domains glow
        float domainGlow = sin(dist * 10.0 - time * 2.0) * 0.5 + 0.5;
        domainGlow *= smoothstep(0.6, 0.0, dist);
        domainGlow *= uActiveDomains / 3.0;
        
        // Combine all elements
        vec3 color = vec3(0.0);
        
        // Base gradient
        color += vec3(0.1, 0.05, 0.2) * (1.0 - dist);
        
        // Phi spiral
        color += vec3(0.6, 0.4, 0.8) * phiSpiral * 0.3;
        
        // Node colors
        color += nodeColors * 0.5;
        
        // Consensus visualization
        color += vec3(0.3, 0.8, 0.9) * consensusRing * (0.5 + uConsensusLevel);
        
        // Sacred geometry
        color += vec3(0.8, 0.6, 0.3) * hexGrid * 0.2;
        
        // Babylonian divisions
        color += vec3(0.9, 0.7, 0.4) * divisionLines * 0.15;
        
        // Particles
        color += vec3(1.0, 0.8, 0.3) * particles;
        
        // Domain glow
        color += vec3(0.5, 0.3, 0.8) * domainGlow * 0.3;
        
        // Center glow
        float centerGlow = 0.1 / (dist + 0.1);
        color += vec3(0.8, 0.5, 0.9) * centerGlow * 0.2;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Compile shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    // Create program
    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Set up geometry
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uPhi = gl.getUniformLocation(program, "uPhi");
    const uActiveDomains = gl.getUniformLocation(program, "uActiveDomains");
    const uPendingVotes = gl.getUniformLocation(program, "uPendingVotes");
    const uConsensusLevel = gl.getUniformLocation(program, "uConsensusLevel");

    // Render loop
    const render = () => {
      if (!canvas || !gl) return;

      const dpr = window.devicePixelRatio || 1;
      const displayWidth = canvas.clientWidth * dpr;
      const displayHeight = canvas.clientHeight * dpr;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
      }

      gl.uniform2f(uResolution, canvas.width, canvas.height);

      if (isPlaying) {
        const currentTime = (Date.now() - startTimeRef.current) / 1000;
        gl.uniform1f(uTime, currentTime);
      }

      gl.uniform1f(uPhi, parameters.uPhi);
      gl.uniform1f(uActiveDomains, parameters.uActiveDomains);
      gl.uniform1f(uPendingVotes, parameters.uPendingVotes);
      gl.uniform1f(uConsensusLevel, parameters.uConsensusLevel);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [parameters, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
