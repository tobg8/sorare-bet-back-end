const {
    Sequelize
} = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    define: {
        timestamps: false,
        underscored: true,
    },
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = sequelize;