const knex = require('../connection');
const {isBefore} = require('date-fns');

const chargesReports = async (req, res)=>{
  const statusReport = req.params.statusCobranca;

  console.log(req.params);

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

const customersReport = async (req, res)=>{
    const statusCustomer = req.params.statusCliente;
    console.log(statusCustomer);

    if(statusCustomer !== "inadimplente" && statusReport !== 'em_dia'){
        return res.status(404).json("Insira um status válido ('inadimplente', 'ou 'em_dia')");
    }

    const getCustomersReport = await knex
   .select('clientes.id','clientes.nome', 'email', 'telefone', 'cep', 'cpf', 
   knex.raw(`SUM(CASE WHEN cobrancas.status = 'pago' THEN cobrancas.valor else 0 END) as so_pago`))
   .sum('cobrancas.valor as valor_cobrado')
   .from('clientes')
   .leftJoin('cobrancas', 'clientes.id', 'cobrancas.cliente_id')
   .groupBy('clientes.id');

   const CustomerObj =  await Promise.all(getCustomersReport.map(async customer=> {
       const customerCharges = await knex.select('cobrancas.cliente_id', 'status', 'data_vencimento').from('cobrancas').where('cobrancas.cliente_id', customer.id);

       let isOverdue = false;

       const today = new Date();
       today.setHours(0, 0, 0, 0);
       
       customerCharges.map(charge => {
           if(isBefore(charge.data_vencimento, today) && charge.status !== 'pago'){
            isOverdue = true;
           }
       })

       return {...customer, statusCliente: isOverdue? 'inadimplente' : 'em_dia' }
   } ))

   console.log(CustomerObj);
   const reports = CustomerObj.filter(customerStatus => customerStatus.statusCliente === statusCustomer )

   return res.json(reports);
}

module.exports = {
    chargesReports,
    customersReport
}