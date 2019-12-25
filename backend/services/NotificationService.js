const BaseService = require('./BaseService');

class NotificationService extends BaseService {
  constructor() {
    super(NotificationService);
    this.numberOfViewers = [];
  }

  addWatcherToProduct(data) {
    const numberOfViewers = [...this.numberOfViewers];
    const findIndex = numberOfViewers.findIndex(d => d.productId === data.productId);
    if (findIndex === -1) {
      numberOfViewers.push({ views: data.views + 1, productId: data.productId });
    } else {
      numberOfViewers[findIndex] = {
        views: numberOfViewers[findIndex].views + 1,
        productId: data.productId
      };
    }
    this.numberOfViewers = [...numberOfViewers];
    return findIndex !== -1
      ? this.numberOfViewers[findIndex]
      : this.numberOfViewers[this.numberOfViewers.length - 1];
  }

  removeWatcherFromProduct(productId) {
    const numberOfViewers = [...this.numberOfViewers];
    const findIndex = numberOfViewers.findIndex(d => d.productId === productId);
    if (!productId || findIndex === -1) return this.numberOfViewers;

    numberOfViewers[findIndex] = {
      views: numberOfViewers[findIndex].views > 0 ? numberOfViewers[findIndex].views - 1 : 0,
      productId
    };

    this.numberOfViewers = [...numberOfViewers];
    return findIndex !== -1
      ? this.numberOfViewers[findIndex]
      : this.numberOfViewers[this.numberOfViewers.length - 1];
  }
}

const NotificationServiceInstance = new NotificationService();

module.exports = NotificationServiceInstance;
