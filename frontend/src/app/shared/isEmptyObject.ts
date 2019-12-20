export const isEmptyObject = (obj: any): boolean => {
  for (let property of Object.keys(obj)) {
    if (obj[property] == null) {
      delete obj[property];
    }
  }

  return Object.keys(obj).length > 0 ? false : true;
}
