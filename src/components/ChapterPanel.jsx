import React, { useContext } from 'react';
import { VideoContext } from '../context/VideoContext';
import { realToVirtualTime } from '../domain/timeModel';

export const ChapterPanel = () => {
  const { state, dispatch } = useContext(VideoContext);

  const handleChapterClick = (tag) => {
    const virtualStart = realToVirtualTime(tag.start, state.cuts);
    dispatch({ type: 'SEEK_VIRTUAL', payload: virtualStart });
    dispatch({ type: 'SET_PLAYING', payload: true });
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getCurrentChapter = () => {
    return state.tags.find(tag => 
      state.realTime >= tag.start && state.realTime <= tag.end
    );
  };

  const currentChapter = getCurrentChapter();

  return (
    <div style={{
      width: '350px',
      backgroundColor: '#0f0f0f',
      borderLeft: '1px solid #333',
      overflowY: 'auto',
      maxHeight: '600px'
    }}>
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #333',
        backgroundColor: '#181818'
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '16px', 
          fontWeight: '600',
          color: '#fff'
        }}>
          Secciones del Video
        </h3>
        <p style={{
          margin: '4px 0 0 0',
          fontSize: '12px',
          color: '#aaa'
        }}>
          {state.tags.length} {state.tags.length === 1 ? 'sección' : 'secciones'}
        </p>
      </div>

      <div style={{ padding: '8px 0' }}>
        {state.tags.map((tag, index) => {
          const isActive = currentChapter?.id === tag.id;
          const virtualStart = realToVirtualTime(tag.start, state.cuts);

          return (
            <div
              key={tag.id}
              onClick={() => handleChapterClick(tag)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                backgroundColor: isActive ? '#272727' : 'transparent',
                borderLeft: isActive ? `4px solid ${tag.color}` : '4px solid transparent',
                transition: 'all 0.2s ease',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#1f1f1f';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div style={{
                minWidth: '60px',
                height: '36px',
                backgroundColor: '#000',
                border: `2px solid ${tag.color}`,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: '600',
                color: tag.color,
                position: 'relative'
              }}>
                {formatTime(virtualStart)}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#ff0000',
                    borderRadius: '50%',
                    border: '2px solid #000'
                  }} />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? '#fff' : '#e0e0e0',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: tag.color,
                    borderRadius: '50%',
                    display: 'inline-block'
                  }} />
                  {tag.label}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#888'
                }}>
                  Duración: {formatTime(tag.end - tag.start)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
