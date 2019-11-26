exports.removeNullProperty = ({ ...object }) => {
  for (let property of Object.keys(object)) {
    if (object[property] == null) {
      delete object[property];
    }
  }
  return object;
};

exports.removeNestedNull = (object) => {
  console.log('TCL: exports.removeNestedNull -> object', object)
//   for (let property of Object.keys(object)) {
//     if (Object.keys(object[property]).length > 0) {
//       for (let prop of Object.keys(object[property])) {
//         if (object[property][prop] == null) {
//           delete object[property][prop];
//         }
//       }
//     }
//   }
  return object;
};
