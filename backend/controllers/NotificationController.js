const BaseController = require('./BaseController');
const NotificationService = require('../services/NotificationService');

class NotificationController extends BaseController {
  constructor() {
    super(NotificationController);
  }

  addWatcher(io, data) {
    const numberOfViewers = NotificationService.addWatcherToProduct(data);
    return io.emit('watchers', numberOfViewers);
  }

  removeWatcher(io, productId) {
    const numberOfViewers = NotificationService.removeWatcherFromProduct(productId);
    return io.emit('watchers', numberOfViewers);
  }
}

const NotificationControllerInstance = new NotificationController();

module.exports = NotificationControllerInstance;
