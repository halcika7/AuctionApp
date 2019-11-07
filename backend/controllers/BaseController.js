class BaseController {
    constructor(ChildClass) {
        if (!!ChildClass.instance) {
            return ChildClass.instance;
        }

        ChildClass.instance = this;

        return this;
    }

    sendResponseWithMessage(res, status, resObj, failedMessage) {
        if (failedMessage) {
            return res.status(status).json({ failedMessage });
        }

        return res.status(status).json(resObj);
    }

    sendResponse(res, status, resObj) {
        return res.status(status).json(resObj);
    }
}

module.exports = BaseController;
