const express = require('express');
const users = require('./controllers/users');
const login = require('./controllers/login');
const verifyLogin = require('./filters/loginVerifier');


const routes = express();

// cadastra os usuários no banco de dados
routes.post('/users', users.SignUpUser);

//faz login do usuário
routes.post('/login', login.login);

//middleware para a verificação do usuário logado
routes.use(verifyLogin);

//cria endpoint de atualização de cadastro do usuario;
routes.put('/users', users.userEdit);

module.exports = routes;