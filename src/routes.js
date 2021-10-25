const express = require('express');
const users = require('./controllers/users');
const login = require('./controllers/login');
const clients = require('./controllers/clients');
const charges = require('./controllers/charges');
const reports = require('./controllers/reports');
const verifyLogin = require('./filters/loginVerifier');


const routes = express();

// cadastra os usuários no banco de dados
routes.post('/users', users.signUpUser);

//faz login do usuário
routes.post('/login', login.login);

//middleware para a verificação do usuário logado
routes.use(verifyLogin);

//cria endpoint de atualização de cadastro do usuario;
routes.put('/users', users.userEdit);

//cria endpoint de cadastro de cliente;
routes.post('/clients', clients.signUpClient);

//atualização de cadastro do cliente;
routes.put('/clients/:idCliente', clients.editCLientProfile);

//rota para criação de cobrança
routes.post('/charges', charges.createCharge);

//rota para obter lista de cobranças
routes.get('/charges', charges.listAllCharges);

//rota para cobrança única
routes.get('/charges/:idCobranca', charges.listCharge);

//rota para obter lista de clientes
routes.get('/clients', clients.listAllCustomers);

//rota para obter dado de um cliente
routes.get('/clients/:idCliente', clients.customerInfo);

//obter usuario logado
routes.get('/users', users.getUser);

// rota para atualização de cobrança
routes.put('/charges/:idCobranca', charges.editCharge);

// rota para exclusão de cobrança
routes.delete('/charges/:idCobranca', charges.deleteCharge);

// rota para obtenção de relatório de cobranças
routes.get('/reports/charges/:statusCobranca', reports.chargesReports); 

//rota para obtenção de relatório
routes.get('/reports/clients/:statusCliente', reports.customersReport);



module.exports = routes;