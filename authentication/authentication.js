const moment = require('moment');
const jwt = require('jwt-simple');

// Encode (username to token)
function encodeToken(username, userID, isResearcher) {
    const payload = {
        exp: moment().add(5, 'days').unix(),
        iat: moment().unix(),
        sub: username,
        isResearcher: isResearcher,
        userID: userID
    };

    return jwt.encode(payload, process.env.secretKey, null, null)
}

// Decode (token to username)
function decodeToken(token, cb) {
    try {
        const payload = jwt.decode(token, process.env.secretKey, null, null);

        const now = moment.now();

        // Check if the token is expired
        if (now > payload.exp) {
            console.log('Token has expired');
        }

        cb(null, payload);
    } catch (error) {
        cb(error, null);
    }
}

module.exports = {
    encodeToken,
    decodeToken
};
