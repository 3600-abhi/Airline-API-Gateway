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

        const customerRole = await roleRepository.getRoleByName(Enums.USER_ROLES.CUSTOMER);

        // This is the Lazy loading concept of sequelize association (refer docs)
        // by default the role of user will be customer after that admin can only set their roles
        user.addRole(customerRole);

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


async function addRoleToUser(data) {
    try {
        const user = await userRepository.get(data.userId);

        if (!user) {
            throw new AppError('User not found for given Id', StatusCodes.NOT_FOUND);
        }

        const role = await roleRepository.getRoleByName(data.role);

        if (!role) {
            throw new AppError('Role not found for given name', StatusCodes.NOT_FOUND);
        }

        // This is the Lazy loading concept of sequelize association (refer docs)
        user.addRole(role);

        return user;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError('Cannot change the user role', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


async function isAdmin(id) {
    try {
        const user = await userRepository.get(id);

        if (!user) {
            throw new AppError('User not found for given Id', StatusCodes.NOT_FOUND);
        }

        const adminRole = await roleRepository.getRoleByName(Enums.USER_ROLES.ADMIN);

        if (!adminRole) {
            throw new AppError('Role not found for given name', StatusCodes.NOT_FOUND);
        }

        return user.hasRole(adminRole);

    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError('Cannot verify the admin role', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


module.exports = {
    signup,
    signin,
    isAuthenticated,
    addRoleToUser,
    isAdmin
}