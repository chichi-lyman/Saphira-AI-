import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CrystalState, CrystalEmotion } from './SaphiraCrystal';

interface NeuralSyncVisualizerProps {
  state: CrystalState;
  emotion?: CrystalEmotion;
  audioLevel?: number;
  active: boolean;
  vitals?: {
    cognitiveLoad: number;
    coherence: number;
    confidence: number;
    stress: number;
    phi: number;
  };
}

export const NeuralSyncVisualizer: React.FC<NeuralSyncVisualizerProps> = ({
  state,
  emotion = 'neutral',
  audioLevel = 0,
  active,
  vitals = { cognitiveLoad: 15, coherence: 95, confidence: 80, stress: 0.05, phi: 0.45 }
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef({
    time: { value: 0 },
    audioLevel: { value: 0 },
    state: { value: 0 }, 
    resolution: { value: new THREE.Vector2() },
    mouse: { value: new THREE.Vector2(0.5, 0.5) },
    touchIntensity: { value: 0.0 },
    colorMain: { value: new THREE.Color('#3b82f6') },
    colorAccent: { value: new THREE.Color('#ec4899') },
    load: { value: 15.0 },
    coherence: { value: 95.0 },
    confidence: { value: 80.0 },
    stress: { value: 0.05 },
    phi: { value: 0.45 }
  });

  const stateToVal = (s: CrystalState) => {
    switch (s) {
      case 'idle': return 0;
      case 'listening': return 1;
      case 'thinking': return 2;
      case 'speaking': return 3;
      default: return 0;
    }
  };

  const emotionToColors = (e: CrystalEmotion) => {
    switch (e) {
      case 'analytical': return { main: '#0ea5e9', accent: '#3b82f6' };
      case 'creative': return { main: '#a855f7', accent: '#d946ef' };
      case 'urgency': return { main: '#f97316', accent: '#ef4444' };
      case 'neutral':
      default: return { main: '#3b82f6', accent: '#ec4899' };
    }
  };

  useEffect(() => {
    if (!active || !mountRef.current) return;

    const scene = new THREE.Scene();
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    uniformsRef.current.resolution.value.set(width, height);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: uniformsRef.current,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float audioLevel;
        uniform float state;
        uniform float load;
        uniform float coherence;
        uniform float confidence;
        uniform float stress;
        uniform float phi;
        uniform vec2 resolution;
        uniform vec2 mouse;
        uniform float touchIntensity;
        uniform vec3 colorMain;
        uniform vec3 colorAccent;
        varying vec2 vUv;

        float hash(vec2 p) {
            p = fract(p * vec2(123.34, 456.21));
            p += dot(p, p + 45.32);
            return fract(p.x * p.y);
        }

        float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        void main() {
            vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);
            
            // Magnetic touch pull
            vec2 mouseUv = (mouse.xy - 0.5) * (resolution.xy / min(resolution.y, resolution.x));
            float distToMouse = length(uv - mouseUv);
            float magneticPull = (1.0 / (distToMouse + 0.1)) * touchIntensity * 0.15;
            uv = mix(uv, mouseUv, magneticPull);

            // Dynamics based on state and neuro-vitals
            float speedBase = 0.4 + (load / 100.0) * 1.5;
            float speed = speedBase;
            float complexity = 3.0 + (phi * 7.0);
            float intensity = 0.8 + (stress * 1.5);
            
            // Heartbeat Pulse when stressed/overheating
            float heartbeat = 1.0;
            if (stress > 0.6) {
                heartbeat = 1.0 + 0.2 * sin(time * 10.0 * (1.0 + stress));
            }
            intensity *= heartbeat;

            // Contextual Coherence impact: Erraticism
            float erraticScroll = (1.0 - coherence / 100.0) * 5.0;
            vec2 scrollUv = uv + noise(uv * 5.0 + time * 0.5) * erraticScroll;

            if (state == 2.0) { // Thinking: Hyperfocus
                speed = speedBase * 2.0;
                complexity = 10.0;
                intensity = (1.2 + stress * 2.0) * heartbeat;
            } else if (state == 1.0) { // Listening: Calm Readiness
                speed = speedBase * 0.3;
                complexity = 4.0;
                intensity = 1.0;
            } else if (state == 3.0) { // Speaking: Synchronized Output
                speed = speedBase * 1.5;
                complexity = 6.0;
                intensity = 1.4 * heartbeat;
            }

            float t = time * speed;
            
            // Neural Mesh FBM
            float n = 0.0;
            float amp = 1.0;
            vec2 p = scrollUv * (2.0 + stress * 2.0);
            
            // Heat/Load Distortion
            float distortionFactor = (load / 100.0) * 0.2 + (stress * 0.1);
            p += noise(uv * 12.0 + time) * distortionFactor;

            for(int i = 0; i < 8; i++) {
                if (float(i) >= complexity) break;
                n += noise(p + t * 0.1) * amp;
                p = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5)) * p * 2.2 + vec2(10.0);
                amp *= 0.55;
            }

            // High intensity "electrical" pulse threads
            float threads = smoothstep(0.05, 0.0, abs(n - 0.5));
            
            // Synapse branches
            float cellDist = 1.0;
            vec2 cellP = scrollUv * 6.0;
            for(int i = 0; i < 3; i++) {
                vec2 gridP = fract(cellP) - 0.5;
                float dist = length(gridP - vec2(sin(t+float(i)), cos(t+float(i)))*0.2);
                cellDist = min(cellDist, dist);
                cellP *= 1.5;
            }
            float synapses = smoothstep(0.1, 0.0, cellDist) * 1.5;
            
            // Impulses
            float impulse = sin(n * 25.0 - t * 4.0) * 0.5 + 0.5;
            impulse = pow(impulse, 12.0);
            threads += (impulse + synapses) * threads * 2.5 * intensity;

            // Synthesis Confidence Ripple (The Eureka Moment)
            float distFromCenter = length(uv);
            float eurekaBase = confidence / 100.0;
            float eurekaRipple = sin(distFromCenter * 15.0 - time * 6.0) * 0.5 + 0.5;
            eurekaRipple = pow(eurekaRipple, 20.0) * eurekaBase * (state == 3.0 ? 1.0 : 0.2);
            
            // Composition
            vec3 fireColor = vec3(1.0, 0.0, 0.5); // Neon Pink
            vec3 baseColor = mix(colorMain, colorAccent, n);
            
            // Overheat intensity + Touch Heatmap
            float overheatAmount = smoothstep(70.0, 100.0, load) * stress;
            float touchHeat = smoothstep(0.3, 0.0, distToMouse) * touchIntensity;
            
            // Glitch Fracture during high stress / contradiction alert
            float glitch = step(0.98, fract(sin(time * 50.0 + uv.y * 100.0))) * step(0.5, stress);
            vec3 color = mix(baseColor, fireColor, max(overheatAmount, touchHeat));
            color = mix(color, vec3(1.0), glitch * 0.5); // "Fracture" white flicker
            
            color += eurekaRipple * colorMain * 0.5; 
            color += threads * mix(color, fireColor, impulse * max(overheatAmount, touchHeat)) * 0.5;
            
            // Disconnect glow (Contextual Anxiety)
            if (coherence < 50.0) {
               color = mix(color, vec3(1.0, 0.6, 0.0), (1.0 - coherence / 50.0) * 0.5);
            }

            // Alpha masking
            float mask = 1.0 - smoothstep(0.3, 0.9, distFromCenter);
            gl_FragColor = vec4(color * intensity * mask, mask * 0.85);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      uniformsRef.current.time.value += 0.01;
      uniformsRef.current.audioLevel.value += (audioLevel - uniformsRef.current.audioLevel.value) * 0.1;
      uniformsRef.current.state.value = stateToVal(state);
      uniformsRef.current.load.value = vitals.cognitiveLoad;
      uniformsRef.current.coherence.value = vitals.coherence;
      uniformsRef.current.confidence.value = vitals.confidence;
      uniformsRef.current.stress.value = vitals.stress;
      uniformsRef.current.phi.value = vitals.phi;
      
      const colors = emotionToColors(emotion);
      uniformsRef.current.colorMain.value.lerp(new THREE.Color(colors.main), 0.05);
      uniformsRef.current.colorAccent.value.lerp(new THREE.Color(colors.accent), 0.05);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      renderer.setSize(w, h);
      uniformsRef.current.resolution.value.set(w, h);
    };

    window.addEventListener('resize', handleResize);

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      let x, y;
      if ('touches' in e) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }
      uniformsRef.current.mouse.value.set(x / rect.width, 1 - y / rect.height);
      uniformsRef.current.touchIntensity.value = 1.0;
    };

    const handlePointerDown = () => {
      uniformsRef.current.touchIntensity.value = 1.0;
      if (window.navigator.vibrate) window.navigator.vibrate(5);
    };

    const handlePointerUp = () => {
      // Precision Recalibration: Snap back
      uniformsRef.current.touchIntensity.value = 0.0;
      if (window.navigator.vibrate) window.navigator.vibrate(10);
    };

    mountRef.current.addEventListener('mousemove', handlePointerMove);
    mountRef.current.addEventListener('mousedown', handlePointerDown);
    mountRef.current.addEventListener('mouseup', handlePointerUp);
    mountRef.current.addEventListener('touchstart', handlePointerMove);
    mountRef.current.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeEventListener('mousemove', handlePointerMove);
        mountRef.current.removeEventListener('mousedown', handlePointerDown);
        mountRef.current.removeEventListener('mouseup', handlePointerUp);
        mountRef.current.removeEventListener('touchstart', handlePointerMove);
        mountRef.current.removeEventListener('touchend', handlePointerUp);
      }
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [active, state, emotion, audioLevel]);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-auto cursor-crosshair" />;
};
