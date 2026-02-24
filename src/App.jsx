import React from 'react';
import { VideoProvider } from './context/VideoContext';

function App() {
  return (
    <VideoProvider>
      <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#1e1e1e', color: 'white', minHeight: '100vh' }}>
        <h2>Reproductor de Video Avanzado</h2>
      </div>
    </VideoProvider>
  );
}

export default App;