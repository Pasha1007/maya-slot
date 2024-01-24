type OriginalObjectType = Record<string, number[]>;

export const divideObject = (obj: OriginalObjectType, numParts: number): OriginalObjectType[] => {
  const keys = Object.keys(obj);
  const parts: OriginalObjectType[] = [];
  const keysPerPart = Math.ceil(keys.length / numParts);

  for (let i = 0; i < numParts; i++) {
    const startIdx = i * keysPerPart;
    const endIdx = startIdx + keysPerPart;
    const partKeys = keys.slice(startIdx, endIdx);

    const part: OriginalObjectType = {};
    for (const key of partKeys) {
      part[key] = obj[key];
    }

    parts.push(part);
  }

  return parts;
};
