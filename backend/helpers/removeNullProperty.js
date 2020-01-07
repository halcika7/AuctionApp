exports.removeNullProperty = ({ ...object }) => {
  for (let property of Object.keys(object)) {
    if (object[property] == null) delete object[property];
  }
  return object;
};

exports.removeNullFromUserInfo = (userInfo, currentUser) => {
  userInfo.dateOfBirth = new Date(userInfo.dateOfBirth);
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

exports.removeNullFromUserCardInfo = (currentCardInfo, cardInfo) => {
  cardInfo = this.removeNullProperty({
    name: currentCardInfo.name != cardInfo.name ? cardInfo.name : null,
    number: currentCardInfo.number != cardInfo.number ? cardInfo.number : null,
    cvc: currentCardInfo.cvc != cardInfo.cvc ? cardInfo.cvc : null,
    exp_year: currentCardInfo.exp_year != cardInfo.exp_year ? cardInfo.exp_year : null,
    exp_month: currentCardInfo.exp_month != cardInfo.exp_month ? cardInfo.exp_month : null,
    accountId: currentCardInfo.accountId != cardInfo.accountId ? cardInfo.accountId : null,
    customerId: currentCardInfo.customerId != cardInfo.customerId ? cardInfo.customerId : null,
    cardId: currentCardInfo.cardId != cardInfo.cardId ? cardInfo.cardId : null,
    cardFingerprint:
      currentCardInfo.cardFingerprint != cardInfo.cardFingerprint ? cardInfo.cardFingerprint : null
  });

  return cardInfo;
};
