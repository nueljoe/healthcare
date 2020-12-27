import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import handlebars from 'handlebars';

dotenv.config();

class Mailer {
    /**
     * A mail service
     */
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT || 587,
            secure: false, // upgrade later with STARTTLS
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });

        this.from = '"The HealthCare Team" <snettpro@gmail.com>';
    }

    /**
     * Sends an email
     * @param { object } options - The email options
     * @param { string[] } options.recipients - An array of the email recipients
     * @param { string } options.subject - The subject of the mail
     * @param { string } options.text - A plaintext format of the mail
     * @param { HTMLElement } options.html - A html format of the mail
     */
    async send({ recipients, subject, text, html }) {
        try {
            await this.transporter.sendMail({
                from: this.from,
                to: recipients,
                subject,
                text,
                html
            });
        } catch (error) {
            throw error;
        }
    }
   
    /**
     * Send verification email
     * @param { object } details - An object containing the user's details and the verification link
     */
    async sendAccountVerification(details) {
        const template = this.composeTemplate('account-verification', details);
        console.log(template);
        try {
            await this.send({
                recipients: [details.email],
                subject: 'HealthCare - Account Verification',
                html: template
            });
        } catch (error) {
            throw error;
        }
    }
    
    /**
     * Send password reset link
     * @param { object } details - An object containing the user's details and the reset link
     */
    async sendPasswordResetLink(details) {
        const template = this.composeTemplate('password-reset', details);
        console.log(template);
        try {
            await this.send({
                recipients: [details.email],
                subject: 'HealthCare - Reset Password',
                html: template
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Compose and return the HTML format of a mail
     * @param { string } templateName - The name of a template file in the `mailTemplates` directory
     * @param { object } data - An object containing dynamic information to be used
     * in the composition of an email
     */
    composeTemplate(templateName, data) {
        const templatePath = path.join(__dirname, '../templates/mails', `/${templateName}.hbs`);
        const templateFile = fs.readFileSync(templatePath).toString();

        const template = handlebars.compile(templateFile);
        return template(data);
    }
}

export default new Mailer();
