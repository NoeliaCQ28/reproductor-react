import React, { useContext, useRef } from 'react';
import { VideoContext } from '../context/VideoContext';
import { realToVirtualTime } from '../domain/timeModel';

export const CustomProgressBar = () => {
  const { state, dispatch } = useContext(VideoContext);
  const progressRef = useRef(null);

  if (!state.virtualDuration) return null;

  const progressPercentage = (state.virtualTime / state.virtualDuration) * 100;

  const handleProgressBarClick = (e) => {
    if (!progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const totalWidth = rect.width;

    const percentage = clickX / totalWidth;
    
    const targetVirtualTime = percentage * state.virtualDuration;
    dispatch({ type: 'SEEK_VIRTUAL', payload: targetVirtualTime });
  };

  return (
    <div style={{ padding: '15px 20px', backgroundColor: '#181818' }}>
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        marginBottom: '8px',
        height: '24px'
      }}>
        {state.tags.map((tag, index) => {
          const virtualStart = realToVirtualTime(tag.start, state.cuts);
          const leftPercent = (virtualStart / state.virtualDuration) * 100;
          
          if (virtualStart === 0) return null;
          
          return (
            <div
              key={`marker-${tag.id}`}
              style={{
                position: 'absolute',
                left: `${leftPercent}%`,
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer'
              }}
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: 'SEEK_VIRTUAL', payload: virtualStart });
              }}
              title={`Ir a: ${tag.label}`}
            >
              <div style={{
                width: '8px',
                height: '8px',
                backgroundColor: tag.color,
                borderRadius: '50%',
                border: '2px solid #fff',
                marginBottom: '2px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
              }} />
              <div style={{
                width: '2px',
                height: '8px',
                backgroundColor: tag.color,
                opacity: 0.6
              }} />
            </div>
          );
        })}
      </div>
      
      {/* Barra de progreso principal */}
      <div 
        ref={progressRef}
        onClick={handleProgressBarClick}
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: '#3f3f3f',
          borderRadius: '3px',
          position: 'relative',
          cursor: 'pointer',
          overflow: 'visible'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.height = '8px';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.height = '6px';
        }}
      >
        {/* Secciones de colores de fondo - estilo YouTube (NO se superponen) */}
        {state.tags.map((tag, index) => {
          const virtualStart = realToVirtualTime(tag.start, state.cuts);
          const virtualEnd = realToVirtualTime(tag.end, state.cuts);
          
          const leftPercent = (virtualStart / state.virtualDuration) * 100;
          const widthPercent = ((virtualEnd - virtualStart) / state.virtualDuration) * 100;

          const isActive = state.virtualTime >= virtualStart && state.virtualTime < virtualEnd;

          return (
            <div 
              key={`section-${tag.id}`}
              title={tag.label}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${leftPercent}%`,
                width: `${widthPercent}%`,
                backgroundColor: tag.color,
                opacity: isActive ? 0.5 : 0.25,
                pointerEvents: 'none',
                borderRight: index < state.tags.length - 1 ? '2px solid #000' : 'none',
                transition: 'opacity 0.2s ease'
              }}
            />
          );
        })}
        
        {/* Barra de progreso roja */}
        <div 
          style={{
            height: '100%',
            backgroundColor: '#ff0000',
            width: `${progressPercentage}%`,
            transition: 'width 0.1s linear',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            borderRadius: '3px'
          }}
        />

        {/* Indicador circular en la posición actual */}
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: `${progressPercentage}%`,
            transform: 'translate(-50%, -50%)',
            width: '14px',
            height: '14px',
            backgroundColor: '#ff0000',
            borderRadius: '50%',
            border: '2px solid #fff',
            zIndex: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
            opacity: state.isPlaying ? 1 : 0.8
          }}
        />
      </div>

      {/* Información de tiempo */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '10px', 
        fontSize: '12px', 
        color: '#aaa',
        fontWeight: '500'
      }}>
        <span>{formatTime(state.virtualTime)}</span>
        <span>{formatTime(state.virtualDuration)}</span>
      </div>

    </div>
  );
};

const formatTime = (seconds) => {
  if (isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};