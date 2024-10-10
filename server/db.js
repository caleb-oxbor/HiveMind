const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "Buddy16829!",
    host: "localhost",
    port: 5432,
    database: "hivemind"
});

module.exports = pool;