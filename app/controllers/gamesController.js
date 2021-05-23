const axios = require('axios');
const { compareSync } = require('bcrypt');
const {
    League,
    Card,
    Registration,
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
        if (!gameWeek) {
            return res.status(400).json({
                error: 'Provide gameWeek',
            });
        }
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
    },
    getManagersFromLeague: async(req, res) => {
        const { gameWeek } = req.body;
        if(!gameWeek) {
            return res.status(400);
        }
        const league = await League.findOne({
            where: {
                game_week: gameWeek,
            }
        });
        if (!league) {
            return res.status(400);
        }

        const managers = await Registration.findAll({
            where: {
                league_id: league.dataValues.id,
            }
        });
        console.log(managers);

        const data = []
        managers.map((registration) => {
            data.push({
                manager_name: registration.dataValues.manager_name,
                manager_picture: registration.dataValues.manager_picture,
                game_week: gameWeek,
                manager_id: registration.dataValues.manager_id,
                id: registration.dataValues.id,
            })
        });
        res.status(200).json(data);
    },
    getTeamFromManager: async (req, res) => {
        const {registrationId, gameWeek } = req.body;

        if(!registrationId || !gameWeek) {
            return res.status(400).json({
                error: 'missing parameter(s)',
            });
        }
        
        try {
            const team = await Card.findAll({
                where: {
                    registration_id: registrationId
                }
            }, {
                include: {
                    model: League,
                    where: {
                        game_week: gameWeek,
                    }
                }
            });
            const managerTeam = [];
            team.map((card) => {
                managerTeam.push({
                    id: card.dataValues.id,
                    slug: card.dataValues.slug,
                    picture_url: card.dataValues.picture_url,
                });
            });
            res.status(200).json(managerTeam);
        } 
        catch (error) {
            console.log(error);
        }
    },
    getManagersTeamFromLeague: async (req, res) => {
        const { gameWeek } = req.body;
        
        if (!gameWeek) {
            return res.status(400).json({
                error: 'missing gameWeek',
            });
        }

        try {
            // retrieve league Id
            const league = await League.findOne({
                where: {
                    game_week: gameWeek
                }
            });
            const leagueId = league.dataValues.id
            // Get registrations + teamComp where leagueId match
            const registrations = await Registration.findAll({
                where: {
                    league_id: leagueId,
                }, include: ['cards'],
            });
            const managers = [];
            registrations.map((manager) => managers.push(manager.dataValues));
            res.status(200).json(managers);
        }
         catch (error) {
            console.log(error);
        }
    }
}

module.exports = gamesController;