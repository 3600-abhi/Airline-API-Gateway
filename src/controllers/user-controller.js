const { StatusCodes } = require('http-status-codes');
const { UserService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');


/** 
 * /signup
 * req.body: {email: 'xyz@gmail.com', password: 'ndvyue8765'}
*/
async function signup(req, res) {
    try {
        const user = await UserService.signup({
            email: req.body.email,
            password: req.body.password
        });

        SuccessResponse.data = user;
        SuccessResponse.message = 'Successfully created a user';

        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error; // this error object is (AppError) object
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

async function signin(req, res) {
    try {
        const response = await UserService.signin({
            email: req.body.email,
            password: req.body.password
        });

        SuccessResponse.message = 'Successfully signed in';
        SuccessResponse.data = response;

        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error; // this error object is (AppError) object
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}


async function addRoleToUser(req, res) {
    try {
        const user = await UserService.addRoleToUser({
            userId: req.body.userId,
            role: req.body.role
        });

        SuccessResponse.data = user;
        SuccessResponse.message = 'Succesfully added role to user';

        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error; // this error object is (AppError) object
        return res.status(error.statusCode).json(ErrorResponse);
    }
}

module.exports = {
    signup,
    signin,
    addRoleToUser
};