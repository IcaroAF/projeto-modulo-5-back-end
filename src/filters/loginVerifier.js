const jwt = require('jsonwebtoken');
const hashPwd = require('../hashPwd');
const knex = require('../connection');

const verifyLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if(!authorization){
        return res.status(404).json("Token não informado");
    }

    try {
        const token = authorization.replace('Bearer', '').trim();

        const { id } = jwt.verify(token, hashPwd);

        const verificationQuery = await knex('usuarios').where('id', id);

        if(verificationQuery.length === 0){
            return res.status(404).json("O usuário não foi encontrado.");
        }

        const {senha, ...usuario} = verificationQuery[0];

        req.usuario = usuario;

        next();
    } catch (error) {
        res.status(400).json(error.message);
    }
}

module.exports = verifyLogin; 