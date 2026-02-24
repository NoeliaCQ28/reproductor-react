import React, { useContext, useEffect, useCallback } from 'react';
import { VideoContext } from '../context/VideoContext';
import { isTimeInCut, realToVirtualTime } from '../domain/timeModel';

export const Controls = () => {
  const { state, dispatch } = useContext(VideoContext);

  const togglePlay = useCallback(() => {
    dispatch({ type: 'TOGGLE_PLAY' });
  }, [dispatch]);

  // Lógica de "Navegación Inteligente"
  const getValidPointsOfInterest = useCallback(() => {
    const points = new Set([0, state.duration]);
    
    state.cuts.forEach(cut => {
      points.add(cut.start);
      points.add(cut.end);
    });
    
    state.tags.forEach(tag => {
      points.add(tag.start);
      points.add(tag.end);
    });

    return Array.from(points)
      .sort((a, b) => a - b)
      .filter(point => {
        return !isTimeInCut(point, state.cuts);
      });
  }, [state.duration, state.cuts, state.tags]);

  // Manejador de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['Space', 'ArrowRight', 'ArrowLeft'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.code === 'Space') {
        togglePlay();
      } 
      else if (e.code === 'ArrowRight') {
        const points = getValidPointsOfInterest();
        const nextPoint = points.find(p => p > state.realTime + 0.5);
        
        if (nextPoint !== undefined) {
          const virtualTarget = realToVirtualTime(nextPoint, state.cuts);
          dispatch({ type: 'SEEK_VIRTUAL', payload: virtualTarget });
        }
      } 
      else if (e.code === 'ArrowLeft') {
        const points = getValidPointsOfInterest();
        const prevPoint = [...points].reverse().find(p => p < state.realTime - 0.5);
        
        if (prevPoint !== undefined) {
          const virtualTarget = realToVirtualTime(prevPoint, state.cuts);
          dispatch({ type: 'SEEK_VIRTUAL', payload: virtualTarget });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.realTime, state.cuts, togglePlay, getValidPointsOfInterest, dispatch]);

  return (
    <div style={{ 
      padding: '16px 20px', 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#181818',
      borderTop: '1px solid #333'
    }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button 
          onClick={togglePlay}
          style={{
            padding: '10px 24px',
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: state.isPlaying ? '#ff0000' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
          }}
        >
          {state.isPlaying ? '⏸ Pausar' : '▶ Reproducir'}
        </button>
        
        <div style={{
          padding: '8px 16px',
          backgroundColor: '#272727',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#aaa',
          border: '1px solid #3f3f3f'
        }}>
          <span style={{ marginRight: '8px' }}>⌨️</span>
          <span style={{ fontWeight: '500' }}>Espacio</span>
          <span style={{ margin: '0 8px', color: '#555' }}>|</span>
          <span style={{ fontWeight: '500' }}>⬅️ ➡️</span>
          <span style={{ marginLeft: '4px' }}>Navegar</span>
        </div>
      </div>
    </div>
  );
};