const knex = require('../connection');
const axios = require('axios');
const {cpf: validCPF} = require('cpf-cnpj-validator');
const validEmail = require('email-validator');

const signUpClient = async (req, res)=>{
    const{nome, email, cpf, telefone, cep} = req.body;

    if(!nome){
        return res.status(404).json("O campo nome é obrigatório.");
    }

    if(!email){
        return res.status(404).json("O campo email é obrigatório.");
    }

    if(!cpf){
        return res.status(404).json('O campo cpf é obrigatório.')
    }

    if(!telefone){
        return res.status(404).json('O campo telefone é obrigatório.')
    }

    if(!validEmail.validate(email)){
        return res.status(400).json("Digite um email válido.");
    }

    if(!validCPF.isValid(cpf)){
        return res.status(400).json("Digite um CPF válido.");
    }

    try {
        const clientAmount = await knex('clientes').where('email', email);

        const clientSameCpf = await knex('clientes').where('cpf', cpf);

        if(clientAmount[0]){
            return res.status(400).json("O e-mail informado já está cadastrado.");
        }

        if(clientSameCpf[0]){
            return res.status(400).json("Já existe um cliente com este CPF cadastrado.");
        }
        
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

        const {logradouro, complemento, bairro, localidade: cidade, uf: estado} = response.data;
        

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
            estado
        }

        const query = await knex('clientes').insert(queryObject);

        if(query.rowCount === 0){
            return res.status(400).json("Não foi possível cadastrar o cliente.");
        }

        return res.status(200).json("O cliente foi cadastrado com sucesso.");
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const editCLientProfile = async(req, res)=>{
    const{nome, email, cpf, telefone, cep} = req.body;

    if(!validEmail.validate(email)){
        return res.status(400).json("Digite um email válido.");
    }

    if(!validCPF.isValid(cpf)){
        return res.status(400).json("Digite um CPF válido.");
    }

    const clientData = await knex('clientes').where('cpf', cpf);

    if(clientData.length ===0){
        return res.status(404).json("O cliente informado não foi encontrado.");
    }

    const {senha, ...cliente} = clientData[0];

    req.cliente = cliente;

    try {
    const checkNewEmail = await knex('clientes').where('email', email).whereNot('id', cliente.id);

    if(checkNewEmail.length>0){
        return res.status(400).json("O e-mail informado já está cadastrado.");
    }

    if(cpf){
        const checkNewCPF = await knex('clientes').where('cpf', cpf).whereNot('id', cliente.id);

        if(checkNewCPF.length>0){
            return res.status(400).json("O CPF informado já está cadastrado")
        }
    }

    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

    const {logradouro, complemento, bairro, localidade: cidade, uf: estado} = response.data;

    const clientProfileObj = {
        nome,
        email,
        cpf,
        telefone,
        cep,
        logradouro,
        complemento,
        bairro,
        cidade,
        estado
    }

    const updateClientProfile = await knex('clientes').update(clientProfileObj).where('id', cliente.id);

    if(updateClientProfile !== 1){
        return res.status(400).json("Não foi possível atualizar o cadastro do cliente.");
    }

        return res.status(200).json("Cliente atualizado com sucesso.");
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const listAllCustomers = async (req, res)=>{
    const getCustomersList = await knex
   .select('clientes.id','clientes.nome', 'email', 'telefone', 
   knex.raw(`SUM(CASE WHEN cobrancas.status = 'pago' THEN cobrancas.valor else 0 END) as so_pago`))
   .sum('cobrancas.valor as valor_cobrado')
   .from('clientes')
   .leftJoin('cobrancas', 'clientes.id', 'cobrancas.cliente_id')
   .groupBy('clientes.id');

   const CustomerObj =  await Promise.all(getCustomersList.map(async customer=> {
       const customerCharges = await knex.select('cobrancas.cliente_id', 'status', 'data_vencimento').from('cobrancas').where('cobrancas.cliente_id', customer.id);

       let isOverdue = false;

       customerCharges.map(charge => {
           if(charge.data_vencimento.getTime()<Date.now() && charge.status !== 'pago'){
            isOverdue = true;
           }
       })

       return {...customer, statusCliente: isOverdue? 'Inadimplente' : 'Em dia' }
   } ))




    //console.log(getCustomersList)

    return res.json(CustomerObj);
}

const customerInfo = async (req, res)=>{
    const id  = Number(req.params.idCliente);

    console.log(id);

    const getCustomerInfo = await knex('clientes').leftJoin('cobrancas', 'cobrancas.cliente_id', 'clientes.id').where('clientes.id', `${id}`).groupBy('clientes.id', 'cobrancas.id').debug();

    const customerObj = {
        id: getCustomerInfo[0].cliente_id,
        nome: getCustomerInfo[0].nome,
        email: getCustomerInfo[0].email,
        telefone: getCustomerInfo[0].telefone,
        cobrancas: getCustomerInfo.map(cobranca => ({
            id: cobranca.id,
            descricao: cobranca.descricao,
            valor: cobranca.valor,
            data_vencimento: cobranca.data_vencimento,
            status: cobranca.status
        }))

    }


    console.log(getCustomerInfo);
    console.log(customerObj);

    return res.status(200).json(customerObj);
}

module.exports ={
    signUpClient,
    editCLientProfile,
    listAllCustomers,
    customerInfo
}