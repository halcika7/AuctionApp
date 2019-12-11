export const emptyObject = (obj: any) => {
  if(!obj) return true;
  return Object.keys(obj).length > 0 ? false : true;
};
