import React, { createContext, useReducer, useEffect } from 'react';
import { videoReducer, initialState } from './videoReducer';
import { calculateVirtualDuration, validateSequentialTags } from '../domain/timeModel';

export const VideoContext = createContext();

const mockVideoData = {
  url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  duration: 596, 
  cuts: [
    { start: 15, end: 45 }, 
    { start: 120, end: 150 }
  ],
  tags: [
    { id: 1, label: "Introducción", start: 0, end: 60, color: "#ff6b6b" },
    { id: 2, label: "Desarrollo", start: 60, end: 180, color: "#ffd93d" },
    { id: 3, label: "Ejemplos Prácticos", start: 180, end: 320, color: "#6bcf7f" },
    { id: 4, label: "Conclusión", start: 320, end: 596, color: "#4d96ff" }
  ]
};


export const VideoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(videoReducer, initialState);

  useEffect(() => {
    const validation = validateSequentialTags(mockVideoData.tags);
    if (!validation.valid) {
      console.error('❌ Error: Los tags tienen superposiciones:', validation.errors);
    } else if (validation.errors.length > 0) {
      console.warn('⚠️ Advertencias en tags:', validation.errors);
    } else {
      console.log('✅ Tags validados correctamente - sin superposiciones');
    }

    const virtualDuration = calculateVirtualDuration(mockVideoData.duration, mockVideoData.cuts);

    dispatch({
      type: 'INIT_DATA',
      payload: {
        ...mockVideoData,
        virtualDuration: virtualDuration
      }
    });
  }, []);

  return (
    <VideoContext.Provider value={{ state, dispatch }}>
      {children}
    </VideoContext.Provider>
  );
};