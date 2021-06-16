const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'dbAlexCusto',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    password: 'Alex.Shish3011'
    //password: 'userDBTMM.Progetto01'
});


module.exports = pool;