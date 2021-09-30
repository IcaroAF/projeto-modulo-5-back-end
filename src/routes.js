const express = require('express');
const users = require('./controllers/users');
const login = require('./controllers/login');
const verifyLogin = ('./filters/loginVerifier.js');


const routes = express();

// cadastra os usuários no banco de dados
routes.post('/users', users.SignUpUser);

//faz login do usuário
routes.post('/login', login.login);

//middleware para a verificação do usuário logado
routes.use(verifyLogin);

module.exports = routes;