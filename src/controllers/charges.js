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


        // if(new Date(data_vencimento).getTime()>Date.now() && status === "vencido"){
        //     return res.status(400).json("Não é possível adicionar uma cobrança como vencida numa data futura.");
        // }

        // if(new Date(data_vencimento).getTime()<Date.now() && status === "pendente"){
        //     return res.status(400).json("Não é possível adicionar uma cobrança como pendente numa data passada.");
        // }


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

    const getList = await knex.select('cobrancas.id', 'clientes.nome', 'descricao', 'valor', 'status', 'data_vencimento', 
    knex.raw(`CASE WHEN cobrancas.status = 'pendente' AND data_vencimento < (current_date+1) THEN 'vencido' ELSE cobrancas.status END`)).from('cobrancas').leftJoin('clientes', 'cobrancas.cliente_id', 'clientes.id').debug();

    console.log(getList);

    return res.json(getList);
}


const editCharge = async(req, res)=>{
    const id = Number(req.params.idCobranca);
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

    console.log(id);

    const chargeData = await knex('cobrancas').where('id', id);

    if(chargeData.length ===0){
        return res.status(404).json("A cobrança informada não foi encontrada.");
    }

    try {
        const editedChargeObj = {
            cliente_id, 
            descricao, 
            valor, 
            status, 
            data_vencimento
        }

        const updateCharge = await knex('cobrancas').update(editedChargeObj).where('id', id);

        if(updateCharge !==1){
            return res.status(400).json("Não foi possível atualizar a cobrança.");
        }

        return res.status(200).json("Cobrança atualizada com sucesso");
    } catch (error) {
        return res.status(400).json(error.message);
    }

}

const deleteCharge = async(req, res)=>{
    const id = Number(req.params.idCobranca);

    const chargeData = await knex('cobrancas').where('id', id);

    console.log(chargeData);

    if(chargeData.length ===0){
        return res.status(404).json("A cobrança informada não foi encontrada.");
    }

    try {
        if(chargeData[0].status === 'pendente' && chargeData[0].data_vencimento.getTime() < Date.now()){
            const removeCharge = await knex('cobrancas').delete().where('id', id)

            return res.status(200).json("Cobrança removida com sucesso");
        }else{
            return res.status(404).json("Não foi possível excluir a cobrança");
        }
    
       
    } catch (error) {
        return res.status(400).json(error.message);
    }

    
}
module.exports = {
    createCharge,
    listAllCharges,
    editCharge,
    deleteCharge
}