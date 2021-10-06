const knex = require('../connection');

const createCharge = async(req, res)=> {
    const {cliente_id, descricao, valor, status, data_vencimento} = req.body;

    if(!cliente_id){
        return res.status(404).json("O campo cliente_id é obrigatório.");
    }

    if(!valor){
        return res.status(404).json("O campo valor é obrigatório.");
    }

    if(!status){
        return res.status(404).json("O campo status é obrigatório.");
    }

    if(!data_vencimento){
        return res.status(404).json("O campo data_vencimento é obrigatório.");
    }

    try {
        const existentCustomer = await knex('clientes').select('nome', 'id').where('clientes.id', cliente_id);

        if(existentCustomer.length === 0){
            return res.status(404).json(`Não há cliente com o id ${cliente_id} cadastrado no sistema`);
        }

    //console.log(cliente_id);    
    console.log(existentCustomer)

    const chargeObj = {
        cliente_id, descricao, valor, status, data_vencimento
    }

    const insertCharge = await knex('cobrancas').insert(chargeObj);

    return res.status(200).json("cobranca cadastrada");
        
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    createCharge,

}