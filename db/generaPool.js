const { Pool } = require("pg");
require('dotenv').config();
const config = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    password: process.env.PG_PASS,
    port: process.env.PG_PORT,
    database: process.env.PG_DB,
    max: process.env.PG_POOL_MAX,
}
const pool = new Pool(config)
module.exports = {
    pool
}