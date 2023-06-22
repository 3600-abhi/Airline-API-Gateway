const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const AppError = require('../errors/app-errors');
const { ServerConfig } = require('../../config');



function validatePassword(plainPassword, encryptedPassword) {
    try {
        return bcrypt.compareSync(plainPassword, encryptedPassword);
    } catch (error) {
        throw new AppError('Cannot validate the password', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


function createToken(data) {
    try {
        // when we will verify the generated token using jwt.verify() fn
        // we will get this input object as response
        return jwt.sign(data, ServerConfig.JWT_SECRET, { expiresIn: ServerConfig.JWT_EXPIRY });
    } catch (error) {
        throw new AppError('Cannot generate token', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

function verifyToken(token) {
    try {
        // jwt.verify() fn return the object with which it was signed if verified
        // {id: 'xxxxx', email: 'xyz@gmail.com', iat: 55654, expire: 45665}
        return jwt.verify(token, ServerConfig.JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new AppError('JWT token  expired', StatusCodes.BAD_REQUEST);
        }

        throw new AppError('Invalid Token', StatusCodes.BAD_REQUEST);
    }
}

module.exports = {
    validatePassword,
    createToken,
    verifyToken
}