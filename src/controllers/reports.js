const knex = require('../connection');

const chargesReports = async (req, res)=>{
  const statusReport = req.params.statusCobranca;

  //console.log(typeof(statusReport));

  if(statusReport !== "pago" && statusReport !== 'pendente' && statusReport !== 'vencido'){
      return res.status(404).json("Insira um status válido ('pago', 'pendente' ou 'vencido')");
  }

  console.log(statusReport);

  const getReport = await knex.select('cobrancas.id', 'clientes.nome', 'descricao', 'valor', 'status', 'data_vencimento', 
  knex.raw(`CASE WHEN cobrancas.status = 'pendente' AND data_vencimento < current_date THEN 'vencido' ELSE cobrancas.status END`)).from('cobrancas').leftJoin('clientes', 'cobrancas.cliente_id', 'clientes.id').debug();


    const reports = getReport.filter(chargeStatus => chargeStatus.status === statusReport )

    //console.log(reports);

  return res.json(reports)
}

module.exports = {
    chargesReports,

}