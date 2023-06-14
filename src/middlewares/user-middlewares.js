const { StatusCodes } = require('http-status-codes');
const AppError = require('../utils/errors/app-errors');
const { ErrorResponse } = require('../utils/common');
const { UserService } = require('../services');



function validateSignupRequest(req, res, next) {
    if (req.body.email === undefined) {
        ErrorResponse.message = 'Something went wrong';
        ErrorResponse.error = new AppError(
            ['Email not found in incoming request'],
            StatusCodes.BAD_REQUEST
        );

        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    if (req.body.password === undefined) {
        ErrorResponse.message = 'Something went wrong';
        ErrorResponse.error = new AppError(
            ['Password not found in incoming request'],
            StatusCodes.BAD_REQUEST
        );

        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    next();
}


function validateSigninRequest(req, res, next) {
    if (req.body.email === undefined) {
        ErrorResponse.message = 'Something went wrong';
        ErrorResponse.error = new AppError(
            ['Email not found in incoming request'],
            StatusCodes.BAD_REQUEST
        );

        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    if (req.body.password === undefined) {
        ErrorResponse.message = 'Something went wrong';
        ErrorResponse.error = new AppError(
            ['Password not found in incoming request'],
            StatusCodes.BAD_REQUEST
        );

        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    next();
}

function validateAddRoleToUserRequest(req, res, next) {
    if (req.body.userId === undefined) {
        ErrorResponse.message = 'Something went wrong';
        ErrorResponse.error = new AppError(
            ['User Id is missing in the incoming request'],
            StatusCodes.BAD_REQUEST
        );

        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
    }

    if (req.body.role === undefined) {
        ErrorResponse.message = 'Something went wrong';
        ErrorResponse.error = new AppError(
            ['Role name is missing in the incoming request']
        );
    }

    next();
}

async function validateUser(req, res, next) {
    try {
        // isAuthenticated fn will return id (primary key), if authenticated
        const userId = await UserService.isAuthenticated(req.headers['x-access-token']);

        if (userId) {
            req.userId = userId; // set the userId in the request object
            next();
        }


    } catch (error) {
        ErrorResponse.error = error; // this error object is (AppError) object
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

async function isAdmin(req, res, next) {
    try {
        // the req.userId is set by the above validateUser function
        const response = await UserService.isAdmin(req.userId);

        if (!response) {
            ErrorResponse.message = 'Something went wrong';
            ErrorResponse.error = new AppError(
                'User is not authorized to perform such action',
                StatusCodes.UNAUTHORIZED
            );

            return res.status(StatusCodes.UNAUTHORIZED).json(ErrorResponse);
        }

        next();
    } catch (error) {
        ErrorResponse.error = error; // this error object is (AppError) object
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

module.exports = {
    validateSignupRequest,
    validateSigninRequest,
    validateUser,
    validateAddRoleToUserRequest,
    isAdmin
}