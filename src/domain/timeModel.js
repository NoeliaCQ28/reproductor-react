export const calculateVirtualDuration = (realDuration, cuts = []) => {
  const totalTrashTime = cuts.reduce((acumulador, cut) => {
    return acumulador + (cut.end - cut.start);
  }, 0);
  
  return realDuration - totalTrashTime;
};

export const realToVirtualTime = (realTime, cuts = []) => {
  let virtualTime = realTime;
  
  for (const cut of cuts) {
    if (realTime > cut.end) {
      virtualTime -= (cut.end - cut.start);
    } else if (realTime > cut.start && realTime <= cut.end) {
      virtualTime -= (realTime - cut.start);
    }
  }
  
  return virtualTime;
};

export const virtualToRealTime = (virtualTime, cuts = []) => {
  let realTime = virtualTime;
  
  for (const cut of cuts) {
    if (cut.start <= realTime) {
      realTime += (cut.end - cut.start);
    } else {
      break; 
    }
  }
  
  return realTime;
};

export const isTimeInCut = (realTime, cuts = []) => {
  return cuts.find(cut => realTime >= cut.start && realTime < cut.end);
};