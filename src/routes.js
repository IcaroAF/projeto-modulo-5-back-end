const express = require('express');
const users = require('./controllers/users');


const routes = express();

// cadastra os usuários no banco de dados
routes.post('/users', users.SignUpUser);


module.exports = routes;