const knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.PG_HOST,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE,
        port: process.env.PG_PORT,
        ssl:{
            rejectUnauthorized: false
        }
    }
});

// const knex = require('knex')({
//     client: 'pg',
//     connection: {
//       host : 'localhost',
//       user : 'postgres',
//       password : 'postgres',
//       database : 'testelocal_desafio',
//       port: 5432
//     }
//   });

module.exports = knex;