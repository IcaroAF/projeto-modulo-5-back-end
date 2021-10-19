const { getAllCharges } = require("../services/chargeServices");
const { getAllCustomers } = require("../services/clientServices");

const chargesReports = async (req, res) => {
  const statusCharge = req.params.statusCobranca;

  if (
    statusCharge !== "pago" &&
    statusCharge !== "pendente" &&
    statusCharge !== "vencido"
  ) {
    return res
      .status(404)
      .json("Insira um status válido ('pago', 'pendente' ou 'vencido')");
  }

  const reports = await getAllCharges(statusCharge);

  return res.json(reports);
};

const customersReport = async (req, res) => {
  const statusCustomer = req.params.statusCliente;

  const reports = await getAllCustomers(statusCustomer);

  return res.json(reports);
};

module.exports = {
  chargesReports,
  customersReport,
};
