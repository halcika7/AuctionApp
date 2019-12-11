exports.removeNullProperty = ({ ...object }) => {
  for (let property of Object.keys(object)) {
    if (object[property] == null) {
      delete object[property];
    }
  }
  return object;
};
