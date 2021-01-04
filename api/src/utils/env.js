require('dotenv').config();


module.exports = {
    /**
     * Attempts to return the value of an environment variable
     * @param { string } variable - An environment variable name
     * @returns { string | undefined } the value of an environment variable if it exist. Otherwise, it returns `undefined`
     */
    get(variable) {
        return process.env[variable];
    }
}