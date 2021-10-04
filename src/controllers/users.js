const knex = require('../connection');
const bcrypt = require('bcryptjs');
const {cpf: validCPF} = require('cpf-cnpj-validator');
const validEmail = require('email-validator');

const signUpUser = async (req, res) => {
    const {nome, email, senha} = req.body;

    if(!nome){
        return res.status(404).json("O campo nome é obrigatório");
    }
    if(!email){
        return res.status(404).json("O campo email é obrigatório");
    }
    if(!senha){
        return res.status(404).json("O campo senha é obrigatório");
    }

    if(!validEmail.validate(email)){
        return res.status(400).json("Digite um email válido.");
    }

    try {
        const userAmount = await knex('usuarios').where('email', email);

        if(userAmount[0]){
            return res.status(400).json("O e-mail informado já está cadastrado");
        }

        const encryptedPassword = await bcrypt.hash(senha,10);

        const queryObject = {
            nome,
            email,
            senha: encryptedPassword,
        }

        const query = await knex('usuarios').insert(queryObject);

        if(query.rowCount === 0) {
            return res.status(400).json("Não foi possível cadastrar o usuário");
        }

        return res.status(200).json("O usuário foi cadastrado com sucesso!");
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const userEdit = async (req, res)=>{
    const {nome, email, senha, cpf, telefone} = req.body;
    const {usuario} = req;

    if(!validCPF.isValid(cpf)){
        return res.status(400).json("Digite um CPF válido.");
    }
    if(!validEmail.validate(email)){
        return res.status(400).json("Digite um email válido.");
    }
    if(telefone.length < 10 || telefone.length > 11){
        return res.status(404).json("O campo telefone precisa ter 10 ou 11 dígitos (Incluindo o ddd)");
    }    

    

    try {
        if(email){
            const checkNewEmail = await knex('usuarios').where('email', email).whereNot('id', usuario.id);
    
            if(checkNewEmail.length>0){
                return res.status(400).json("O e-mail informado já está cadastrado")
            }
        }

        if(cpf){
            const checkNewCPF = await knex('usuarios').where('cpf', cpf).whereNot('id', usuario.id);
    
            if(checkNewCPF.length>0){
                return res.status(400).json("O CPF informado já está cadastrado")
            }
        }
        
        let encryptedPassword;
        if(senha){
            encryptedPassword = await bcrypt.hash(senha,10);
        }
              
        const updateUserProfile = await knex('usuarios').update({nome,
         email, 
         senha: encryptedPassword, 
         cpf, 
         telefone}).where('id', usuario.id);

         if(updateUserProfile !== 1){
            return res.status(400).json("Não foi possível atualizar o cadastro do usuário.");
        }

        return res.status(200).json("Usuário atualizado com sucesso.");
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    signUpUser,
    userEdit
}