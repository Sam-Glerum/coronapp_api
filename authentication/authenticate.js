let authentication = require('./authentication');

module.exports = (req, res, next) => {
    try {
        const token = req.header('X-Access-Token');
        authentication.decodeToken(token, (error, payload) => {
            if (payload.isResearcher) {
                next();
            } else {
                res.status(401).json({
                    error: "You don't have the right permissions"
                })
            }
            }
        )
    } catch (e) {

    }
    
};
