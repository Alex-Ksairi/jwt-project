// jwt
const jwt = require('jsonwebtoken');

const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');

const port = process.env.DB_PORT;


// importing data
const Teas = require('./data');

// middleware
const auth = require('./middleware/auth');
app.use(express.json());

// using data
app.get('/teas', auth.authenticateToken, (request, response) => {
    try {
        response.status(200).json(Teas);
    } catch (error) {
        response.status(400).send({ message: 'An error has occurred', error: error.message });
    }
});

// payload
app.get('/teas/user', auth.authenticateToken, (request, response) => {
    response.json(Teas.filter(tea => tea.userID === request.user.id));
});

mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }
    )
    .then(() => console.log('Connection has been successfully established! Welcome to database...'))
    .catch(() => console.log('Ups, database couldn\'t be connected!'));

app.listen(port, () => console.log('Server is running and being ready for requests on port:', port));