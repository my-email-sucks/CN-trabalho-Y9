import React, { useCallback, useRef } from 'react';
import { useAtlasStore } from '../store/useAtlasStore';
import { calculateOrganHealth } from '../utils/organHealthCalculator';

export const MapaDoCorpo: React.FC = () => {
  const { focusOrganId, setFocusOrgan, accessibility, meters, selectedHabits } = useAtlasStore();
  const svgRef = useRef<SVGSVGElement>(null);

  const handleOrganClick = useCallback((organId: string) => {
    setFocusOrgan(organId === focusOrganId ? undefined : organId);
  }, [focusOrganId, setFocusOrgan]);

  const getOrganColor = (organId: string, baseColor: string, affectedColor: string) => {
    // Use exponential organ health calculation
    const organHealth = meters.organHealth?.[organId] || 80;
    const healthRatio = organHealth / 100;
    
    if (accessibility.highContrast) {
      return healthRatio > 0.7 ? '#00ff00' : healthRatio > 0.4 ? '#ffff00' : '#ff0000';
    }
    
    // Interpolate between healthy and affected colors based on health
    const r = Math.round(parseInt(baseColor.slice(1, 3), 16) * healthRatio + 
                        parseInt(affectedColor.slice(1, 3), 16) * (1 - healthRatio));
    const g = Math.round(parseInt(baseColor.slice(3, 5), 16) * healthRatio + 
                        parseInt(affectedColor.slice(3, 5), 16) * (1 - healthRatio));
    const b = Math.round(parseInt(baseColor.slice(5, 7), 16) * healthRatio + 
                        parseInt(affectedColor.slice(5, 7), 16) * (1 - healthRatio));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const getOrganOpacity = (organId: string) => {
    // Use exponential organ health calculation for opacity
    const organHealth = Math.max(20, Math.min(100, meters.organHealth?.[organId] || 80));
    return organHealth / 100;
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 rounded-lg p-8">
      <svg
        ref={svgRef}
        viewBox="0 0 400 600"
        className="max-w-md w-full h-auto cursor-pointer"
        style={{ filter: accessibility.highContrast ? 'contrast(1.5)' : 'none' }}
      >
        <defs>
          {/* Clean skin gradient matching reference image */}
          <radialGradient id="skinGradient" cx="0.4" cy="0.3" r="0.8">
            <stop offset="0%" stopColor="#F5D5AE" />
            <stop offset="50%" stopColor="#E8C4A0" />
            <stop offset="100%" stopColor="#D4A574" />
          </radialGradient>
          
          {/* Hair gradient */}
          <radialGradient id="hairGradient" cx="0.3" cy="0.2" r="0.7">
            <stop offset="0%" stopColor="#8B7355" />
            <stop offset="100%" stopColor="#6B5B47" />
          </radialGradient>
          
          {/* Subtle shadow for depth */}
          <filter id="organShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="2" stdDeviation="1" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Head */}
        <ellipse
          cx="200"
          cy="80"
          rx="35"
          ry="40"
          fill="url(#skinGradient)"
          stroke="#D4A574"
          strokeWidth="1"
          className="transition-all duration-300"
        />
        
        {/* Hair */}
        <path
          d="M165 50 Q200 30, 235 50 Q240 60, 235 70 Q200 45, 165 70 Q160 60, 165 50 Z"
          fill="url(#hairGradient)"
          className="transition-all duration-300"
        />
        
        {/* Simple facial features */}
        <circle cx="185" cy="75" r="2" fill="#333" />
        <circle cx="215" cy="75" r="2" fill="#333" />
        <path d="M190 90 Q200 95, 210 90" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Neck */}
        <rect
          x="185"
          y="120"
          width="30"
          height="25"
          fill="url(#skinGradient)"
          stroke="#D4A574"
          strokeWidth="1"
        />

        {/* Body - simplified torso matching reference */}
        <path
          d="M150 145 Q150 140, 160 140 L240 140 Q250 140, 250 145 L250 400 Q250 420, 240 420 L160 420 Q150 420, 150 400 Z"
          fill="url(#skinGradient)"
          stroke="#D4A574"
          strokeWidth="2"
          className="transition-all duration-300"
        />

        {/* Arms */}
        <ellipse
          cx="120"
          cy="200"
          rx="15"
          ry="60"
          fill="url(#skinGradient)"
          stroke="#D4A574"
          strokeWidth="1"
        />
        <ellipse
          cx="280"
          cy="200"
          rx="15"
          ry="60"
          fill="url(#skinGradient)"
          stroke="#D4A574"
          strokeWidth="1"
        />

        {/* Legs */}
        <rect
          x="170"
          y="420"
          width="25"
          height="120"
          rx="12"
          fill="url(#skinGradient)"
          stroke="#D4A574"
          strokeWidth="1"
        />
        <rect
          x="205"
          y="420"
          width="25"
          height="120"
          rx="12"
          fill="url(#skinGradient)"
          stroke="#D4A574"
          strokeWidth="1"
        />

        {/* Brain */}
        <ellipse
          id="organ-brain"
          cx="200"
          cy="70"
          rx="25"
          ry="18"
          fill={getOrganColor('brain', '#E8A5A5', '#CC4444')}
          opacity={getOrganOpacity('brain')}
          stroke={focusOrganId === 'brain' ? '#3b82f6' : '#B85450'}
          strokeWidth={focusOrganId === 'brain' ? '3' : '1.5'}
          className={`transition-all duration-500 hover:stroke-blue-500 hover:stroke-2 cursor-pointer ${
            !accessibility.reduceMotion ? 'hover:scale-105' : ''
          }`}
          onClick={() => handleOrganClick('brain')}
          style={{ transformOrigin: '200px 70px' }}
          filter="url(#organShadow)"
        />

        {/* Lungs */}
        <g id="organ-lungs" onClick={() => handleOrganClick('lungs')} className="cursor-pointer">
          <ellipse
            cx="175"
            cy="180"
            rx="20"
            ry="35"
            fill={getOrganColor('lungs', '#E8A5A5', '#CC4444')}
            opacity={getOrganOpacity('lungs')}
            stroke={focusOrganId === 'lungs' ? '#3b82f6' : '#B85450'}
            strokeWidth={focusOrganId === 'lungs' ? '3' : '1.5'}
            className={`transition-all duration-500 hover:stroke-blue-500 hover:stroke-2 ${
              !accessibility.reduceMotion ? 'hover:scale-105' : ''
            }`}
            filter="url(#organShadow)"
          />
          <ellipse
            cx="225"
            cy="180"
            rx="20"
            ry="35"
            fill={getOrganColor('lungs', '#E8A5A5', '#CC4444')}
            opacity={getOrganOpacity('lungs')}
            stroke={focusOrganId === 'lungs' ? '#3b82f6' : '#B85450'}
            strokeWidth={focusOrganId === 'lungs' ? '3' : '1.5'}
            className={`transition-all duration-500 hover:stroke-blue-500 hover:stroke-2 ${
              !accessibility.reduceMotion ? 'hover:scale-105' : ''
            }`}
            filter="url(#organShadow)"
          />
        </g>

        {/* Heart */}
        <path
          id="organ-heart"
          d="M200 160 C195 150, 185 150, 180 160 C180 150, 170 150, 175 160 C175 170, 185 180, 200 190 C215 180, 225 170, 225 160 C230 150, 220 150, 220 160 C215 150, 205 150, 200 160 Z"
          fill={getOrganColor('heart', '#E8A5A5', '#CC4444')}
          opacity={getOrganOpacity('heart')}
          stroke={focusOrganId === 'heart' ? '#3b82f6' : '#B85450'}
          strokeWidth={focusOrganId === 'heart' ? '3' : '1.5'}
          className={`transition-all duration-500 hover:stroke-blue-500 hover:stroke-2 cursor-pointer ${
            !accessibility.reduceMotion ? 'hover:scale-105' : ''
          }`}
          onClick={() => handleOrganClick('heart')}
          style={{ transformOrigin: '200px 170px' }}
          filter="url(#organShadow)"
        />

        {/* Liver */}
        <ellipse
          id="organ-liver"
          cx="220"
          cy="240"
          rx="35"
          ry="25"
          fill={getOrganColor('liver', '#D2691E', '#8B4513')}
          opacity={getOrganOpacity('liver')}
          stroke={focusOrganId === 'liver' ? '#3b82f6' : '#A0522D'}
          strokeWidth={focusOrganId === 'liver' ? '3' : '1.5'}
          className={`transition-all duration-500 hover:stroke-blue-500 hover:stroke-2 cursor-pointer ${
            !accessibility.reduceMotion ? 'hover:scale-105' : ''
          }`}
          onClick={() => handleOrganClick('liver')}
          style={{ transformOrigin: '220px 240px' }}
          filter="url(#organShadow)"
        />

        {/* Kidneys */}
        <g id="organ-kidneys" onClick={() => handleOrganClick('kidneys')} className="cursor-pointer">
          <ellipse
            cx="165"
            cy="280"
            rx="10"
            ry="20"
            fill={getOrganColor('kidneys', '#8B4513', '#654321')}
            opacity={getOrganOpacity('kidneys')}
            stroke={focusOrganId === 'kidneys' ? '#3b82f6' : '#654321'}
            strokeWidth={focusOrganId === 'kidneys' ? '3' : '1.5'}
            className={`transition-all duration-500 hover:stroke-blue-500 hover:stroke-2 ${
              !accessibility.reduceMotion ? 'hover:scale-105' : ''
            }`}
            filter="url(#organShadow)"
          />
          <ellipse
            cx="235"
            cy="280"
            rx="10"
            ry="20"
            fill={getOrganColor('kidneys', '#8B4513', '#654321')}
            opacity={getOrganOpacity('kidneys')}
            stroke={focusOrganId === 'kidneys' ? '#3b82f6' : '#654321'}
            strokeWidth={focusOrganId === 'kidneys' ? '3' : '1.5'}
            className={`transition-all duration-500 hover:stroke-blue-500 hover:stroke-2 ${
              !accessibility.reduceMotion ? 'hover:scale-105' : ''
            }`}
            filter="url(#organShadow)"
          />
        </g>

        {/* Gut/Intestines */}
        <path
          id="organ-gut"
          d="M170 320 Q200 310, 230 320 Q235 340, 225 360 Q200 370, 175 360 Q165 340, 170 320 Z"
          fill={getOrganColor('gut', '#DEB887', '#CD853F')}
          opacity={getOrganOpacity('gut')}
          stroke={focusOrganId === 'gut' ? '#3b82f6' : '#CD853F'}
          strokeWidth={focusOrganId === 'gut' ? '3' : '1.5'}
          className={`transition-all duration-500 hover:stroke-blue-500 hover:stroke-2 cursor-pointer ${
            !accessibility.reduceMotion ? 'hover:scale-105' : ''
          }`}
          onClick={() => handleOrganClick('gut')}
          style={{ transformOrigin: '200px 340px' }}
          filter="url(#organShadow)"
        />

        {/* Skin representation (subtle outline) */}
        <path
          id="organ-skin"
          d="M150 145 Q150 140, 160 140 L240 140 Q250 140, 250 145 L250 400 Q250 420, 240 420 L160 420 Q150 420, 150 400 Z"
          fill="none"
          stroke={getOrganColor('skin', '#F5D5AE', '#D4A574')}
          strokeWidth={focusOrganId === 'skin' ? '4' : '2'}
          className={`transition-all duration-500 hover:stroke-4 cursor-pointer ${
            !accessibility.reduceMotion ? 'hover:opacity-80' : ''
          }`}
          onClick={() => handleOrganClick('skin')}
          opacity={getOrganOpacity('skin') * 0.6}
          strokeDasharray="5,5"
        />
      </svg>
    </div>
  );
};