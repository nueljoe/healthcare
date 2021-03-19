import knex from '../database';
import { AuthenticationError } from '../errors';
import { decodeToken } from '../utils/_jwt';

/**
 * Attempts to authenticate a user.
 * 
 * @param { import('express').Request } req
 */
const runAuthentication = async (req) => {
    const genericErrorMsg = 'Please sign in or create an account';

    try {
        const bearerToken = req.headers['authorization'];

        if (!bearerToken) {
            throw new AuthenticationError(genericErrorMsg);
        }
        
        const token = bearerToken.split(' ')[1];
        const payload = decodeToken(token);

        const user = await knex.first(['user.id', 'user.email', 'user.password', 'user.deactivated_at', 'permission.label'])
            .from('users as user')
            .where('user.id', payload.id)
            .innerJoin('permissions as permission', 'user.permission_id', 'permission.id');

        if (!user) {
            throw new AuthenticationError(genericErrorMsg);
        }

        return user;
    } catch (error) {
        if (propagate) {
            throw error;
        }
    }
}

/**
 * Identifies the current user in the system or throws them out if they
 * can't be identified. The server with return an authentication error message
 * if authentication fails.
 * @param { import('express').Request } req 
 * @param { import('express').Response } res 
 * @param { import('express').NextFunction } next 
 */
const authenticate = async (req, res, next) => {
    try {
        req.user = await runAuthentication(req);
        next();
    } catch (error) {
        next(error);
    }
}

/**
 * Identifies the current user in the system or throws them out if they
 * can't be identified without throwing any errors. Authenticating in relaxed mode
 *  will not prevent control from moving to the next middleware on a route.
 * @param { import('express').Request } req 
 * @param { import('express').Response } res 
 * @param { import('express').NextFunction } next 
 */
authenticate.inRelaxedMode = async (req, res, next) => {
    try {
        req.user = await runAuthentication(req, next, { propagate: true });
        next()
    } catch (error) {
        console.log('No User Was Found, But Proceed To The Next Middleware')
        next();
    }
}

export default authenticate;
