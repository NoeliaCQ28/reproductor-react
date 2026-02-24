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

export const validateSequentialTags = (tags = []) => {
  if (!tags || tags.length === 0) return { valid: true, errors: [] };
  
  const sortedTags = [...tags].sort((a, b) => a.start - b.start);
  const errors = [];
  
  for (let i = 0; i < sortedTags.length - 1; i++) {
    const current = sortedTags[i];
    const next = sortedTags[i + 1];
    
    if (current.end > next.start) {
      errors.push({
        message: `Superposición detectada: "${current.label}" (${current.start}-${current.end}) se superpone con "${next.label}" (${next.start}-${next.end})`,
        tags: [current, next]
      });
    }
    
    if (current.end < next.start) {
      errors.push({
        message: `Gap detectado: Hay un espacio sin cubrir entre "${current.label}" (termina en ${current.end}) y "${next.label}" (empieza en ${next.start})`,
        tags: [current, next],
        type: 'warning'
      });
    }
  }
  
  return {
    valid: errors.filter(e => e.type !== 'warning').length === 0,
    errors
  };
};