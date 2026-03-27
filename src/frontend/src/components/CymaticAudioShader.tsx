import { useEffect, useRef } from "react";

interface CymaticAudioShaderProps {
  parameters: {
    uPhi: number;
    uActiveDomains: number;
    uPendingVotes: number;
    uConsensusLevel: number;
  };
  audioMetrics: {
    frequency: number;
    amplitude: number;
    phaseDrift: number;
    entropyNoise: number;
  };
  humanMetrics: {
    cognitiveLoad: number;
    phiLive: number;
    intentConfidence: number;
    sandboxActive: boolean;
    toolsDisabled: boolean;
  };
  isPlaying: boolean;
  audioEnabled: boolean;
}

export default function CymaticAudioShader({
  parameters,
  audioMetrics,
  humanMetrics,
  isPlaying,
  audioEnabled,
}: CymaticAudioShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(Date.now());
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Initialize Web Audio API
  useEffect(() => {
    if (!audioEnabled) {
      // Clean up audio context
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      return;
    }

    // Create audio context
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    audioContextRef.current = new AudioContextClass({ sampleRate: 192000 });

    // Create oscillator and gain nodes
    oscillatorRef.current = audioContextRef.current.createOscillator();
    gainNodeRef.current = audioContextRef.current.createGain();

    oscillatorRef.current.connect(gainNodeRef.current);
    gainNodeRef.current.connect(audioContextRef.current.destination);

    oscillatorRef.current.type = "sine";
    oscillatorRef.current.frequency.value = audioMetrics.frequency;
    gainNodeRef.current.gain.value = audioMetrics.amplitude * 0.3; // Reduce volume for safety

    oscillatorRef.current.start();

    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioEnabled]);

  // Update audio parameters
  useEffect(() => {
    if (!audioEnabled || !oscillatorRef.current || !gainNodeRef.current) return;

    const now = audioContextRef.current?.currentTime || 0;
    oscillatorRef.current.frequency.setTargetAtTime(
      audioMetrics.frequency,
      now,
      0.1,
    );
    gainNodeRef.current.gain.setTargetAtTime(
      audioMetrics.amplitude * 0.3,
      now,
      0.1,
    );
  }, [audioMetrics, audioEnabled]);

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

    // Fragment shader: cathedral/cymatic_audio.frag
    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform float uPhi;
      uniform float uConsensusLevel;
      
      // Audio metrics uniforms
      uniform float uAudioFreq;
      uniform float uAudioAmplitude;
      uniform float uAudioPhase;
      uniform float uEntropyNoise;
      
      // Human metrics for constitutional validation
      uniform float uPhiLive;
      uniform float uCognitiveLoad;
      
      // Cymatic pattern generation based on frequency
      float cymaticPattern(vec2 uv, float freq, float time) {
        float pattern = 0.0;
        float normalizedFreq = freq / 1000.0;
        
        // Chladni plate patterns
        float x = uv.x * 10.0;
        float y = uv.y * 10.0;
        
        // Multiple harmonic modes
        for (float n = 1.0; n < 5.0; n++) {
          for (float m = 1.0; m < 5.0; m++) {
            float mode = sin(n * x * normalizedFreq + time) * sin(m * y * normalizedFreq + time);
            pattern += mode * (1.0 / (n * m));
          }
        }
        
        return pattern;
      }
      
      // Standing wave visualization
      float standingWave(vec2 uv, float freq, float amplitude, float time) {
        float r = length(uv);
        float a = atan(uv.y, uv.x);
        
        // Radial standing waves
        float wave = sin(r * freq * 0.05 - time * 2.0) * amplitude;
        
        // Angular harmonics
        float harmonics = 0.0;
        for (float i = 1.0; i < 8.0; i++) {
          harmonics += sin(a * i + time * 0.5) * (1.0 / i);
        }
        
        return wave * (1.0 + harmonics * 0.3);
      }
      
      // Entropy noise field
      float entropyField(vec2 uv, float entropy, float time) {
        vec2 p = uv * 5.0 + time * 0.2;
        
        // Fractal noise
        float noise = 0.0;
        float amplitude = 1.0;
        for (float i = 0.0; i < 4.0; i++) {
          noise += sin(p.x * amplitude + time) * sin(p.y * amplitude - time) / amplitude;
          amplitude *= 2.0;
          p *= 2.0;
        }
        
        return noise * entropy;
      }
      
      // Phase drift visualization
      float phaseDriftPattern(vec2 uv, float drift, float time) {
        float r = length(uv);
        float a = atan(uv.y, uv.x);
        
        // Spiral phase pattern
        float spiral = mod(a + r * 10.0 + drift * 50.0 - time, 6.28318);
        return sin(spiral) * 0.5 + 0.5;
      }
      
      // Phi-based sacred geometry overlay
      float phiGeometry(vec2 uv, float phi, float time) {
        float r = length(uv);
        float a = atan(uv.y, uv.x);
        
        // Golden spiral
        float goldenSpiral = mod(log(r + 0.1) * phi + a - time * 0.3, 1.0);
        
        // Phi rings
        float phiRing = 0.0;
        for (float i = 1.0; i < 5.0; i++) {
          float ringRadius = 0.618 / i;
          phiRing += smoothstep(0.02, 0.0, abs(r - ringRadius));
        }
        
        return goldenSpiral * 0.3 + phiRing * 0.7;
      }
      
      // TMR consensus visualization
      float tmrPattern(vec2 uv, float consensus, float time) {
        float pattern = 0.0;
        
        // Three node positions
        for (float i = 0.0; i < 3.0; i++) {
          float angle = i * 2.094395 + time * 0.5;
          vec2 nodePos = vec2(cos(angle), sin(angle)) * 0.4;
          float dist = length(uv - nodePos);
          pattern += 0.05 / (dist + 0.05);
        }
        
        return pattern * consensus;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
        
        float time = uTime * 0.5;
        float dist = length(uv);
        
        // Initialize color with deep background
        vec3 color = vec3(0.02, 0.01, 0.05);
        
        // Cymatic patterns based on audio frequency
        float cymatic = cymaticPattern(uv, uAudioFreq, time);
        vec3 cymaticColor = vec3(0.3, 0.6, 0.9) * abs(cymatic) * uAudioAmplitude;
        color += cymaticColor * 0.5;
        
        // Standing waves
        float standing = standingWave(uv, uAudioFreq, uAudioAmplitude, time);
        vec3 standingColor = vec3(0.9, 0.5, 0.3) * (standing * 0.5 + 0.5);
        color += standingColor * 0.3;
        
        // Entropy noise field
        float entropy = entropyField(uv, uEntropyNoise, time);
        vec3 entropyColor = vec3(0.5, 0.3, 0.7) * (entropy * 0.5 + 0.5);
        color += entropyColor * 0.2;
        
        // Phase drift visualization
        float phaseDrift = phaseDriftPattern(uv, uAudioPhase, time);
        vec3 phaseColor = vec3(0.7, 0.9, 0.4) * phaseDrift;
        color += phaseColor * 0.25;
        
        // Phi sacred geometry overlay
        float phi = phiGeometry(uv, uPhiLive, time);
        vec3 phiColor = vec3(0.9, 0.7, 0.3) * phi;
        color += phiColor * 0.3;
        
        // TMR consensus pattern
        float tmr = tmrPattern(uv, uConsensusLevel, time);
        vec3 tmrColor = vec3(0.3, 0.9, 0.7) * tmr;
        color += tmrColor * 0.2;
        
        // Cognitive load influence on color intensity
        color *= (1.0 + uCognitiveLoad * 0.3);
        
        // Center glow
        float centerGlow = 0.1 / (dist + 0.1);
        color += vec3(0.6, 0.4, 0.8) * centerGlow * 0.2;
        
        // Frequency-based color modulation
        float freqMod = sin(time * 2.0 + uAudioFreq * 0.01) * 0.5 + 0.5;
        color = mix(color, color * vec3(1.2, 0.9, 1.1), freqMod * 0.3);
        
        // Vignette
        float vignette = smoothstep(1.0, 0.3, dist);
        color *= vignette;
        
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
    const uConsensusLevel = gl.getUniformLocation(program, "uConsensusLevel");
    const uAudioFreq = gl.getUniformLocation(program, "uAudioFreq");
    const uAudioAmplitude = gl.getUniformLocation(program, "uAudioAmplitude");
    const uAudioPhase = gl.getUniformLocation(program, "uAudioPhase");
    const uEntropyNoise = gl.getUniformLocation(program, "uEntropyNoise");
    const uPhiLive = gl.getUniformLocation(program, "uPhiLive");
    const uCognitiveLoad = gl.getUniformLocation(program, "uCognitiveLoad");

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
      gl.uniform1f(uConsensusLevel, parameters.uConsensusLevel);

      // Audio metrics uniforms
      gl.uniform1f(uAudioFreq, audioMetrics.frequency);
      gl.uniform1f(uAudioAmplitude, audioMetrics.amplitude);
      gl.uniform1f(uAudioPhase, audioMetrics.phaseDrift);
      gl.uniform1f(uEntropyNoise, audioMetrics.entropyNoise);

      // Human metrics uniforms
      gl.uniform1f(uPhiLive, humanMetrics.phiLive);
      gl.uniform1f(uCognitiveLoad, humanMetrics.cognitiveLoad);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [parameters, audioMetrics, humanMetrics, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
