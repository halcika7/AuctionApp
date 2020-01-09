const BaseService = require('./BaseService');

class NotificationService extends BaseService {
  constructor() {
    super(NotificationService);
    this.numberOfViewers = [];
  }

  addWatcherToProduct(data) {
    const { numberOfViewers, findIndex } = this.getIndex(data.productId);

    if (findIndex === -1) {
      numberOfViewers.push({
        views: data.userId ? data.views + 1 : data.views,
        productId: data.productId,
        userIds: data.userId ? [data.userId] : []
      });
    } else {
      const userIdIndex = numberOfViewers[findIndex].userIds.findIndex(id => id === data.userId);
      if (userIdIndex === -1) {
        numberOfViewers[findIndex] = {
          views: data.userId
            ? numberOfViewers[findIndex].views + 1
            : numberOfViewers[findIndex].views,
          productId: data.productId,
          userIds: data.userId
            ? [...numberOfViewers[findIndex].userIds, data.userId]
            : numberOfViewers[findIndex].userIds
        };
      }
    }

    this.setNumberOfViewers(numberOfViewers);
    return this.returnViewers(findIndex);
  }

  removeWatcherFromProduct(productId, userId) {
    const { numberOfViewers, findIndex } = this.getIndex(productId);

    if (!productId || findIndex === -1 || !userId) return this.numberOfViewers;

    const findUserId = numberOfViewers[findIndex].userIds.find(id => id === userId);

    if (findUserId) {
      const userIds = numberOfViewers[findIndex].userIds.filter(id => id !== userId);
      numberOfViewers[findIndex] = {
        views: numberOfViewers[findIndex].views > 0 ? numberOfViewers[findIndex].views - 1 : 0,
        productId,
        userIds
      };
    }

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

  removeUserFromAllProducts(io, userId) {
    let numberOfViewers = [...this.numberOfViewers];

    numberOfViewers = numberOfViewers.map(data => {
      const userIdIndex = data.userIds.findIndex(id => id === userId);
      if (userIdIndex) {
        data.userIds = data.userIds.filter(id => id !== userId);
        data.views = data.views - 1;
      }
      return data;
    });

    this.numberOfViewers = [...numberOfViewers];

    return io.emit('afterLogoutWatchers', this.numberOfViewers);
  }
}

const NotificationServiceInstance = new NotificationService();

module.exports = NotificationServiceInstance;
