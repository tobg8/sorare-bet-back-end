const axios = require('axios');
const gamesController = require('./app/controllers/gamesController');
const { League } = require ('./app/models');

module.exports.cron_job = async () =>
{       
        // Fetch current Leagues
        const leagues = await gamesController.getLeagues();
        // Pour chacune des league reçues je vais voir si elle existe dans ma bdd,
                // si elle est nouvelle je l'insère en bdd je la met à open etc
                // Si elle est pas nouvelle et qu'elle est passée de opened à started on modifie les propriété nécessaires
                // SI elle est passée de started à closed on fait les scores on modifie les données.

        console.log(leagues);
}

require('make-runnable');