import axios from 'axios';
import env from './env';

/**
 * A simplistic utility class to integrate and work with the Paystack API
 */
class Paystack {
    /**
    * A simplistic utility class to integrate and work with the Paystack API
    */
   constructor() {
        this.BASEURL = 'https://api.paystack.co';
        this.SECKEY = env.get('PAYSTACK_SEC');

        console.log(this.SECKEY);
    }

    async get(path, options) {
        return axios.get(this.composeEndpoint(path), this.prepareRequestOptions(options));
    }

    async post(path, payload, options) {
        return axios.post(this.composeEndpoint(path), payload, this.prepareRequestOptions(options));
    }

    async patch(path, payload, options) {
        return axios.patch(this.composeEndpoint(path), payload, this.prepareRequestOptions(options));
    }

    async delete(path, options) {
        return axios.delete(this.composeEndpoint(path), this.prepareRequestOptions(options));
    }

    /**
     * Prepare the request options by setting default data when necessary
     * @param { AxiosRequestConfig } options - Axios request configuration
     * @returns { AxiosRequestConfig }
     */
    prepareRequestOptions(options = {}) {
        return {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.SECKEY}`,
                ...options.headers
            }
        }
    }

    /**
     * Composes an endpoint
     * @param { string } path - A resource path on the API. A path must begin with a forward slash (`/`).
     * @returns { string } the full endpoint to the resource
     */
    composeEndpoint(path) {
        return `${BASE_URL}${path}`;
    }

    /**
     * Normalizes the point of access to the error's `message` property whether or not its an
     * `AxiosError` or a regular `Error` instance that is thrown.
     * @param { Error | AxiosError<string> } error - An error object
     * returns an object
     * @returns { Error | AxiosError<string> } returns the error object with the `message`
     * property defined on the first depth
     */
    handleResponseError(error) {
        error.message = error.response ? error.response.data.message : error.message;
        return error;
    };

    /**
     * Inititiates a new transaction on dear paystack.
     * @param { object } payload - An object containing details about the payment
     */
    async initiatePayment(payload) {
        try {
            const { data } = this.post('/transaction/initialize', payload);
            return data;
        } catch (error) {
            throw this.handleResponseError(error);
        }
    }

}

export default new Paystack();
