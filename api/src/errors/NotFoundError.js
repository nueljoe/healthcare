import AppError from './AppError';

/**
 * A error class for managing errors when a resource is can not be found on the server.
 * This error has a 404 status code.
 */
export default class NotFoundError extends AppError {
    /**
     * @param { string } message - An error message
     */
    constructor(message = 'Resource not found') {
        super(404, message);
        this.name = 'NotFound Error';
    }
}
