export const partialFormValidity = ([...obj]) => {
  return obj.find(property => property.status == "INVALID") ? false : true;
};
