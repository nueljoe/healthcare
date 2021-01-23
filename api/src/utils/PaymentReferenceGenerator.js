import crypto from 'crypto';

class PaymentReferenceGenerator {
    /**
     * A utility class that generates a unique reference code for payments
     * @param { object } payload - An object usually containing some information about the payment to be made
     */
    constructor(payload = {})  {
        const lengthOfRefString = 11 + Math.floor(5 * Math.random());

        payload = JSON.stringify({ ...payload, timestamp: Date.now(), lengthOfRefString });

        this.reference = crypto.createHmac('sha256', payload, { encoding: 'utf-8' })
                            .update('payment-reference')
                            .digest('hex').slice(0, lengthOfRefString);
    }
}

export default PaymentReferenceGenerator;
