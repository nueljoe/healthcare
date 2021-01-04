export default (req, res, next) => {
    try {
        const { query } = req;

        const limit = Number(query.limit) || 20;
        const page = Number(query.page) || 1;
        

        req.offset = (page * limit) - limit;
        req.limit = query.limit;

        next()
    } catch(error) {
        next(error);
    }
}