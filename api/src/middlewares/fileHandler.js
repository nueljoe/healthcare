import { ClientError } from '../errors';
import multer from 'multer';

const setup = (filter = []) => {
    return multer({
        storage: multer.memoryStorage(),
        fileFilter: (req, file, cb) => {
            if (!file) return cb(null, true);

            const fileType = file.mimetype.split('/')[0];

            if (filter.includes(fileType)) {
                cb(null, true);
            } else {
                cb(new ClientError('Incorrect file format!'), false);
            }
        }
    });
}

export default {
    /**
     * This sets a `file` field on the `Request` object
     * 
     * @param { string } fieldName - A key on the request body containing a
     * multipart form field
     * @param { Array<string> } filter - An array of file types(Ex: image, audio, etc.) allowable on this upload
     */
    single: (fieldName, filter = []) => setup(...filter).single(fieldName),
    /**
     * This sets a `files` field on the `Request` object
     * @param { string } fieldName - A key on the request body containing an array of
     * multipart form fields
     * @param { Array<string> } filter - An array of file types (Ex: image, audio, etc.) allowable on this upload
     */
    fields: (fieldName, filter = []) => setup(...filter).fields(fieldName),
}