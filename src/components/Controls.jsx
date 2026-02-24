import React, { useContext, useEffect, useCallback } from 'react';
import { VideoContext } from '../context/VideoContext';
import { realToVirtualTime } from '../domain/timeModel';

export const Controls = () => {
  const { state, dispatch } = useContext(VideoContext);

  const togglePlay = useCallback(() => {
    dispatch({ type: 'TOGGLE_PLAY' });
  }, [dispatch]);

  // Adelantar/Retroceder N segundos en el tiempo virtual
  const skipSeconds = useCallback((seconds) => {
    const newVirtualTime = Math.max(0, Math.min(state.virtualTime + seconds, state.virtualDuration));
    dispatch({ type: 'SEEK_VIRTUAL', payload: newVirtualTime });
  }, [state.virtualTime, state.virtualDuration, dispatch]);

  // Saltar a la siguiente sección (tag)
  const goToNextSection = useCallback(() => {
    if (!state.tags || state.tags.length === 0) return;
    
    const nextTag = state.tags.find(tag => tag.start > state.realTime);
    if (nextTag) {
      const virtualStart = realToVirtualTime(nextTag.start, state.cuts);
      dispatch({ type: 'SEEK_VIRTUAL', payload: virtualStart });
    }
  }, [state.realTime, state.tags, state.cuts, dispatch]);

  // Saltar a la sección anterior (tag)
  const goToPreviousSection = useCallback(() => {
    if (!state.tags || state.tags.length === 0) return;
    
    // Ordenar tags por tiempo de inicio
    const sortedTags = [...state.tags].sort((a, b) => a.start - b.start);
    
    // Encontrar la sección actual
    const currentTagIndex = sortedTags.findIndex(tag => 
      state.realTime >= tag.start && state.realTime < tag.end
    );
    
    let targetTag;
    
    if (currentTagIndex > 0) {
      // Si estamos en una sección, ir a la anterior
      targetTag = sortedTags[currentTagIndex - 1];
    } else if (currentTagIndex === -1) {
      // Si no estamos en ninguna sección, ir a la última que haya pasado
      const previousTags = sortedTags.filter(tag => tag.end <= state.realTime);
      targetTag = previousTags[previousTags.length - 1];
    }
    // Si currentTagIndex === 0, estamos en la primera sección, no hacemos nada
    
    if (targetTag) {
      const virtualStart = realToVirtualTime(targetTag.start, state.cuts);
      dispatch({ type: 'SEEK_VIRTUAL', payload: virtualStart });
    }
  }, [state.realTime, state.tags, state.cuts, dispatch]);

  // Manejador de teclado mejorado
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevenir comportamiento por defecto de teclas multimedia
      if (['Space', 'ArrowRight', 'ArrowLeft', 'KeyJ', 'KeyL', 'KeyN', 'KeyM'].includes(e.code)) {
        e.preventDefault();
      }

      // ESPACIO: Play/Pause
      if (e.code === 'Space') {
        togglePlay();
      }
      
      // FLECHAS + SHIFT: Navegar entre secciones
      else if (e.code === 'ArrowRight' && e.shiftKey) {
        goToNextSection();
      }
      else if (e.code === 'ArrowLeft' && e.shiftKey) {
        goToPreviousSection();
      }
      
      // FLECHAS SOLAS: Adelantar/Retroceder 15 segundos
      else if (e.code === 'ArrowRight' && !e.shiftKey) {
        skipSeconds(15);
      }
      else if (e.code === 'ArrowLeft' && !e.shiftKey) {
        skipSeconds(-15);
      }
      
      // J/L: Adelantar/Retroceder 10 segundos (alternativa)
      else if (e.code === 'KeyL') {
        skipSeconds(10);
      }
      else if (e.code === 'KeyJ') {
        skipSeconds(-10);
      }
      
      // N/M: Navegar entre secciones (alternativa)
      else if (e.code === 'KeyM' || e.code === 'Period') {
        goToNextSection();
      }
      else if (e.code === 'KeyN' || e.code === 'Comma') {
        goToPreviousSection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, skipSeconds, goToNextSection, goToPreviousSection]);

  return (
    <div style={{ 
      padding: '12px 20px', 
      display: 'flex', 
      flexDirection: 'column',
      gap: '12px',
      backgroundColor: '#181818',
      borderTop: '1px solid #333'
    }}>
      {/* Fila de botones principales */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center' }}>
        {/* Sección anterior */}
        <button 
          onClick={goToPreviousSection}
          title="Sección anterior (Shift+←)"
          style={{
            padding: '8px 12px',
            fontSize: '18px',
            cursor: 'pointer',
            backgroundColor: '#272727',
            color: '#fbbf24',
            border: '1px solid #3f3f3f',
            borderRadius: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#3f3f3f';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#272727';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ⏮
        </button>

        {/* Retroceder 15s */}
        <button 
          onClick={() => skipSeconds(-15)}
          title="Retroceder 15s (←)"
          style={{
            padding: '8px 12px',
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: '#272727',
            color: '#4ade80',
            border: '1px solid #3f3f3f',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            fontWeight: '600'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#3f3f3f';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#272727';
          }}
        >
          -15s
        </button>

        {/* Play/Pause */}
        <button 
          onClick={togglePlay}
          style={{
            padding: '12px 28px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: state.isPlaying ? '#ff0000' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '24px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
          }}
        >
          {state.isPlaying ? '⏸ Pausar' : '▶ Reproducir'}
        </button>

        {/* Adelantar 15s */}
        <button 
          onClick={() => skipSeconds(15)}
          title="Adelantar 15s (→)"
          style={{
            padding: '8px 12px',
            fontSize: '14px',
            cursor: 'pointer',
            backgroundColor: '#272727',
            color: '#4ade80',
            border: '1px solid #3f3f3f',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            fontWeight: '600'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#3f3f3f';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#272727';
          }}
        >
          +15s
        </button>

        {/* Siguiente sección */}
        <button 
          onClick={goToNextSection}
          title="Siguiente sección (Shift+→)"
          style={{
            padding: '8px 12px',
            fontSize: '18px',
            cursor: 'pointer',
            backgroundColor: '#272727',
            color: '#fbbf24',
            border: '1px solid #3f3f3f',
            borderRadius: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#3f3f3f';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#272727';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ⏭
        </button>
      </div>
      
      {/* Fila de atajos de teclado */}
      <div style={{
        display: 'flex',
        gap: '8px',
        fontSize: '10px',
        color: '#888',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{
          padding: '4px 10px',
          backgroundColor: '#1f1f1f',
          borderRadius: '4px',
          border: '1px solid #2a2a2a'
        }}>
          <span style={{ fontWeight: '600', color: '#3b82f6' }}>Espacio</span>
          <span style={{ marginLeft: '3px' }}>Play/Pausa</span>
        </div>
        
        <div style={{
          padding: '4px 10px',
          backgroundColor: '#1f1f1f',
          borderRadius: '4px',
          border: '1px solid #2a2a2a'
        }}>
          <span style={{ fontWeight: '600', color: '#4ade80' }}>⬅ ➡</span>
          <span style={{ marginLeft: '3px' }}>±15s</span>
        </div>
        
        <div style={{
          padding: '4px 10px',
          backgroundColor: '#1f1f1f',
          borderRadius: '4px',
          border: '1px solid #2a2a2a'
        }}>
          <span style={{ fontWeight: '600', color: '#fbbf24' }}>Shift+⬅➡</span>
          <span style={{ marginLeft: '3px' }}>Secciones</span>
        </div>
        
        <div style={{
          padding: '4px 10px',
          backgroundColor: '#1f1f1f',
          borderRadius: '4px',
          border: '1px solid #2a2a2a'
        }}>
          <span style={{ fontWeight: '600', color: '#a78bfa' }}>J/L</span>
          <span style={{ marginLeft: '3px' }}>±10s</span>
        </div>

        <div style={{
          padding: '4px 10px',
          backgroundColor: '#1f1f1f',
          borderRadius: '4px',
          border: '1px solid #2a2a2a'
        }}>
          <span style={{ fontWeight: '600', color: '#f472b6' }}>N/M</span>
          <span style={{ marginLeft: '3px' }}>Secciones</span>
        </div>
      </div>
    </div>
  );
};