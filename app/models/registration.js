const Sequelize = require('sequelize');
const sequelize = require('../database');

class Registration extends Sequelize.Model {};

Registration.init({
    manager_name: Sequelize.STRING,
    manager_id: Sequelize.STRING,
    manager_picture: Sequelize.STRING,
    total_score: Sequelize.INTEGER,
}, {
    sequelize,
    tableName: "registration",
});

module.exports = Registration;