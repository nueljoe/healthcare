import knex from '../database';
import { AuthenticationError } from '../errors';
import { decodeToken } from '../utils/_jwt';

/**
 * Identifies the current user in the system or throws them out if they
 * can't be identified
 * @param { import('express').Request } req 
 * @param { import('express').Response } res 
 * @param { import('express').NextFunction } next 
 */
export default async (req, res, next) => {
    const genericErrorMsg = 'Please sign in or create an account';

    try {
        const bearerToken = req.headers['authorization'];

        if (!bearerToken) {
            throw new AuthenticationError(genericErrorMsg);
        }
        
        const token = bearerToken.split(' ')[1];
        const payload = decodeToken(token);

        const user = await knex.first(['id', 'email', 'password', 'deactivated_at'])
            .from('users')
            .where('id', payload.id);

        if (!user) {
            throw new AuthenticationError(genericErrorMsg);
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}