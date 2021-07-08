const jwt = require('jsonwebtoken');
// require('dotenv').config();

exports.authenticateToken = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    // console.log('The headers are: ', request.headers);

    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return response.sendStatus(401);
    }

    jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
        if (error) {
            return response.sendStatus(403)
        }
        request.user = user;
        // console.log('The user is: ', user);
        
        next();
    });
}

// module.exports = { authenticateToken };