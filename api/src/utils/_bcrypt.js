require('dotenv').config();
const bcrypt = require('bcrypt');

/**
 * A wrapper around a few bcrypt's functionalities adapted to password encryption
 */
module.exports = {
    /**
     * A wrapper for the bcrypt's `hash` function
     * @param { string } password - The user's password
     * @returns { Promise<string> } a Promise that is resolved with the hashed string or
     * rejected with an Error object
     */
    async hash(password) {
        try {
            return bcrypt.hash(password, parseInt(process.env.SALT));
        } catch (error) {
            throw error;
        }
    },

    /**
     * A wrapper for the bcrypt's `compare` function
     * @param { string } password - The user's password
     * @param { string } encryptedPassword - The user's pre-encrypted password
     * @returns { Promise<boolean> } a Promise that is resolved with a boolean or
     * rejected with an Error object
     */
    async compare(password, encryptedPassword) {
        try {
            return bcrypt.compare(password, encryptedPassword);
        } catch (error) {
            throw error;
        }
    }
}
