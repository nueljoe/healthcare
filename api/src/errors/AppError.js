/**
 * An error class specific to an API
 */
class AppError extends Error {
    /**
     * @param { number } statusCode - The status code of an API response
     * @param { string } message - An error message to be returned by the API
     */
    constructor(statusCode, message) {
        super(message);
        this.name = 'App Error';
        this.statusCode = statusCode;
    }
}

export default AppError;
