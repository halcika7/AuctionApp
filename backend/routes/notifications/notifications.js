const router = require('express').Router();
const NotificationController = require('../../controllers/NotificationController');

// Product Routes
module.exports = io => {
  io.on('connection', socket => {
    socket.on('watch', data => {
      NotificationController.addWatcher(io, data);
    });

    socket.on('removeWatcher', data => {
      NotificationController.removeWatcher(io, data);
    });
  });

  return router;
};
