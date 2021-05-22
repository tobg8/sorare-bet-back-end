const axios = require('axios');
const gamesController = require('./app/controllers/gamesController');
const { League } = require ('./app/models');

module.exports.cron_job = async () =>
{       
        const url = process.env.API_URL;
        // Fetch current Leagues
        const fetchLeagues = await axios({
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

        const newLeagues = fetchLeagues.data.data.featuredSo5Fixtures;
        console.log(newLeagues);
        // Pour chacune des league reçues je vais voir si elle existe dans ma bdd.
        for (const league of newLeagues) {
                const leagueAlreadyInDB = await League.findOne({
                        where: {
                                game_week: league.gameWeek,
                        }
                });
                //If league does not exist in db it means it's the new one
                if (!leagueAlreadyInDB) {
                        newLeague = await League.create({
                                game_week:  league.gameWeek, 
                                duration: league.slug,
                                open_date: league.startDate,
                                close_date: league.endDate,
                                max_places: 200,
                                registered_places: 0,
                                status: league.aasmState,
                                open: league.canCompose,
                        });
                }
                if (leagueAlreadyInDB) {
                         // If league doesnt have same status we modif values, but for closed we do score.
                        if(league.aasmState !== leagueAlreadyInDB.status) {
                                console.log('heeloooooo');
                                leagueAlreadyInDB.status = league.aasmState;
                                leagueAlreadyInDB.open = league.canCompose;
                                await leagueAlreadyInDB.save();
                                if (league.aasmState === 'closed') {
                                        console.log('we got to do scores here');
                                }
                        }
                }
               
        }
                // si elle est nouvelle je l'insère en bdd je la met à open etc
                // Si elle est pas nouvelle et qu'elle est passée de opened à started on modifie les propriété nécessaires
                // SI elle est passée de started à closed on fait les scores on modifie les données.
}

require('make-runnable');