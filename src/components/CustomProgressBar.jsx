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
    <div style={{ padding: '15px 20px', backgroundColor: '#2a2a2a' }}>
      
      <div 
        ref={progressRef}
        onClick={handleProgressBarClick}
        style={{
          width: '100%',
          height: '12px',
          backgroundColor: '#555',
          borderRadius: '6px',
          position: 'relative',
          cursor: 'pointer',
          overflow: 'hidden' 
        }}
      >
        
        <div 
          style={{
            height: '100%',
            backgroundColor: '#ff0000',
            width: `${progressPercentage}%`,
            transition: 'width 0.1s linear', // Suaviza el movimiento
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1
          }}
        />

        {state.tags.map((tag) => {
          const virtualStart = realToVirtualTime(tag.start, state.cuts);
          const virtualEnd = realToVirtualTime(tag.end, state.cuts);
          
          const leftPercent = (virtualStart / state.virtualDuration) * 100;
          const widthPercent = ((virtualEnd - virtualStart) / state.virtualDuration) * 100;

          const isActive = state.virtualTime >= virtualStart && state.virtualTime <= virtualEnd;

          return (
            <div 
              key={tag.id}
              title={tag.label} 
              style={{
                position: 'absolute',
                top: isActive ? '0' : '2px', 
                height: isActive ? '12px' : '8px',
                left: `${leftPercent}%`,
                width: `${widthPercent}%`,
                backgroundColor: tag.color,
                zIndex: 2, 
                opacity: 0.8,
                borderLeft: '1px solid black',
                borderRight: '1px solid black',
                transition: 'all 0.2s ease'
              }}
            />
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: '#aaa' }}>
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