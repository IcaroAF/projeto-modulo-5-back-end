const knex = require("../connection");
const { isAfter, isToday } = require("date-fns");
const { getAllCharges } = require("../services/chargeServices");

const createCharge = async (req, res) => {
  const { cliente_id, descricao, valor, status, data_vencimento } = req.body;

  if (!cliente_id) {
    return res.status(404).json("O campo cliente_id é obrigatório.");
  }

  if (!valor) {
    return res.status(404).json("O campo valor é obrigatório.");
  }

  if (!descricao) {
    return res
      .status(404)
      .json("É obrigatório colocar uma descrição para a cobrança.");
  }

  if (!status) {
    return res.status(404).json("O campo status é obrigatório.");
  }

  if (!data_vencimento) {
    return res.status(404).json("O campo data_vencimento é obrigatório.");
  }

  try {
    const existentCustomer = await knex("clientes")
      .select("nome", "id")
      .where("clientes.id", cliente_id);

    if (existentCustomer.length === 0) {
      return res
        .status(404)
        .json(`Não há cliente com o id ${cliente_id} cadastrado no sistema`);
    }

    const chargeObj = {
      cliente_id,
      descricao,
      valor,
      status,
      data_vencimento,
    };

    const insertCharge = await knex("cobrancas").insert(chargeObj);

    if (insertCharge.rowCount === 0) {
      return res.status(400).json("Não foi possível cadastrar a cobrança");
    }

    return res.status(200).json("Cobrança cadastrada.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const listAllCharges = async (req, res) => {
  const getList = await getAllCharges();

  return res.json(getList);
};

const listCharge = async (req, res) => {
  const id = Number(req.params.idCobranca);

  const chargeData = await knex("cobrancas").where("id", id);

  if (chargeData.length === 0) {
    return res.status(404).json("A cobrança informada não foi encontrada.");
  }

  const getCharge = await getAllCharges(undefined, id);

  return res.status(200).json(getCharge);
};

const editCharge = async (req, res) => {
  const id = Number(req.params.idCobranca);
  const { cliente_id, descricao, valor, status, data_vencimento } = req.body;

  if (!cliente_id) {
    return res.status(404).json("O campo cliente_id é obrigatório.");
  }

  if (!valor) {
    return res.status(404).json("O campo valor é obrigatório.");
  }

  if (!descricao) {
    return res
      .status(404)
      .json("É obrigatório colocar uma descrição para a cobrança.");
  }

  if (!status) {
    return res.status(404).json("O campo status é obrigatório.");
  }

  if (!data_vencimento) {
    return res.status(404).json("O campo data_vencimento é obrigatório.");
  }

  if (status !== "pago" && status !== "pendente") {
    return res
      .status(404)
      .json("O campo status deve receber somente os status pendente ou pago");
  }

  const chargeData = await knex("cobrancas").where("id", id);

  if (chargeData.length === 0) {
    return res.status(404).json("A cobrança informada não foi encontrada.");
  }

  try {
    const editedChargeObj = {
      cliente_id,
      descricao,
      valor,
      status,
      data_vencimento,
    };

    const updateCharge = await knex("cobrancas")
      .update(editedChargeObj)
      .where("id", id);

    if (updateCharge !== 1) {
      return res.status(400).json("Não foi possível atualizar a cobrança.");
    }

    return res.status(200).json("Cobrança atualizada com sucesso");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const deleteCharge = async (req, res) => {
  const id = Number(req.params.idCobranca);

  const chargeData = await knex("cobrancas").where("id", id);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (chargeData.length === 0) {
    return res.status(404).json("A cobrança informada não foi encontrada.");
  }

  try {
    if (
      chargeData[0].status === "pendente" &&
      (isAfter(chargeData[0].data_vencimento, today) ||
        isToday(chargeData[0].data_vencimento))
    ) {
      const removeCharge = await knex("cobrancas").delete().where("id", id);

      return res.status(200).json("Cobrança removida com sucesso");
    } else {
      return res.status(404).json("Não foi possível excluir a cobrança");
    }
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
module.exports = {
  createCharge,
  listAllCharges,
  listCharge,
  editCharge,
  deleteCharge,
};
