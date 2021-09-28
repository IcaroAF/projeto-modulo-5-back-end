const { Pool } = require('pg');

const pool = new Pool({
    user: '',
    host: '',
    database: '',
    password: '',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

const query = (text, param) => {
    return pool.query(text, param);
}

module.exports = {
    query
};