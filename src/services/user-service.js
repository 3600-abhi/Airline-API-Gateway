const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const { UserRepository } = require('../repositories');
const AppError = require('../utils/errors/app-errors');
const { Auth } = require('../utils/common');


const userRepository = new UserRepository();


async function signup(data) {
    try {
        const user = await userRepository.create(data);
        return user;
    } catch (error) {
        if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
            const explanations = [];
            error.errors.forEach((err) => explanations.push(err.message));
            throw new AppError(explanations, StatusCodes.BAD_REQUEST);
        }

        throw new AppError("Cannot create new user object", StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function signin(data) {
    try {
        const user = await userRepository.getUserByEmail(data.email);

        if (!user) {
            throw new AppError('User does not exist with given Email', StatusCodes.NOT_FOUND);
        }

        const isPasswordMatch = Auth.validatePassword(data.password, user.password);

        if (!isPasswordMatch) {
            throw new AppError('Invalid Password', StatusCodes.BAD_REQUEST);
        }

        const jwt = Auth.createToken({ id: user.id, email: user.email });

        return jwt;
    } catch (error) {
        // catch from above try block
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError('Cannot signin', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}




module.exports = {
    signup,
    signin
}