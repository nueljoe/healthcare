import slugify from 'slugify';

/**
 * A utility slug maker that wraps the official `slugify` package
 * @param { string } payload - The string to slugify
 * @param { string | number } suffix - Some additional content to append to the end of
 * the payload before slugifying. Defaults to the current value of `Date.now()`
 */
export default (payload, suffix = Date.now()) => {
    const preparedPayload = `${payload} ${suffix}`;

    return slugify(preparedPayload, {
        remove: undefined,
        lower: true,
        strict: true
    });
}
