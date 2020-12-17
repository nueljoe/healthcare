import AppError from './AppError';

/**
 * A error class for managing authentication errors with a 401
 * status code
 */
export default class AuthenticationError extends AppError {
    /**
     * @param { string } message - An error message
     */
    constructor(message = 'Please sign in or create an account') {
        super(401, message);
        this.name = 'Authentication Error';
    }
}
