const Sequelize = require('sequelize');
const sequelize = require('../database');

class Card extends Sequelize.Model {};

Card.init({
    slug: Sequelize.STRING,
}, {
    sequelize,
    tableName: "card",
});

module.exports = Card;