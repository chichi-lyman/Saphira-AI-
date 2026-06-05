import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  uniform float u_time;
  uniform vec2 u_resolution;
  varying vec2 vUv;

  // Pseudo-random and noise functions
  float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
  }

  float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  // Fractional Brownian Motion optimized for mobile (3 octaves)
  float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      for (int i = 0; i < 3; i++) {
          v += a * noise(p);
          p = rot * p * 2.0 + vec2(100.0);
          a *= 0.5;
      }
      return v;
  }

  void main() {
      // Normalize coordinated and adjust for aspect ratio
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      vec2 p = uv * 2.0 - 1.0;
      p.x *= u_resolution.x / u_resolution.y;

      // Flowing nebula coordinates
      vec2 q = vec2(0.0);
      q.x = fbm(p + 0.02 * u_time);
      q.y = fbm(p + vec2(1.0));

      vec2 r = vec2(0.0);
      r.x = fbm(p + 1.0 * q + vec2(1.7, 9.2) + 0.1 * u_time);
      r.y = fbm(p + 1.0 * q + vec2(8.3, 2.8) + 0.08 * u_time);

      float f = fbm(p + r);

      // Ultra-subtle light gray gradient base (#E2E8F0 to #F1F5F9)
      vec3 colBackgroundStart = vec3(0.945, 0.961, 0.976); // #F1F5F9
      vec3 colBackgroundEnd = vec3(0.886, 0.910, 0.941);   // #E2E8F0
      vec3 baseGradient = mix(colBackgroundStart, colBackgroundEnd, uv.y + 0.3 * uv.x);

      // Iridescent Rainbow Prism Flare catches
      vec3 colPrismPink = vec3(0.98, 0.82, 0.88);   // Soft pastel pink/magenta catch
      vec3 colPrismCyan = vec3(0.82, 0.95, 0.97);   // Soft pristine holographic cyan catch
      vec3 colPrismAmber = vec3(0.98, 0.93, 0.82);  // Soft amber/gold edge refraction catch

      float blend1 = clamp(length(q) * 1.5, 0.0, 1.0);
      float blend2 = clamp(length(r.x) * 1.5, 0.0, 1.0);
      float blend3 = clamp(f * f * 2.0, 0.0, 1.0);

      vec3 color = baseGradient;
      // Add subtle overlays of prism flares that move gracefully on screen
      color = mix(color, colPrismPink, blend1 * 0.12);
      color = mix(color, colPrismCyan, blend2 * 0.10);
      color = mix(color, colPrismAmber, blend3 * 0.08);

      // Ultra-subtle prismatic refraction highlights
      color += vec3(0.98, 0.99, 1.0) * (f * f * 0.02);

      // Starfield Layer 1: Minimal static sparkling stars
      float star = hash(p * 120.0);
      float staticStar = smoothstep(0.994, 1.0, star) * 0.15;
      
      // Starfield Layer 2: Soft pulsing/shimmering stars
      float pulseStarSeed = hash(p * 180.0 + vec2(1.1));
      float pulseStar = smoothstep(0.997, 1.0, pulseStarSeed);
      pulseStar *= (sin(u_time * 1.5 + pulseStarSeed * 20.0) * 0.5 + 0.5) * 0.25;

      color += vec3(staticStar + pulseStar);

      gl_FragColor = vec4(color, 1.0);
  }
`;

export const CosmicBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    
    // Low pixel ratio for mobile performance
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
    renderer.setPixelRatio(pixelRatio);
    
    const mount = mountRef.current;
    mount.appendChild(renderer.domElement);

    // MATERIAL & GEOMETRY
    const uniforms = {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2() }
    };
    
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthWrite: false,
      depthTest: false
    });
    
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // RESIZE HANDLING
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      uniforms.u_resolution.value.set(width * pixelRatio, height * pixelRatio);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // ANIMATION LOOP
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const render = () => {
      uniforms.u_time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    // CLEANUP
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement === mountRef.current.firstChild) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
};
