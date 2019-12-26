exports.removeNullProperty = ({ ...object }) => {
  for (let property of Object.keys(object)) {
    if (object[property] == null) delete object[property];
  }
  return object;
};

exports.removeNullFromUserInfo = (userInfo, currentUser) => {
  userInfo.dateOfBirth = new Date(userInfo.dateOfBirth);
  userInfo.dateOfBirth.setHours(1, 0, 0, 0);
  userInfo = this.removeNullProperty({
    photo: userInfo.photo != currentUser.photo ? userInfo.photo : null,
    gender: userInfo.gender != currentUser.gender ? userInfo.gender : null,
    firstName: userInfo.firstName != currentUser.firstName ? userInfo.firstName : null,
    lastName: userInfo.lastName != currentUser.lastName ? userInfo.lastName : null,
    email: userInfo.email != currentUser.email ? userInfo.email : null,
    dateOfBirth:
      userInfo.dateOfBirth.getTime() != currentUser.dateOfBirth.getTime()
        ? userInfo.dateOfBirth
        : null,
    phoneNumber: userInfo.phoneNumber != currentUser.phoneNumber ? userInfo.phoneNumber : null
  });

  return userInfo;
};

exports.removeNullFromOptionalUserInfo = (optionalInfo, currentOptionalInfo) => {
  optionalInfo = this.removeNullProperty({
    street: optionalInfo.street != currentOptionalInfo.street ? optionalInfo.street : null,
    city: optionalInfo.city != currentOptionalInfo.city ? optionalInfo.city : null,
    country: optionalInfo.country != currentOptionalInfo.country ? optionalInfo.country : null,
    state: optionalInfo.state != currentOptionalInfo.state ? optionalInfo.state : null,
    zip: optionalInfo.zip != currentOptionalInfo.zip ? optionalInfo.zip : null
  });

  return optionalInfo;
};
