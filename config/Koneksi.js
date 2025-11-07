import { Sequelize } from "sequelize";

const db = new Sequelize("sanggar", "root", "", {
    host: "localhost",
    dialect: "mysql",
});

export default db;