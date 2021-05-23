const axios = require('axios');
const gamesController = require('./app/controllers/gamesController');
const { League, Registration, Card } = require ('./app/models');

module.exports.cron_job = async () =>
{       
        const url = process.env.API_URL;
        // Fetch current Leagues
        try {
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
                                                const registrations = await Registration.findAll({
                                                where: {
                                                        league_id: leagueAlreadyInDB.id
                                                }, include: ['cards'],
                                                });

                                                // For each card of each registration
                                                registrations.map( async (registration) => {
                                                        // we create an array with slugs of card
                                                        const slugsArray = [];
                                                        registration.dataValues.cards.map( async (card) => {
                                                                slugsArray.push(card.slug);
                                                        });
                                                        console.log(slugsArray);
                                                        const ok = [
                                                                "yuta-matsumura-2020-rare-38",
                                                                "thibaut-courtois-2020-common-b53109ab-0dd1-4400-a982-2cbf10723312",
                                                                "laurtaro-giaccone-2020-rare-2",
                                                                "fabrice-olinga-essono-2020-rare-25",
                                                                "david-ospina-ramirez-2020-common-973982a6-755c-453b-81f1-ece786217a6b"
                                                              ]
                                                        // then we query last score of cards using our slugsArray
                                                        const fetchScores = await axios({
                                                                url: url,
                                                                method:'post',
                                                                data: {
                                                                        query:`{
                                                                                cards(slugs:[${[...ok]}]) {
                                                                                  player {
                                                                                    so5Scores(last: 1) {
                                                                                      score
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                        `
                                                                },
                                                        });
                                                        console.log(fetchScores.data);
                                                        console.log(fetchScores);
                                                });
                                                
                                                
        
                                        }
                                }
                        }
                       
                }
                        // si elle est nouvelle je l'insère en bdd je la met à open etc
                        // Si elle est pas nouvelle et qu'elle est passée de opened à started on modifie les propriété nécessaires
                        // SI elle est passée de started à closed on fait les scores on modifie les données.
        } 
        catch (error) {
           console.log(error);     
        }
        
}

require('make-runnable');