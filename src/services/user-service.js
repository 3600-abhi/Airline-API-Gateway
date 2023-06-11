const { StatusCodes } = require('http-status-codes');
const { UserRepository } = require('../repositories');
const AppError = require('../utils/errors/app-errors');


const userRepository = new UserRepository();


async function createUser(data) {
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


module.exports = {
    createUser
}