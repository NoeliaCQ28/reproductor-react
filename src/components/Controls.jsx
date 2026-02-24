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
    <div style={{ padding: '10px 0', display: 'flex', justifyContent: 'center', backgroundColor: '#2a2a2a' }}>
      <button 
        onClick={togglePlay}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontWeight: 'bold'
        }}
      >
        {state.isPlaying ? 'Pausar (Space)' : 'Reproducir (Space)'}
      </button>
      <span style={{ marginLeft: '15px', display: 'flex', alignItems: 'center', color: '#ccc', fontSize: '14px' }}>
        Usa ⬅️ y ➡️ para navegar inteligentemente
      </span>
    </div>
  );
};