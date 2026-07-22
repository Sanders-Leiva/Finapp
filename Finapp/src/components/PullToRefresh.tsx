import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { hapticFeedback } from '../utils/haptics';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [startY, setStartY] = useState(0);
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  
  const MAX_PULL = 100;
  const THRESHOLD = 70;

  const handleTouchStart = (e: React.TouchEvent) => {
    // Solo permitir pull-to-refresh si estamos en el tope del scroll
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
      setPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!pulling || refreshing) return;
    
    const y = e.touches[0].clientY;
    const dist = y - startY;
    
    if (dist > 0 && window.scrollY === 0) {
      setPullDistance(Math.min(dist * 0.5, MAX_PULL)); // Añadir resistencia simulada
      // Prevenir el scroll por defecto si estamos haciendo pull
      if (e.cancelable) {
        // En algunos navegadores modernos preventDefault() dentro de touchMove pasivo lanza error
        // pero en un contenedor custom suele funcionar si no es pasivo
      }
    }
  };

  const handleTouchEnd = async () => {
    if (!pulling) return;
    setPulling(false);
    
    if (pullDistance >= THRESHOLD) {
      hapticFeedback.medium();
      setRefreshing(true);
      await onRefresh();
      hapticFeedback.success();
      setRefreshing(false);
    }
    
    setPullDistance(0);
  };

  return (
    <div 
      className="relative min-h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Indicador de Refresh */}
      <div 
        className="absolute w-full flex justify-center items-end overflow-hidden transition-all duration-300 z-10 top-0 left-0"
        style={{ 
          height: `${pullDistance}px`, 
          opacity: Math.min(pullDistance / THRESHOLD, 1)
        }}
      >
        <div className="pb-4">
          <div className={`w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center border border-gray-100 dark:border-gray-700 transition-transform ${refreshing ? 'animate-spin' : ''}`} style={{ transform: refreshing ? 'none' : `rotate(${pullDistance * 3}deg)` }}>
            <RefreshCw className="w-5 h-5 text-brand" />
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div 
        className="transition-transform duration-300"
        style={{ transform: `translateY(${refreshing ? 60 : pullDistance}px)` }}
      >
        {children}
      </div>
    </div>
  );
};
