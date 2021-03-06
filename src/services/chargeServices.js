const knex = require("../connection");

const getAllCharges = async (statusCharge, cobrancaId) => {
  const query = knex
    .select(
      "cobrancas.id",
      "cobrancas.cliente_id",
      "clientes.nome",
      "clientes.cpf",
      "clientes.email",
      "descricao",
      "valor",
      "status",
      "data_vencimento",
      knex.raw(
        `CASE WHEN cobrancas.status = 'pendente' AND data_vencimento < date(timezone('UTC-3', now()::timestamp)) THEN 'vencido' ELSE cobrancas.status END`
      )
    )
    .from("cobrancas")
    .leftJoin("clientes", "cobrancas.cliente_id", "clientes.id");

  if (cobrancaId) {
    query.where("cobrancas.id", cobrancaId);
  }

  const getList = await query;

  return statusCharge
    ? getList.filter((chargeStatus) => chargeStatus.status === statusCharge)
    : getList;
};

module.exports = {
  getAllCharges,
};
