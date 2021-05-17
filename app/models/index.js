const Card = require('./card');
const League = require('./league');
const Registration = require('./registration');

// Relation League <-> Registration
League.hasMany(Registration, {
    foreignKey: "league_id",
    as: "registrations",
});

Registration.belongsTo(League, {
    foreignKey: "league_id",
    as: "league",
})

Registration.hasMany(Card, {
    foreignKey: "registration_id",
    as: "cards",
});

Card.belongsTo(Registration, {
    foreignKey: "registration_id",
    as: "registration"
});

module.exports = {
    League,
    Registration,
    Card,
};