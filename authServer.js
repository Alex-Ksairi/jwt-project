// jwt
const jwt = require('jsonwebtoken');

const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const port = process.env.AUTH_PORT;

let refreshedTokens = [];


// middleware
app.use(express.json());

app.post('/login', (request, response) => {
    const username = request.body.username;
    const id = request.body.userId;

    // assuming user has already logged in
    const user = { id: id, name: username };

    const accessToken = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '30s' });
    const refreshedToken = jwt.sign(user, process.env.REFRESHED_KEY);
    // { expiresIn: '25s' }

    // in order to save tokens
    refreshedTokens.push(refreshedToken);

    try {
        response.status(200).json({ accessToken: accessToken, refreshedToken: refreshedToken });
    } catch (error) {
        response.status(400).send({ message: 'An error has occurred', error: error.message });
    }
});

app.post('/token', (request, response) => {
    const refreshedToken = request.body.token;

    if (refreshedToken == null) {
        return response.sendStatus(401);
    }

    if (!refreshedTokens.includes(refreshedToken)) {
        return response.sendStatus(403);
    }

    jwt.verify(refreshedToken, process.env.REFRESHED_KEY, (error, user) => {
        if (error) {
            return response.sendStatus(403);
        }

        const accessToken = generateAccessToken({ id: user.id, name: user.name });
        response.json({ accessToken: accessToken });
    });
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '30s' });
};

// logout
app.delete('/logout', (request, response) => {
    refreshedTokens = refreshedTokens.filter(token => token !== request.body.token);
    response.sendStatus(204);
});


app.listen(port, () => console.log('Authentication server is running and being ready for requests on port:', port));