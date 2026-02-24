import React from 'react';
import { VideoProvider } from './context/VideoContext';
import { VideoPlayer } from './components/VideoPlayer';
import { CustomProgressBar } from './components/CustomProgressBar'; 
import { Controls } from './components/Controls';
import { ChapterPanel } from './components/ChapterPanel';

function App() {
  return (
    <VideoProvider>
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0f0f0f', 
        color: '#ffffff', 
        fontFamily: 'system-ui, -apple-system, sans-serif', 
        padding: '20px' 
      }}>
        {/* Header */}
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto 20px auto',
          paddingBottom: '20px',
          borderBottom: '1px solid #333'
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '24px', 
            fontWeight: '600', 
            letterSpacing: '0.5px' 
          }}>
            Reproductor de Video Avanzado
          </h1>
          <p style={{
            margin: '8px 0 0 0',
            fontSize: '14px',
            color: '#aaa'
          }}>
            Con navegación inteligente y secciones interactivas
          </p>
        </div>
        
        {/* Layout principal estilo YouTube */}
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto',
          display: 'flex',
          gap: '24px',
          alignItems: 'flex-start'
        }}>
          {/* Columna principal del reproductor */}
          <div style={{ 
            flex: 1,
            minWidth: 0
          }}>
            <div style={{ 
              backgroundColor: '#000', 
              borderRadius: '12px', 
              overflow: 'hidden', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.6)', 
              border: '1px solid #333' 
            }}>
              <VideoPlayer />
              
              <CustomProgressBar />
              
              <Controls />
            </div>
          </div>
          
          {/* Panel lateral de capítulos */}
          <ChapterPanel />
        </div>
        
      </div>
    </VideoProvider>
  );
}

export default App;