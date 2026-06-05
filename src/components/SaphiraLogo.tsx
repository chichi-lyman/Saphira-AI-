import React from 'react';
import { cn } from '../lib/utils';

interface SaphiraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  isThinking?: boolean;
}

export function SaphiraLogo({ className, size = 'md', isThinking = false }: SaphiraLogoProps) {
  const dimensions = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  };

  return (
    <div className={cn(
      "relative flex items-center justify-center select-none z-30 transition-all duration-500",
      dimensions[size],
      className
    )}>
      {/* Soft Ambient Floating White Glow (Depth Effect) */}
      <div className={cn(
        "absolute inset-0 bg-white/20 rounded-full blur-2xl opacity-40 transition-all duration-[3000ms]",
        isThinking && "bg-pink-500/10 blur-3xl opacity-60 scale-110"
      )} />

      {/* 3D Glass Sphere Backdrop containing the Scorpio */}
      <div className={cn(
        "absolute inset-0 rounded-2xl border border-white/40 bg-gradient-to-tr from-[#FF007F] via-pink-500 to-[#FF69B4] backdrop-blur-[25px] flex items-center justify-center overflow-hidden transition-all duration-500",
        "shadow-[0_12px_32px_rgba(255,0,127,0.4),_inset_0_1px_4px_rgba(255,255,255,0.6)]",
        isThinking && "border-white/70 shadow-[0_16px_40px_rgba(255,0,127,0.6)] scale-[1.05]"
      )}>
        {/* Shimmer Light Loop sweeping across the Glass Orb */}
        <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full animate-[shimmer_3s_infinite_linear]" style={{ animationDuration: '3.5s' }} />
        
        {/* Iridescent edge catch inside glass */}
        <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-tr from-white/10 via-transparent to-white/20 pointer-events-none opacity-80" />

        {/* 3D Crystal Sculpted Scorpio SVG */}
        <svg 
          viewBox="0 0 100 100" 
          className={cn(
            "w-4/5 h-4/5 drop-shadow-[0_4px_16px_rgba(255,255,255,0.4)] relative z-11 transition-all duration-1000",
            isThinking && "scale-105 filter saturate-150 rotate-3"
          )}
        >
          <defs>
            {/* Linear gradient for sculpted ice fill */}
            <linearGradient id="scorpioIceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 1.0)" />
              <stop offset="40%" stopColor="rgba(255, 255, 255, 0.75)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.35)" />
            </linearGradient>

            {/* Specular edge-reflection border */}
            <linearGradient id="scorpioSpecularStroke" x1="10%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1.0" />
              <stop offset="40%" stopColor="rgba(255, 255, 255, 0.90)" />
              <stop offset="70%" stopColor="rgba(255, 255, 255, 0.60)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.30)" />
            </linearGradient>

            {/* Specular Lighting Filter for sculpted 3D shine look */}
            <filter id="scorpioChromoPrism">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
              <feSpecularLighting in="blur" surfaceScale="5" specularConstant="1.2" specularExponent="40" lightingColor="#ffffff" result="specOut">
                <fePointLight x="-50" y="-100" z="200" />
              </feSpecularLighting>
              <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOutIn" />
              <feComposite in="SourceGraphic" in2="specOutIn" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
            </filter>
          </defs>

          {/* Detailed stylized Scorpio path - highly detailed vector curves of claws, joints, and sting */}
          <g filter="url(#scorpioChromoPrism)">
            {/* Claws & Legs (Symmetric Glass segments) */}
            {/* Left claw segment */}
            <path 
              d="M 50,45 C 38,40 22,35 22,25 C 22,17 32,15 36,21 C 33,26 40,29 45,35" 
              fill="none" 
              stroke="url(#scorpioIceGradient)" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            {/* Left claw pincers */}
            <path 
              d="M 22,25 C 16,21 16,12 25,12 C 22,18 28,19 28,21" 
              fill="none" 
              stroke="url(#scorpioIceGradient)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
            {/* Right claw segment */}
            <path 
              d="M 50,45 C 62,40 78,35 78,25 C 78,17 68,15 64,21 C 67,26 60,29 55,35" 
              fill="none" 
              stroke="url(#scorpioIceGradient)" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            {/* Right claw pincers */}
            <path 
              d="M 78,25 C 84,21 84,12 75,12 C 78,18 72,19 72,21" 
              fill="none" 
              stroke="url(#scorpioIceGradient)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />

            {/* Left legs */}
            <path d="M 44,48 C 34,50 30,46 25,52" fill="none" stroke="url(#scorpioIceGradient)" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 43,54 C 33,56 29,52 24,58" fill="none" stroke="url(#scorpioIceGradient)" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 41,60 C 31,62 27,58 22,64" fill="none" stroke="url(#scorpioIceGradient)" strokeWidth="1.8" strokeLinecap="round" />

            {/* Right legs */}
            <path d="M 56,48 C 66,50 70,46 75,52" fill="none" stroke="url(#scorpioIceGradient)" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 57,54 C 67,56 71,52 76,58" fill="none" stroke="url(#scorpioIceGradient)" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 59,60 C 69,62 73,58 78,64" fill="none" stroke="url(#scorpioIceGradient)" strokeWidth="1.8" strokeLinecap="round" />

            {/* Central segmented body (Ice Core crystals) */}
            <ellipse cx="50" cy="40" rx="4.5" ry="5.5" fill="url(#scorpioIceGradient)" stroke="url(#scorpioSpecularStroke)" strokeWidth="0.8" />
            <ellipse cx="50" cy="48" rx="5.5" ry="6.5" fill="url(#scorpioIceGradient)" stroke="url(#scorpioSpecularStroke)" strokeWidth="0.8" />
            <ellipse cx="50" cy="56" rx="5.0" ry="6.0" fill="url(#scorpioIceGradient)" stroke="url(#scorpioSpecularStroke)" strokeWidth="0.8" />
            <ellipse cx="50" cy="63" rx="4.0" ry="5.0" fill="url(#scorpioIceGradient)" stroke="url(#scorpioSpecularStroke)" strokeWidth="0.8" />

            {/* Tail spine segments arching up */}
            <circle cx="50" cy="70" r="3.2" fill="url(#scorpioIceGradient)" stroke="url(#scorpioSpecularStroke)" strokeWidth="0.8" />
            <circle cx="51" cy="75.5" r="2.8" fill="url(#scorpioIceGradient)" stroke="url(#scorpioSpecularStroke)" strokeWidth="0.8" />
            <circle cx="54" cy="80.5" r="2.4" fill="url(#scorpioIceGradient)" stroke="url(#scorpioSpecularStroke)" strokeWidth="0.8" />
            
            {/* Arched stinger (Forward-pointing curve) */}
            <path 
              d="M 54,80.5 C 60,83 66,74 61,65 C 57,58 48,56 47,56" 
              fill="none" 
              stroke="url(#scorpioIceGradient)" 
              strokeWidth="2.5" 
              strokeLinejoin="round" 
              strokeLinecap="round" 
            />
            {/* Stinger tip neon specular drop */}
            <circle cx="47" cy="56" r="1.0" fill="#ffffff" />
          </g>

          {/* Bright Specular Highlight Lines overlay */}
          <path 
            d="M 50,42 L 50,60" 
            stroke="#ffffff" 
            strokeWidth="0.80" 
            strokeLinecap="round" 
            opacity="0.8" 
          />
          <path 
            d="M 56,36 C 53,32 47,32 44,36" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="0.75" 
            strokeLinecap="round" 
            opacity="0.7" 
          />
        </svg>

        {/* 3D Glass Surface Reflections (Top left crescent highlight & bottom arc check) */}
        <div className="absolute top-[3%] left-[5%] w-[85%] h-[40%] rounded-full bg-gradient-to-b from-white/35 to-transparent pointer-events-none transform -rotate-12 blur-[0.5px]" />
        <div className="absolute bottom-[3%] right-[8%] w-[40%] h-[20%] rounded-full bg-gradient-to-t from-white/10 to-transparent pointer-events-none transform rotate-12 blur-[1px]" />
      </div>
    </div>
  );
}
