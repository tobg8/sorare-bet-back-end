const Sequelize = require('sequelize');
const sequelize = require('../database');

class Card extends Sequelize.Model {};

Card.init({
    slug: Sequelize.STRING,
    picture_url: Sequelize.STRING,
    score: Sequelize.STRING,
}, {
    sequelize,
    tableName: "card",
});

module.exports = Card;