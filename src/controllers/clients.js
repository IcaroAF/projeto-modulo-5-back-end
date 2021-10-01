const knex = require('../connection');
const axios = require('axios');

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

    try {
        const clientAmount = await knex('clientes').where('email', email);

        const clientSameCpf = await knex('clientes').where('cpf', cpf);

        if(clientAmount[0]){
            return res.status(400).json("O e-mail informado já está cadastrado.");
        }

        if(clientSameCpf[0]){
            return res.status(400).json("Já existe um cliente este CPF cadastrado.");
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

module.exports ={
    signUpClient,
}