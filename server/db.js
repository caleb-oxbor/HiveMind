const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "143033",
    host: "localhost",
    port: 5432,
    database: "hivemind"
});

modules.exports = pool;