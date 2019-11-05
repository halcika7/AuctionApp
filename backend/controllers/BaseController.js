module.exports = class BaseController {
    constructor(ExtendedClass) {
        if (!ExtendedClass.instance) {
            ExtendedClass.instance = this;
        }
        return ExtendedClass.instance;
    }
};
