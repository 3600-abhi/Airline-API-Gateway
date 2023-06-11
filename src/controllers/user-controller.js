const { StatusCodes } = require('http-status-codes');
const { UserService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');


/** 
 * /signup
 * req.body: {email: 'xyz@gmail.com', password: 'ndvyue8765'}
*/
async function createUser(req, res) {
    try {
        const user = await UserService.createUser({
            email: req.body.email,
            password: req.body.password
        });

        SuccessResponse.data = user;
        SuccessResponse.message = "Successfully created a user";

        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error; // this error object is (AppError) object
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
    }
}

module.exports = {
    createUser
};