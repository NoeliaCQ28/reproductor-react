import { realToVirtualTime, virtualToRealTime, isTimeInCut } from '../domain/timeModel';

export const initialState = {
  url: null, 
  isPlaying: false,
  realTime: 0,
  virtualTime: 0,
  duration: 0,
  virtualDuration: 0,
  cuts: [],
  tags: [],
  seekTo: null,
};

export const videoReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_DATA':
      return {
        ...state,
        url: action.payload.url, 
        duration: action.payload.duration,
        virtualDuration: action.payload.virtualDuration,
        cuts: action.payload.cuts,
        tags: action.payload.tags,
      };

    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };

    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };

    case 'UPDATE_TIME': {
      const newRealTime = action.payload;
      const cut = isTimeInCut(newRealTime, state.cuts);

      if (cut) {
        return { ...state, seekTo: cut.end };
      }

      return {
        ...state,
        realTime: newRealTime,
        virtualTime: realToVirtualTime(newRealTime, state.cuts),
        seekTo: null,
      };
    }

    case 'SEEK_VIRTUAL': {
      const targetVirtualTime = action.payload;
      const targetRealTime = virtualToRealTime(targetVirtualTime, state.cuts);
      
      return {
        ...state,
        virtualTime: targetVirtualTime,
        realTime: targetRealTime,
        seekTo: targetRealTime,
      };
    }

    case 'CLEAR_SEEK':
      return { ...state, seekTo: null };

    default:
      return state;
  }
};