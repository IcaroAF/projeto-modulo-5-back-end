const express = require('express');
const users = require('./controllers/users');
const login = require('./controllers/login');
const clients = require('./controllers/clients');
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

//cria endpoint de cadastro de cliente;
routes.post('/clients', clients.signUpClient);

//atualização de cadastro do cliente;
routes.put('/clients', clients.editCLientProfile);

module.exports = routes;