export default (req, res, next) => {
    try {
        const { query } = req;

        const limit = query.limit ? parseInt(query.limit) : 20;
        const page = query.page ? parseInt(query.page) : 1;
        

        req.offset = (page * limit) - limit;
        req.limit = limit;

        next()
    } catch(error) {
        next(error);
    }
}