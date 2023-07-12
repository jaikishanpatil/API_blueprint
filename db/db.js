const config = require("../config/config");
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

module.exports = db = {};

async function initilize() {
    const { host, port, user, password, database } = config.db
    const connection = await mysql.createConnection({
        host,
        port,
        user,
        password
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // CONNECT TO DB 
    const sequelize = new Sequelize(database, user, password, {
        dialect: "mysql",
        host
    });

    db.user =   require("../model/test.model")(sequelize)
    // init module and add them to the exported db object 
    await sequelize.sync({ alter: true })

}

initilize();