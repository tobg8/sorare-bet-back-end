const Sequelize = require('sequelize');
const sequelize = require('../database');

class League extends Sequelize.Model {};

League.init({
    game_week: Sequelize.STRING,
    duration: Sequelize.STRING,
    open_date: Sequelize.DATE,
    close_date: Sequelize.DATE,
    max_places: Sequelize.INTEGER,
    registered_places: Sequelize.INTEGER,
    status: Sequelize.STRING,
    open: Sequelize.BOOLEAN,
}, {
    sequelize,
    tableName: "league"
});

module.exports = League;