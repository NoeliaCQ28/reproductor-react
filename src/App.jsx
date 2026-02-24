import React from 'react';
import { VideoProvider } from './context/VideoContext';
import { VideoPlayer } from './components/VideoPlayer';

function App() {
  return (
    <VideoProvider>
      <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#1e1e1e', color: 'white', minHeight: '100vh' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Reproductor de Video Avanzado</h2>
        
        <VideoPlayer />
        
      </div>
    </VideoProvider>
  );
}

export default App;