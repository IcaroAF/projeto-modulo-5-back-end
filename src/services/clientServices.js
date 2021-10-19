const knex = require("../connection");
const { isBefore } = require("date-fns");

const getAllCustomers = async (statusCustomer) => {
  // console.log(statusCostumer);

  const getCustomersList = await knex
    .select(
      "clientes.id",
      "clientes.nome",
      "email",
      "telefone",
      "cep",
      "cpf",
      knex.raw(
        `SUM(CASE WHEN cobrancas.status = 'pago' THEN cobrancas.valor else 0 END) as so_pago`
      )
    )
    .sum("cobrancas.valor as valor_cobrado")
    .from("clientes")
    .leftJoin("cobrancas", "clientes.id", "cobrancas.cliente_id")
    .groupBy("clientes.id");

  const CustomerObj = await Promise.all(
    getCustomersList.map(async (customer) => {
      const customerCharges = await knex
        .select("cobrancas.cliente_id", "status", "data_vencimento")
        .from("cobrancas")
        .where("cobrancas.cliente_id", customer.id);

      let isOverdue = false;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      customerCharges.map((charge) => {
        if (
          isBefore(charge.data_vencimento, today) &&
          charge.status !== "pago"
        ) {
          isOverdue = true;
        }
      });

      return {
        ...customer,
        statusCliente: isOverdue ? "inadimplente" : "em_dia",
      };
    })
  );

  //console.log(!!statusCustumer);

  return statusCustomer
    ? CustomerObj.filter(
        (customerStatus) => customerStatus.statusCliente === statusCustomer
      )
    : CustomerObj;
};

module.exports = {
  getAllCustomers,
};
