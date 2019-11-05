module.exports = class BaseService {
    constructor(ExtendedClass) {
        if (!ExtendedClass.instance) {
            ExtendedClass.instance = this;
        }
        return ExtendedClass.instance;
    }
};
