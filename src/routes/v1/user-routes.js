const express = require('express');
const { UserMiddlewares } = require('../../middlewares');
const { UserController } = require('../../controllers');
const { StatusCodes } = require('http-status-codes');

const router = express.Router();


/**
 * POST: /api/v1/users/signup
 */
router.post(
    '/signup',
    UserMiddlewares.validateSignupRequest,
    UserController.signup
);


/**
 * GET: /api/v1/users/signin
 */
router.get(
    '/signin',
    UserMiddlewares.validateSigninRequest,
    UserController.signin
);


// demo routes
router.get('/demo', UserMiddlewares.validateUser, function(req, res) {
    return res.status(StatusCodes.OK).json({
        data: 'Kitna data chahida vuruu'
    });
});

module.exports = router;