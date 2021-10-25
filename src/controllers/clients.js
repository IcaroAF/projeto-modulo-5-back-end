const knex = require("../connection");
const axios = require("axios");
const { cpf: validCPF } = require("cpf-cnpj-validator");
const validEmail = require("email-validator");
//const {isBefore} = require('date-fns');
const { getAllCustomers } = require("../services/clientServices");

const signUpClient = async (req, res) => {
  const {
    nome,
    email,
    cpf,
    telefone,
    cep,
    logradouro,
    bairro,
    cidade,
    estado,
    complemento,
    ponto_referencia,
  } = req.body;

  if (!nome) {
    return res.status(404).json("O campo nome é obrigatório.");
  }

  if (!email) {
    return res.status(404).json("O campo email é obrigatório.");
  }

  if (!cpf) {
    return res.status(404).json("O campo cpf é obrigatório.");
  }

  if (!telefone) {
    return res.status(404).json("O campo telefone é obrigatório.");
  }

  if (!validEmail.validate(email)) {
    return res.status(400).json("Digite um email válido.");
  }

  if (!validCPF.isValid(cpf)) {
    return res.status(400).json("Digite um CPF válido.");
  }

  try {
    const clientAmount = await knex("clientes").where("email", email);

    const clientSameCpf = await knex("clientes").where("cpf", cpf);

    if (clientAmount[0]) {
      return res.status(400).json("O e-mail informado já está cadastrado.");
    }

    if (clientSameCpf[0]) {
      return res
        .status(400)
        .json("Já existe um cliente com este CPF cadastrado.");
    }

    // const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

    // const {logradouro, complemento, bairro, localidade: cidade, uf: estado} = response.data;

    const queryObject = {
      nome,
      email,
      cpf,
      telefone,
      cep,
      logradouro,
      complemento,
      bairro,
      cidade,
      estado,
      ponto_referencia,
    };

    const query = await knex("clientes").insert(queryObject);

    if (query.rowCount === 0) {
      return res.status(400).json("Não foi possível cadastrar o cliente.");
    }

    return res.status(200).json("O cliente foi cadastrado com sucesso.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const editCLientProfile = async (req, res) => {
  const id = Number(req.params.idCliente);
  const {
    nome,
    email,
    cpf,
    telefone,
    cep,
    logradouro,
    bairro,
    cidade,
    estado,
    complemento,
    ponto_referencia,
  } = req.body;

  if (!nome) {
    return res.status(404).json("O campo nome é obrigatório.");
  }

  if (!email) {
    return res.status(404).json("O campo email é obrigatório.");
  }

  if (!cpf) {
    return res.status(404).json("O campo cpf é obrigatório.");
  }

  if (!telefone) {
    return res.status(404).json("O campo telefone é obrigatório.");
  }

  if (!validEmail.validate(email)) {
    return res.status(400).json("Digite um email válido.");
  }

  if (!validCPF.isValid(cpf)) {
    return res.status(400).json("Digite um CPF válido.");
  }

  const clientData = await knex("clientes").where("id", id);

  if (clientData.length === 0) {
    return res.status(404).json("O cliente informado não foi encontrado.");
  }

  try {
    const checkNewEmail = await knex("clientes")
      .where("email", email)
      .whereNot("id", id);

    if (checkNewEmail.length > 0) {
      return res.status(400).json("O e-mail informado já está cadastrado.");
    }

    if (cpf) {
      const checkNewCPF = await knex("clientes")
        .where("cpf", cpf)
        .whereNot("id", id);

      if (checkNewCPF.length > 0) {
        return res.status(400).json("O CPF informado já está cadastrado");
      }
    }

    // const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

    // const {logradouro, bairro, localidade: cidade, uf: estado} = response.data;

    const clientProfileObj = {
      id,
      nome,
      email,
      cpf,
      telefone,
      cep,
      logradouro,
      complemento,
      bairro,
      cidade,
      estado,
      ponto_referencia,
    };

    const updateClientProfile = await knex("clientes")
      .update(clientProfileObj)
      .where("id", id);

    if (updateClientProfile !== 1) {
      return res
        .status(400)
        .json("Não foi possível atualizar o cadastro do cliente.");
    }

    return res.status(200).json("Cliente atualizado com sucesso.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const listAllCustomers = async (req, res) => {
  const getAllClients = await getAllCustomers();

  return res.json(getAllClients);
};

const customerInfo = async (req, res) => {
  const id = Number(req.params.idCliente);

  const existingCustomer = await knex("clientes").where("clientes.id", id);

  if (existingCustomer.length === 0) {
    return res.status(404).json("O cliente informado não foi encontrado.");
  }

  try {
    const getCustomerInfo = await knex
      .select(
        "clientes.id as id_cliente",
        "cobrancas.cliente_id",
        "*",
        knex.raw(
          `CASE WHEN cobrancas.status = 'pendente' AND data_vencimento < date(timezone('UTC-3', now()::timestamp)) THEN 'vencido' ELSE cobrancas.status END`
        )
      )
      .from("clientes")
      .leftJoin("cobrancas", "cobrancas.cliente_id", "clientes.id")
      .where("clientes.id", `${id}`)
      .groupBy("clientes.id", "cobrancas.id");

    const customerObj = {
      id: getCustomerInfo[0].id_cliente,
      nome: getCustomerInfo[0].nome,
      cpf: getCustomerInfo[0].cpf,
      email: getCustomerInfo[0].email,
      telefone: getCustomerInfo[0].telefone,
      cep: getCustomerInfo[0].cep,
      bairro: getCustomerInfo[0].bairro,
      cidade: getCustomerInfo[0].cidade,
      logradouro: getCustomerInfo[0].logradouro,
      telefone: getCustomerInfo[0].telefone,
      complemento: getCustomerInfo[0].complemento,
      ponto_referencia: getCustomerInfo[0].ponto_referencia,
      cobrancas: getCustomerInfo[0].valor
        ? getCustomerInfo.map((cobranca) => ({
            id: cobranca.id,
            descricao: cobranca.descricao,
            valor: cobranca.valor,
            data_vencimento: cobranca.data_vencimento,
            status: cobranca.status,
          }))
        : [],
    };

    return res.status(200).json(customerObj);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  signUpClient,
  editCLientProfile,
  listAllCustomers,
  customerInfo,
};
