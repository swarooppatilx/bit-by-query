const { guestLimiter, userLimiter } = require('./apiLimiter');
const { authLimiter } = require('./authLimiter');


exports.authRateLimiter = (req, res, next) => {
    authLimiter.consume(req.ip).then(() => next()).catch(() => {
        res.status(429).json({
            message: "Too many login attempts. Please try again after 30 minutes."
        })
    })
}


exports.apiRateLimiter = (req, res, next) => {
    if (req.user && req.user.id) {
        userLimiter.consume(req.user.id).then(() => next()).catch(() => {
            res.status(429).json({
                message: "Too many requests (user). Try again after 5 minutes."
            })
        })
    } else {
        guestLimiter.consume(req.ip).then(() => next()).catch(() => {
            res.status(429).json({
                message: "Too many requests (guest). Try again after 10 minutes."
            })
        })
    }
}