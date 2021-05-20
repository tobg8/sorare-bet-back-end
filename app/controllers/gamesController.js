const axios = require('axios');
const {
    League,
} = require('../models');

const gamesController = {
    getLeagues: async (req, res) => {
        const url = process.env.API_URL;
        try {
            const response = await axios ({
                url: url,
                method: 'post',
                data: {
                    query: `
                    {
                        featuredSo5Fixtures(first: 3) {
                          aasmState
                          gameWeek
                          slug
                          canCompose
                          startDate
                          endDate
                        }
                      }
                    `
                },
            });
            if (response.status === 200) {
                res.status(200).json(response.data.data.featuredSo5Fixtures)
            }
        } 
        catch (error) {
            console.log(error);
        }
    },
    getRemainingPlaces: async (req, res) => {
        const {gameWeek} = req.body;
        try {
            const league = await League.findOne({
                where: {
                    game_week: gameWeek,
                }
            });
            if (league) {
                res.status(200).json({
                    places_left: league.dataValues.max_places,
                    locked_places: league.dataValues.registered_places,
                });
                // console.log(league.dataValues);
            }
        } 
        catch (error) {
             console.log(error);
        }
    }
}

module.exports = gamesController;