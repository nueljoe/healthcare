import fs from 'fs';
import path from 'path';

/**
 * A utility function for deleting files from the `public` directory that is
 * inside of the `src` directory.
 * 
 * @param { string } filePath - A path to the file to be deleted. This path is assumed
 * relative to the `public` directory. File paths are not expected to begin with the forward slash.
 */
export default (filePath = '') => {
    const pm = new Promise((resolve, reject) => {
        if (!filePath) {
            reject('File path can not be an empty string or a falsy value');
        }

        fs.unlink(path.resolve(__dirname, `../public/${filePath}`), (err) => {
            if (err) {
                reject(err);
            }

            resolve('File was deleted');
        });
    });

    return pm;
}
