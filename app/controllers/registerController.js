const axios = require('axios');
const {
    Card,
    Registration,
    League,
} = require('../models');

const registerController = {
    handleRegistration: async (req, res) => {
        const {jwt, team, userName, userId, userPicture} = req.body;
        // VERIFICATION
        console.log(req.body);
        // Team is composed of 5 cards
        if (team.length !==5) {
            return res.status(400).json({
                error: 'Incomplete team',
            });
        }
        // Only one common card
        const oneCommon = team.filter((card) => card.rarity === 'common');
        if (oneCommon.length > 1) {
            return res.status(400).json({
                error: 'You must use only one common card',
            });
        }
        // Only one goalkeeper
        const oneGoalKeeper = team.filter((card) => card.position === 'Goalkeeper');
        if (oneGoalKeeper.length > 1) {
            return res.status(400).json({
                error: 'You must use only one goalKeeper',
            });
        }
        // no duplicate cards
        const cards = team.map((card) => card.cardName);
        const isDuplicate = cards.some((card, index) => cards.indexOf(card) !== index);
        if (isDuplicate) {
            return res.status(400).json({
                error: 'You cannot use a card twice',
            });
        }
        // Je peux récupérer les cartes de l'user via CurrentUser (il détient bien ces cartes);
        const response = await axios ({
            url: process.env.API_URL,
            method: 'post',
            headers: {
                authorization: `Bearer ${jwt}`
            },
            data: {
                query: `
                    {
                    currentUser {
                        cards {
                            slug
                        }
                    }
                }
                `
            },
        });
        const managerCards = response.data.data.currentUser.cards;
        // We set an array where we'll push cards that match between team comp & currentUser cards
        const userHasCards = []
        // We format team so we get object with slug like managerCards
        const formatTeam = team.map((item) => {
            return {
                slug: item.cardName,
            }
        });
        const compareCards = managerCards.map((card) => {
            return formatTeam.filter((item) => item.slug === card.slug)
        });
        compareCards.forEach((array) => {
            if (array.length > 0) {
                userHasCards.push(array);
            }
        });

        if (userHasCards.length !== 5) {
            res.status(400).json({
                error: 'You do not own those cards',
            });
        }
        // i can register
        // We create registration on db 
            // get league_id of the current league
            try {
                const currentLeague = await League.findOne({
                    where: {
                        status: 'opened',
                    }
                });
                // if no more slots
                if (currentLeague.dataValues.registered_places === 200) {
                    return res.status(410).json({
                        error: 'The league is actually closed'
                    });
                }
                const leagueId = currentLeague.dataValues.id;
                const gwLeague = currentLeague.dataValues.game_week;

                // If already registered
                const managerAlreadyRegistered = await Registration.findOne({
                    where: {
                        manager_id: userId,
                    } 
                }, {
                    include: {
                        model: League,
                        where: {
                            game_week: gwLeague,
                        },
                    },
                })
                if (managerAlreadyRegistered) {
                    return res.status(403).json({
                        error: 'You are already registered',
                    });
                }

                // Remove 1 slot from league and add one to registered slots
                await currentLeague.decrement('max_places');
                await currentLeague.increment('registered_places');

                // Create record in Registration
                const newRegistration = await Registration.create({
                    manager_name: userName,
                    manager_id: userId,
                    manager_picture: userPicture,
                    total_score: 0,
                    league_id: leagueId,
                });

                const registrationId = newRegistration.dataValues.id;
                
                // Create records in Card
                for (const card of team)  {
                    await Card.create({
                        slug: card.cardName,
                        picture_url: card.url,
                        registration_id: registrationId, 
                    })
                }
                res.status(200).json({
                    message: `You are registered to the league ${gwLeague}`,
                    registered: true,
                });

            } catch (error) {
                console.log(error);
            }
    },
    isManagerRegistered: async (req, res) => {
        const { managerId} = req.body;
        const managerAlreadyRegistered = await Registration.findOne({
            where: {
                manager_id: managerId,
            } 
        }, {
            include: {
                model: League,
                where: {
                    status: 'opened',
                },
            },
        });
        if (managerAlreadyRegistered) {
            return res.status(200).json({
                registered: true,
                message: 'You are registered'
            });
        }
        return res.status(200);
    }
}

module.exports = registerController;