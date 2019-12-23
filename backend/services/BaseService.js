module.exports = class BaseService {
  constructor(ChildClass) {

    if (!ChildClass.instance) {
      ChildClass.instance = this;
    }
    
    return ChildClass.instance;
  }

  returnGenericFailed() {
    return {
      status: 403,
      failedMessage: 'Something happened. We were unable to perform request.'
    };
  }

  returnResponse(status, objectResp) {
    return {
      status,
      ...objectResp
    };
  }
};
