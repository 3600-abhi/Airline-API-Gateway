const express = require('express');
const { StatusCodes } = require('http-status-codes');
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


/** 
 * PATCH: /api/v1/users/role
*/
router.post(
    '/role',
    UserMiddlewares.validateAddRoleToUserRequest,
    UserMiddlewares.validateUser,
    UserMiddlewares.isAdmin,
    UserController.addRoleToUser
);


// demo routes
router.get('/demo', UserMiddlewares.validateUser, function (req, res) {
    return res.status(StatusCodes.OK).json({
        data: 'Kitna demo chahida vuruu'
    });
});



module.exports = router;