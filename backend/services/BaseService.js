module.exports = class BaseService {
    constructor(ChildClass) {
        if (!ChildClass.instance) {
            ChildClass.instance = this;
        }
        return ChildClass.instance;
    }
};
