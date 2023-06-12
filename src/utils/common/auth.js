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


function createToken(input) {
    try {
        return jwt.sign(input, ServerConfig.JWT_SECRET, { expiresIn: ServerConfig.JWT_EXPIRY });
    } catch (error) {
        throw new AppError('Cannot generate token', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    validatePassword,
    createToken
}