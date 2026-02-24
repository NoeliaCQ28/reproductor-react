import React, { createContext, useReducer, useEffect } from 'react';
import { videoReducer, initialState } from './videoReducer';
import { calculateVirtualDuration } from '../domain/timeModel';

export const VideoContext = createContext();

const mockVideoData = {
  url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  duration: 596, 
  cuts: [
    { start: 15, end: 45 }, 
    { start: 120, end: 150 }
  ],
  tags: [
    { id: 1, label: "Líder", start: 10, end: 50, color: "red" },
    { id: 2, label: "Trabajo en equipo", start: 60, end: 100, color: "yellow" },
    { id: 3, label: "Buena comunicación", start: 90, end: 130, color: "green" } 
  ]
};


export const VideoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(videoReducer, initialState);

  useEffect(() => {
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