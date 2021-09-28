const knex = require('../connection');
const bcrypt = require('bcrypt');

const SignUpUser = async (req, res) => {
    const {nome, email, senha, cpf, telefone} = req.body;

    if(!nome){
        return res.status(404).json("O campo nome é obrigatório");
    }
    if(!email){
        return res.status(404).json("O campo email é obrigatório");
    }
    if(!senha){
        return res.status(404).json("O campo senha é obrigatório");
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
            cpf,
            telefone
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

module.exports = {
    SignUpUser,
}