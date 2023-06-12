const express = require('express');
const { UserMiddlewares } = require('../../middlewares');
const { UserController } = require('../../controllers');

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

module.exports = router;