import { Sequelize } from "sequelize";

const db = new Sequelize("u220341190_sanggar", "u220341190_sanggar", "@Hidayatullah23", {
    host: "srv1200.hstgr.io",
    dialect: "mysql",
});

export default db;