const BaseService = require('./BaseService');

class NotificationService extends BaseService {
  constructor() {
    super(NotificationService);
    this.numberOfViewers = [];
  }

  addWatcherToProduct(data) {
    const { numberOfViewers, findIndex } = this.getIndex(data.productId);

    if (findIndex === -1) {
      numberOfViewers.push({ views: data.views + 1, productId: data.productId });
    } else {
      numberOfViewers[findIndex] = {
        views: numberOfViewers[findIndex].views + 1,
        productId: data.productId
      };
    }

    this.setNumberOfViewers(numberOfViewers);
    return this.returnViewers(findIndex);
  }

  removeWatcherFromProduct(productId) {
    const { numberOfViewers, findIndex } = this.getIndex(productId);
    
    if (!productId || findIndex === -1) return this.numberOfViewers;

    numberOfViewers[findIndex] = {
      views: numberOfViewers[findIndex].views > 0 ? numberOfViewers[findIndex].views - 1 : 0,
      productId
    };

    this.setNumberOfViewers(numberOfViewers);
    return this.returnViewers(findIndex);
  }

  getIndex(productId) {
    const numberOfViewers = [...this.numberOfViewers];
    const findIndex = numberOfViewers.findIndex(d => d.productId === productId);
    return { numberOfViewers, findIndex };
  }

  setNumberOfViewers(newNumberOfViewers) {
    this.numberOfViewers = [...newNumberOfViewers];
  }

  returnViewers(findIndex) {
    return findIndex !== -1
    ? this.numberOfViewers[findIndex]
    : this.numberOfViewers[this.numberOfViewers.length - 1];
  }
}

const NotificationServiceInstance = new NotificationService();

module.exports = NotificationServiceInstance;
