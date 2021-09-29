const express = require('express');
const users = require('./controllers/users');
const login = require('./controllers/login');


const routes = express();

// cadastra os usuários no banco de dados
routes.post('/users', users.SignUpUser);

//faz login do usuário
routes.post('/login', login.login);


module.exports = routes;