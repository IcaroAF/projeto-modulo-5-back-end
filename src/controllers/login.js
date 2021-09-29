const knex = require('../connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const hashPwd = require('../hashPwd');

const login = async (req, res) => {
    const {email, senha} = req.body;
    if(!email || !senha){
        return res.status(404).json('É obrigatório e-mail e senha');
    }

    try{
        const { rowCount, rows } = await knex('usuarios').where('email', email);

        if(rowCount === 0){
            return res.status(400).json("O usuário não foi encontrado");
        }

        const user = rows[0];

        const correctPassword = await bcrypt.compare(senha, user.senha);

        if(!correctPassword){
            return res.status(400).json("Email e senha não conferem");
        }

        const token = jwt.sign({ id: user.id}, hashPwd, { expiresIn: '2h'});

        const {senha: userPwd, ...userData } = user;

        return res.status(200).json({
            usuario: userData,
            token
        });
    } catch (error){
        return res.status(400).json(error.message);
    }
}

module.exports = {
    login
}