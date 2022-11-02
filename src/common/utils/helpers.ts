export const pick = (sourceObject, paths: string[]) => {
  return Object.keys(sourceObject).reduce((obj, key) => {
    if (paths.includes(key)) obj[key] = sourceObject[key];
    return obj;
  }, {});
};
