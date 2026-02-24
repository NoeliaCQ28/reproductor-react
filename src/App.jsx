import React from 'react';
import { VideoProvider } from './context/VideoContext';
import { VideoPlayer } from './components/VideoPlayer';
import { Controls } from './components/Controls';

function App() {
  return (
    <VideoProvider>
      {/* Contenedor principal a pantalla completa */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        backgroundColor: '#0f0f0f',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        margin: 0,
        padding: '20px'
      }}>
        
        <h2 style={{ marginBottom: '30px', fontWeight: '600', letterSpacing: '0.5px' }}>
          Reproductor de Video Avanzado
        </h2>
        
        {/* Contenedor del reproductor */}
        <div style={{ 
          width: '100%', 
          maxWidth: '900px', // Ancho máximo para que se vea bien en PC
          backgroundColor: '#000', 
          borderRadius: '12px', 
          overflow: 'hidden', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
          border: '1px solid #333'
        }}>
          <VideoPlayer />
          
          {/* Aquí insertaremos la CustomProgressBar en el siguiente paso */}
          
          <Controls />
        </div>
        
      </div>
    </VideoProvider>
  );
}

export default App;