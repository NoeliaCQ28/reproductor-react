import React, { useRef, useEffect, useContext } from 'react';
import { VideoContext } from '../context/VideoContext';

export const VideoPlayer = () => {
  const { state, dispatch } = useContext(VideoContext);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;
    
    if (state.isPlaying) {
      videoRef.current.play().catch(err => console.error("Autoplay bloqueado:", err));
    } else {
      videoRef.current.pause();
    }
  }, [state.isPlaying]);

  useEffect(() => {
    if (videoRef.current && state.seekTo !== null) {
      videoRef.current.currentTime = state.seekTo;
      
      dispatch({ type: 'CLEAR_SEEK' });
    }
  }, [state.seekTo, dispatch]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      dispatch({ 
        type: 'UPDATE_TIME', 
        payload: videoRef.current.currentTime 
      });
    }
  };

  if (!state.url) return <div style={{ textAlign: 'center' }}>Cargando video...</div>;

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', position: 'relative', backgroundColor: 'black' }}>
      <video
        ref={videoRef}
        src={state.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => dispatch({ type: 'TOGGLE_PLAY' })}
        style={{ width: '100%', display: 'block' }}
      />
    </div>
  );
};