const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');
const { UserRepository, RoleRepository } = require('../repositories');
const AppError = require('../utils/errors/app-errors');
const { Auth, Enums } = require('../utils/common');


const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

async function signup(data) {
    try {
        const user = await userRepository.create(data);
        const role = await roleRepository.getRoleByName(Enums.USER_ROLES.CUSTOMER);

        // This is the Lazy loading concept of sequelize association (refer docs)
        user.addRole(role);

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

        // the object which we are passing, we will get when we will
        // verify it using jwt.verify() as response
        const token = Auth.createToken({ id: user.id, email: user.email });

        return token;
    } catch (error) {
        // catch from above try block
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError('Cannot signin', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function isAuthenticated(token) {
    try {
        if (!token) {
            throw new AppError('JWT token is missing', StatusCodes.BAD_REQUEST);
        }

        const response = Auth.verifyToken(token);

        console.log('Response = ', response);

        // Just checking it into database for more safety, just to safe from hacking
        // Although not much needed, we can avoide it 
        const user = await userRepository.get(response.id);

        if (!user) {
            throw new AppError('User not Found', StatusCodes.NOT_FOUND);
        }

        return user.id;

    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        if (error.name === 'JsonWebTokenError') {
            throw new AppError('Invalid JWT Token', StatusCodes.BAD_REQUEST);
        }

        throw new AppError('Cannot Authenticate', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}




module.exports = {
    signup,
    signin,
    isAuthenticated
}