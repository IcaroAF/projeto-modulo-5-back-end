const knex = require('../connection');

const createCharge = async(req, res)=> {
    const {cliente_id, descricao, valor, status, data_vencimento} = req.body;

    if(!cliente_id){
        return res.status(404).json("O campo cliente_id é obrigatório.");
    }

    if(!valor){
        return res.status(404).json("O campo valor é obrigatório.");
    }

    if(!descricao){
        return res.status(404).json("É obrigatório colocar uma descrição para a cobrança.");
    }

    if(!status){
        return res.status(404).json("O campo status é obrigatório.");
    }

    if(!data_vencimento){
        return res.status(404).json("O campo data_vencimento é obrigatório.");
    }

    // console.log(data_vencimento);
    // console.log(new Date(data_vencimento).getTime());
    // console.log(Date.now());

    try {
        const existentCustomer = await knex('clientes').select('nome', 'id').where('clientes.id', cliente_id);

        if(existentCustomer.length === 0){
            return res.status(404).json(`Não há cliente com o id ${cliente_id} cadastrado no sistema`);
        }


        if(new Date(data_vencimento).getTime()>Date.now() && status === "vencido"){
            return res.status(400).json("Não é possível adicionar uma cobrança como vencida numa data futura.");
        }

        if(new Date(data_vencimento).getTime()<Date.now() && status === "pendente"){
            return res.status(400).json("Não é possível adicionar uma cobrança como pendente numa data passada.");
        }


    const chargeObj = {
        cliente_id, descricao, valor, status, data_vencimento
    }

    const insertCharge = await knex('cobrancas').insert(chargeObj);

    if(insertCharge.rowCount ===0){
        return res.status(400).json("Não foi possível cadastrar a cobrança");
    }

    return res.status(200).json("cobranca cadastrada");
        
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const listAllCharges = async(req, res)=> {

    const getList = await knex.from('cobrancas').leftJoin('clientes', 'cobrancas.cliente_id', 'clientes.id').select('cobrancas.id', 'clientes.nome', 'descricao', 'valor', 'status', 'data_vencimento').debug();

    //console.log(getList);

    return res.json(getList);
}

module.exports = {
    createCharge,
    listAllCharges
}