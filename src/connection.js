const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'ec2-54-209-52-160.compute-1.amazonaws.com',
        user: 'eeomqmvwtjlnrs',
        password: '9e127672ea54c7bb8a4beeff7fd437bfeafcaa8eb418c3fb243e58fd58e92cf3',
        database: 'dbb5tcahb9q41o',
        port: 5432,
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
//       database : 'testelocal_desafio'
//     }
//   });

module.exports = knex;