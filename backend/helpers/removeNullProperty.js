exports.removeNullProperty = ({ ...object }) => {
  for (let property of Object.keys(object)) {
    if (object[property] == null) {
      delete object[property];
    }
  }
  return object;
};

exports.removeNullFromUserInfo = (userInfo, currentUser) => {
  userInfo.dateOfBirth = new Date(userInfo.dateOfBirth);
  userInfo.dateOfBirth.setTime(userInfo.dateOfBirth.getTime() + 60 * 60 * 1000);
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

