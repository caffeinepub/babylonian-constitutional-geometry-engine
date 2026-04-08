import { useEffect, useRef } from "react";

interface HumanShaderProps {
  parameters: {
    uPhi: number;
    uActiveDomains: number;
    uPendingVotes: number;
    uConsensusLevel: number;
  };
  humanMetrics: {
    cognitiveLoad: number;
    phiLive: number;
    intentConfidence: number;
    sandboxActive: boolean;
    toolsDisabled: boolean;
  };
  isPlaying: boolean;
}

export default function HumanShader({
  parameters,
  humanMetrics,
  isPlaying,
}: HumanShaderProps) {
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

    // Fragment shader: human.asi (CGE Alpha v35.3‑Ω)
    // Corrected fragment geometry: 108 frags (36×3)
    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform float uPhi;
      uniform float uActiveDomains;
      uniform float uPendingVotes;
      uniform float uConsensusLevel;
      
      // Human Interface NO_TOOLS v35.3‑Ω uniforms
      uniform float uPhiLive;
      uniform float uCognitiveLoad;
      uniform float uIntentConfidence;
      uniform float uToolsDisabled;
      
      // NO_TOOLS I740 field computation
      float i740Field(vec2 uv, float time) {
        float field = 0.0;
        // 36×3 = 108 fragment geometry
        for (float i = 0.0; i < 36.0; i++) {
          float angle = i * 0.174533; // 10 degrees in radians
          for (float j = 0.0; j < 3.0; j++) {
            float radius = 0.2 + j * 0.15;
            vec2 pos = vec2(cos(angle + time * 0.3), sin(angle + time * 0.3)) * radius;
            float dist = length(uv - pos);
            field += 0.003 / (dist + 0.01);
          }
        }
        return field;
      }
      
      // Cognitive load visualization
      float cognitivePattern(vec2 uv, float load, float time) {
        float pattern = 0.0;
        vec2 p = uv * 8.0;
        
        // Neural network-like pattern
        for (float i = 0.0; i < 5.0; i++) {
          float offset = i * 0.628318; // 36 degrees
          vec2 center = vec2(cos(time + offset), sin(time + offset)) * 0.3;
          float dist = length(p - center * 8.0);
          pattern += sin(dist - time * 2.0 + load * 10.0) * 0.5 + 0.5;
        }
        
        return pattern * load;
      }
      
      // SASC intent confidence field
      float intentField(vec2 uv, float confidence, float time) {
        float r = length(uv);
        float a = atan(uv.y, uv.x);
        
        // Spiral confidence pattern
        float spiral = mod(r * 10.0 - a * 3.0 - time, 1.0);
        float pulse = sin(time * 2.0 + r * 5.0) * 0.5 + 0.5;
        
        return spiral * pulse * confidence;
      }
      
      // Sandbox status visualization
      float sandboxShield(vec2 uv, float active, float time) {
        float r = length(uv);
        float shield = 0.0;
        
        // Hexagonal shield pattern
        float a = atan(uv.y, uv.x);
        float hexDist = cos(floor(0.5 + a / 1.047197) * 1.047197 - a) * r;
        
        // Pulsing shield layers
        for (float i = 0.0; i < 3.0; i++) {
          float layerRadius = 0.4 + i * 0.15;
          float layer = smoothstep(0.02, 0.0, abs(hexDist - layerRadius + sin(time + i) * 0.05));
          shield += layer * active;
        }
        
        return shield;
      }
      
      // Phi monitor with constitutional validation
      float phiMonitor(vec2 uv, float phi, float time) {
        float r = length(uv);
        float a = atan(uv.y, uv.x);
        
        // Golden ratio spiral
        float goldenSpiral = mod(log(r + 0.1) * phi + a - time * 0.2, 1.0);
        float phiRing = smoothstep(0.02, 0.0, abs(r - 0.618));
        
        return goldenSpiral * 0.3 + phiRing * 0.7;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
        
        float time = uTime * 0.5;
        float dist = length(uv);
        float angle = atan(uv.y, uv.x);
        
        // Initialize color
        vec3 color = vec3(0.0);
        
        // Base gradient with cognitive influence
        vec3 baseGradient = mix(
          vec3(0.05, 0.02, 0.15),
          vec3(0.15, 0.05, 0.25),
          1.0 - dist + uCognitiveLoad * 0.3
        );
        color += baseGradient;
        
        // NO_TOOLS I740 field (108 fragments)
        float i740 = i740Field(uv, time);
        color += vec3(0.4, 0.6, 0.9) * i740 * uToolsDisabled;
        
        // Cognitive load visualization
        float cognitive = cognitivePattern(uv, uCognitiveLoad, time);
        color += vec3(0.9, 0.3, 0.5) * cognitive * 0.2;
        
        // SASC intent confidence
        float intent = intentField(uv, uIntentConfidence, time);
        color += vec3(0.3, 0.9, 0.6) * intent * 0.25;
        
        // Sandbox shield
        float sandbox = sandboxShield(uv, uToolsDisabled, time);
        color += vec3(0.2, 0.8, 0.9) * sandbox * 0.4;
        
        // Phi monitor
        float phi = phiMonitor(uv, uPhiLive, time);
        color += vec3(0.8, 0.6, 0.3) * phi * 0.3;
        
        // Node orbits (constitutional nodes)
        for (float i = 0.0; i < 3.0; i++) {
          float nodeAngle = angle + time * 0.5 + i * 2.094395;
          float nodeOrbit = 0.35 + sin(time + i) * 0.08;
          vec2 nodePos = vec2(cos(nodeAngle), sin(nodeAngle)) * nodeOrbit;
          float nodeDist = length(uv - nodePos);
          
          float nodeGlow = 0.015 / (nodeDist + 0.01);
          color.r += nodeGlow * (i == 0.0 ? 1.0 : 0.2);
          color.g += nodeGlow * (i == 1.0 ? 1.0 : 0.2);
          color.b += nodeGlow * (i == 2.0 ? 1.0 : 0.2);
        }
        
        // Consensus visualization
        float consensusRing = smoothstep(0.02, 0.0, abs(dist - 0.25 - uConsensusLevel * 0.2));
        color += vec3(0.3, 0.8, 0.9) * consensusRing * (0.5 + uConsensusLevel * 0.5);
        
        // Pending votes particles
        float particles = 0.0;
        for (float i = 0.0; i < 20.0; i++) {
          if (i >= uPendingVotes) break;
          float particleAngle = i * 0.314159 + time * 2.0;
          float particleRadius = 0.15 + mod(time * 0.3 + i * 0.1, 0.35);
          vec2 particlePos = vec2(cos(particleAngle), sin(particleAngle)) * particleRadius;
          float particleDist = length(uv - particlePos);
          particles += 0.004 / (particleDist + 0.01);
        }
        color += vec3(1.0, 0.8, 0.3) * particles;
        
        // Active domains glow
        float domainGlow = sin(dist * 8.0 - time * 2.0) * 0.5 + 0.5;
        domainGlow *= smoothstep(0.5, 0.0, dist);
        domainGlow *= uActiveDomains / 3.0;
        color += vec3(0.5, 0.3, 0.8) * domainGlow * 0.25;
        
        // Center constitutional core
        float centerGlow = 0.08 / (dist + 0.08);
        color += vec3(0.7, 0.4, 0.9) * centerGlow * 0.3;
        
        // Alert overlay for constitutional violations
        float phiDeviation = abs(uPhiLive - 1.038);
        if (phiDeviation > 0.001 || uToolsDisabled < 0.5) {
          float alertPulse = sin(time * 5.0) * 0.5 + 0.5;
          color += vec3(1.0, 0.2, 0.2) * alertPulse * 0.2;
        }
        
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

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error(
        "Fragment shader compilation error:",
        gl.getShaderInfoLog(fragmentShader),
      );
    }

    // Create program
    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    // biome-ignore lint/correctness/useHookAtTopLevel: gl.useProgram is a WebGL method, not a React hook
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
    const uPhiLive = gl.getUniformLocation(program, "uPhiLive");
    const uCognitiveLoad = gl.getUniformLocation(program, "uCognitiveLoad");
    const uIntentConfidence = gl.getUniformLocation(
      program,
      "uIntentConfidence",
    );
    const uToolsDisabled = gl.getUniformLocation(program, "uToolsDisabled");

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

      // Human Interface uniforms
      gl.uniform1f(uPhiLive, humanMetrics.phiLive);
      gl.uniform1f(uCognitiveLoad, humanMetrics.cognitiveLoad);
      gl.uniform1f(uIntentConfidence, humanMetrics.intentConfidence);
      gl.uniform1f(uToolsDisabled, humanMetrics.toolsDisabled ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [parameters, humanMetrics, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
