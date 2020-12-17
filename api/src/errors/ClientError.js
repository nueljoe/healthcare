import AppError from './AppError';

/**
 * A error class for managing client-related errors with a 400
 * status code
 */
class ClientError extends AppError {
    /**
     * @param { string } message - An error message
     */
    constructor(message) {
        super(400, message);
        this.name = 'Client Error';
    }
}

export default ClientError;
