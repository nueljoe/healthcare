import AppError from './AppError';

/**
 * A error class for managing permission errors with a 403
 * status code
 */
export default class PermissionError extends AppError {
    /**
     * @param { string } message - An error message
     */
    constructor(message = 'You are unauthorized to perform this operation') {
        super(403, message);
        this.name = 'Permission Error';
    }
}
