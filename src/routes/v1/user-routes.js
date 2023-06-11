const express = require('express');
const { UserMiddlewares } = require('../../middlewares');
const { UserController } = require('../../controllers');

const router = express.Router();


/**
 * POST: /api/v1/users/signup
 */
router.post(
    '/signup', 
    UserMiddlewares.validateCreateUserRequest, 
    UserController.createUser
);

module.exports = router;