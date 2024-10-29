const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "meow",
    host: "localhost",
    port: 5432,
    database: "hivemind"
});

module.exports = pool;