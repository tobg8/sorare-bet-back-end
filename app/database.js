const {
    Sequelize
} = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    define: {
        timestamps: false,
        underscored: true,
    },
    dialect: 'postgres',
    ssl: true,
    protocol: "postgres",
    logging: true,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false //
        }
    },
});

module.exports = sequelize;