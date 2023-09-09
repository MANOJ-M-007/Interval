import mysql from 'mysql'

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Manojsqlm',
    database: 'taskmanager',
});

export default db;
