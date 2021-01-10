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

/**
 * A file handler which uses the multer package to handle multipart forms. Files in the 
 * form are stored as blobs in memory and passed on to the next middleware.
 */
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
    
    /**
     * This sets a `files` field on the `Request` object
     * @param { string } fieldName - A key on the request body containing an array of
     * multipart form fields
     * @param { Array<string> } filter - An array of file types (Ex: image, audio, etc.) allowable on this upload
     * @param { number } maxCount - The maximum number of items that can be uploaded at once.
     */
    array: (fieldName, filter = [], maxCount) => setup(...filter).array(fieldName, maxCount),
}
