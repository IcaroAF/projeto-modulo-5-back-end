const knex = require('../connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const login = async (req, res) => {
    const {email, senha} = req.body;
    if(!email || !senha){
        return res.status(404).json('É obrigatório e-mail e senha');
    }

    try{
        const userLogin = await knex('usuarios').where('email', email);

        if(userLogin.length === 0){
            return res.status(400).json("O usuário não foi encontrado");
        }

        const user = userLogin[0];

        const correctPassword = await bcrypt.compare(senha, user.senha);

        if(!correctPassword){
            return res.status(400).json("Email e senha não conferem");
        }

        const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET, { expiresIn: '2h'});

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