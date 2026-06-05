import React, { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { cn } from '../lib/utils';

export type CrystalState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';
export type CrystalEmotion = 'analytical' | 'creative' | 'urgency' | 'neutral';

interface SaphiraCrystalProps {
  state: CrystalState;
  emotion?: CrystalEmotion;
  className?: string;
  onClick?: () => void;
  audioLevel?: number; // 0 to 1
}

export const SaphiraCrystal: React.FC<SaphiraCrystalProps> = ({ 
  state, 
  emotion = 'neutral', 
  className, 
  onClick,
  audioLevel = 0
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  const stateRef = useRef(state);
  const audioLevelRef = useRef(audioLevel);
  const emotionRef = useRef(emotion);
  
  useEffect(() => {
    stateRef.current = state;
    audioLevelRef.current = audioLevel;
    emotionRef.current = emotion;
  }, [state, audioLevel, emotion]);

  // Color mapping with deep physical gradients
  const colors = useMemo(() => {
    // Neon Pink target, Translucent Violet target, Electric Cyan highlights
    const neonPink = new THREE.Color('#ff007f');
    const translucentViolet = new THREE.Color('#da70d6');
    const electricCyan = new THREE.Color('#00ffff');
    const errorRed = new THREE.Color('#ff1493');
    
    return {
      neonPink,
      translucentViolet,
      electricCyan,
      errorRed,
    };
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = null; 

    const width = mountRef.current.clientWidth || 300;
    const height = mountRef.current.clientHeight || 300;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 3.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Dynamic State Uniforms passed to GLSL
    const uniforms = {
      uTime: { value: 0 },
      uAudioLevel: { value: 0 },
      uMainColor: { value: new THREE.Color('#ff007f') },
      uSecondColor: { value: new THREE.Color('#da70d6') },
      uHighlightColor: { value: new THREE.Color('#00ffff') },
      uState: { value: 0.0 }, // 0: idle, 1: listening, 2: thinking, 3: speaking, 4: error
    };

    // --- Vertex Shader ---
    // Emulates a 3D fluid-dynamics engine using vector flow displacement,
    // variable point-sizes for refraction emulation, and noise fields.
    const vertexShader = `
      uniform float uTime;
      uniform float uAudioLevel;
      uniform float uState;
      
      attribute float aRandom;
      attribute vec3 aVelocity;
      
      varying vec3 vPosition;
      varying float vNormalizedDepth;
      varying float vBlobDensity;
      varying float vType; // 0: core fluid particles, 1: outer micro-sparkles
      
      // Multi-octave 3D sine-turbulence flow mapping
      vec3 getFluidFlow(vec3 p, float t, float scale) {
        vec3 flow;
        flow.x = sin(p.y * 1.8 + t * 0.9) * cos(p.z * 1.2 + t * 0.5);
        flow.y = sin(p.z * 1.5 - t * 1.1) * cos(p.x * 2.0 + t * 0.8);
        flow.z = sin(p.x * 1.2 + t * 1.4) * cos(p.y * 1.6 - t * 0.7);
        
        // Add a second high-frequency octave
        vec3 flow2;
        flow2.x = sin(p.z * 3.5 + t * 1.8) * 0.3;
        flow2.y = sin(p.x * 4.2 + t * 2.0) * 0.3;
        flow2.z = sin(p.y * 3.8 + t * 1.5) * 0.3;
        
        return (flow + flow2) * scale;
      }

      void main() {
        vType = aRandom > 0.85 ? 1.0 : 0.0;
        vec3 pos = position;
        
        float timeScale = uTime * 1.2;
        
        // Custom physics depending on state
        if (vType == 0.0) {
          // Core Fluid Body
          float flowIntensity = 0.35 + uAudioLevel * 1.5;
          if (uState == 2.0) { // thinking / processing fast ripple
            flowIntensity = 0.85;
            timeScale = uTime * 2.0;
          } else if (uState == 4.0) { // error
            flowIntensity = 0.95;
            timeScale = uTime * 2.5;
          } else if (uState == 0.0) { // idle - calm slow breathe
            flowIntensity = 0.15;
            timeScale = uTime * 0.5;
          }
          
          vec3 shift = getFluidFlow(pos, timeScale + aRandom * 12.0, flowIntensity);
          pos += shift;
          
          // Audio physical expansion pulsation
          float expansion = 1.0 + uAudioLevel * 0.55;
          pos *= expansion;
          
        } else {
          // Outer orbiting micro-sparkles drift organically around the core
          float orbitSpeed = 0.4 + aRandom * 0.6;
          // Orbital rotation matrix
          float angle = uTime * orbitSpeed + aRandom * 6.28;
          float r = length(pos.xy) * (1.1 + uAudioLevel * 0.3);
          pos.x = cos(angle) * r;
          pos.y = sin(angle) * r;
          
          // Drift up and down organically
          pos.z += sin(uTime * 0.8 + aRandom * 10.0) * 0.6;
        }

        // Project coordinate math
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        vPosition = pos;
        
        // Emulated Ray Tracing refraction coefficient: map Z depth from 0 to 1
        vNormalizedDepth = (mvPosition.z + 5.0) / 10.0; // Normalized depth representation
        
        // Calculate particle size based on depth and audio level
        float sizeCoef = vType == 0.0 ? 8.0 : 3.0;
        float baseSize = (sizeCoef + aRandom * 12.0 + uAudioLevel * 25.0);
        
        // Perspective divide to simulate physical size projection
        gl_PointSize = baseSize * (15.0 / -mvPosition.z);
        
        // Limit point sizes
        gl_PointSize = clamp(gl_PointSize, 1.5, 64.0);
      }
    `;

    // --- Fragment Shader ---
    // Handles complex light refraction, iridescent pink/violet/cyan gradients,
    // ambient bloom, and sparkle-drift logic.
    const fragmentShader = `
      uniform vec3 uMainColor;
      uniform vec3 uSecondColor;
      uniform vec3 uHighlightColor;
      uniform float uAudioLevel;
      uniform float uTime;
      uniform float uState;
      
      varying vec3 vPosition;
      varying float vNormalizedDepth;
      varying float vType;
      
      void main() {
        // Form a perfect high-fidelity circular particle with soft edge (anti-aliasing)
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        if (dist > 0.5) discard;
        
        float circleEdge = smoothstep(0.5, 0.2, dist);
        
        // Deep physical gradients using dynamic color interpolation
        vec3 finalColor;
        float alpha = 1.0;
        
        if (vType == 0.0) {
          // Iridescent deep liquid-gas fluid body shading
          // Mix colors based on position coordinate space and depth
          float colorMixVal = clamp((vPosition.y + 1.2) / 2.5, 0.0, 1.0);
          float depthRefraction = clamp((vPosition.z + 1.0) / 2.0, 0.0, 1.0);
          
          vec3 baseGrad = mix(uSecondColor, uMainColor, colorMixVal);
          
          // Highlights using the refracting cyan overlay on crests
          float crest = smoothstep(0.4, 0.9, sin(vPosition.x * 2.0 + uTime) * cos(vPosition.y * 2.0 - uTime));
          finalColor = mix(baseGrad, uHighlightColor, crest * 0.4);
          
          // Central Hot Incandescent Refraction Core Bloom
          float centerGlow = 1.0 - clamp(length(vPosition) / 1.7, 0.0, 1.0);
          finalColor += vec3(1.0, 0.9, 1.0) * pow(centerGlow, 2.0) * (0.3 + uAudioLevel * 1.5);
          
          // Depth based alpha calibration (emulating real ray tracing opacity layers)
          alpha = (0.22 + depthRefraction * 0.44 + uAudioLevel * 0.3) * circleEdge;
          
          // Glass mophism panel refraction highlight
          float glassRef = smoothstep(0.4, 0.5, dist) * 0.3;
          finalColor += vec3(1.0) * glassRef;
          
        } else {
          // Ultra-fine micro-sparkle particles
          // Sparkle intensity modulates over time
          float flicker = sin(uTime * 5.0 + vPosition.x * 100.0) * 0.5 + 0.5;
          finalColor = mix(uHighlightColor, vec3(1.0), 0.6);
          alpha = (0.15 + flicker * 0.6) * circleEdge;
        }
        
        // Soft ambient bloom glow overlay
        gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 1.0));
      }
    `;

    // Initialize high-density particle arrays
    const particleCount = 7000;
    const geometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const randoms = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Form a zero-gravity fluid sphere/ellipsoid cloud
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      // Vary radii to construct a dense core with an outer lighter shell
      const isCore = Math.random() > 0.15;
      const radius = isCore 
        ? Math.random() * 1.1 // Core fluid bounds
        : 1.1 + Math.random() * 0.9; // Outer orbital bounds for sparkles
        
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      randoms[i] = Math.random();
      
      // Velocity vectors for fluid motion mapping
      velocities[i * 3] = (Math.random() - 0.5) * 0.1;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    geometry.setAttribute('aVelocity', new THREE.BufferAttribute(velocities, 3));
    
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: true
    });
    
    const fluidParticles = new THREE.Points(geometry, material);
    scene.add(fluidParticles);

    // Subtle ambient lighting to blend 3D coordinates smoothly
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    let animationFrameId: number;
    let targetStateCode = 0.0;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Capture dynamic state changes smoothly
      const currentState = stateRef.current;
      const currentAudio = audioLevelRef.current;
      const currentEmotion = emotionRef.current;
      
      let stateCode = 0.0; // idle
      let timeInc = 0.012;
      
      switch (currentState) {
        case 'idle':
          stateCode = 0.0;
          timeInc = 0.006;
          // Soft slow breathing color
          uniforms.uMainColor.value.lerp(colors.neonPink, 0.04);
          uniforms.uSecondColor.value.lerp(colors.translucentViolet, 0.04);
          break;
        case 'listening':
          stateCode = 1.0;
          timeInc = 0.018;
          // Heightened violet/pink pulsing
          uniforms.uMainColor.value.lerp(colors.neonPink, 0.08);
          uniforms.uSecondColor.value.lerp(colors.electricCyan, 0.08);
          break;
        case 'thinking':
          stateCode = 2.0;
          timeInc = 0.035; // Rapid flow waves for logic sync
          uniforms.uMainColor.value.lerp(colors.electricCyan, 0.06);
          uniforms.uSecondColor.value.lerp(colors.translucentViolet, 0.06);
          break;
        case 'speaking':
          stateCode = 3.0;
          timeInc = 0.02 + currentAudio * 0.025; // Fluctuates dynamically with speech
          uniforms.uMainColor.value.lerp(colors.neonPink, 0.08);
          uniforms.uSecondColor.value.lerp(colors.translucentViolet, 0.08);
          break;
        case 'error':
          stateCode = 4.0;
          timeInc = 0.04;
          // Solid alert dynamic red/pink gradient
          uniforms.uMainColor.value.lerp(colors.errorRed, 0.1);
          uniforms.uSecondColor.value.lerp(colors.neonPink, 0.1);
          break;
      }
      
      targetStateCode += (stateCode - targetStateCode) * 0.1;
      uniforms.uState.value = targetStateCode;
      
      // Interpolate audio values to prevent sudden clipping jumps
      uniforms.uAudioLevel.value += (currentAudio - uniforms.uAudioLevel.value) * 0.22;
      uniforms.uTime.value += timeInc;
      
      // Slow orbital rotate of the overall camera perspective
      fluidParticles.rotation.y = uniforms.uTime.value * 0.12;
      fluidParticles.rotation.x = uniforms.uTime.value * 0.06;
      
      renderer.render(scene, camera);
    };
    
    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === mountRef.current) {
          const { width: entryWidth, height: entryHeight } = entry.contentRect;
          if (entryWidth > 0 && entryHeight > 0) {
            camera.aspect = entryWidth / entryHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(entryWidth, entryHeight);
          }
        }
      }
    });

    if (mountRef.current) {
      resizeObserver.observe(mountRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [colors]);

  return (
    <div 
      className={cn("relative flex items-center justify-center cursor-pointer overflow-hidden rounded-full", className)} 
      onClick={onClick}
    >
      {/* Real-time ray tracing backdrop glass halo */}
      <div className="absolute inset-2 bg-gradient-to-tr from-[#ff007f]/5 via-transparent to-[#da70d6]/5 rounded-full blur-xl pointer-events-none" />
      <div 
        ref={mountRef} 
        className="w-full h-full min-h-[120px] pointer-events-none relative z-10" 
      />
    </div>
  );
};
