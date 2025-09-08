const { RateLimiterMemory } = require('rate-limiter-flexible');

exports.guestLimiter = new RateLimiterMemory({
    points: 50,
    duration: 60 * 15,
    blockDuration: 60 * 10
})

exports.userLimiter = new RateLimiterMemory({
    points: 200,
    duration: 60 * 15,
    blockDuration: 60 * 5
})