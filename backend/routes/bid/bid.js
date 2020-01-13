const router = require('express').Router();
const BidController = require('../../controllers/BidController');
const authMiddleware = require('../../middlewares/authMiddleware');

// Bid Routes
module.exports = io => {
    io.on('connection', socket => {
        router.post('/make', authMiddleware, (req, res) => BidController.makeBid(req, res, io));
    });

    return router;
}

