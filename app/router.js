const express = require('express');
const signInController = require('./controllers/signIn');
const gamesController = require('./controllers/gamesController');
const registerController = require('./controllers/registerController');

const router = express.Router();
// Sorare
router.post('/salt', signInController.getSalt);
router.post('/login', signInController.tryLogin);
router.post('/auth', signInController.doubleAuthLogin);
router.post('/manager', signInController.getUserInfos);
router.post('/cards', signInController.getCards);

router.post('/leagues', gamesController.getLeagues);
router.post('/places', gamesController.getRemainingPlaces);
router.post('/manager-in-league', gamesController.getManagersFromLeague);
router.post('/manager-team', gamesController.getTeamFromManager);

// own db
router.post('/registration', registerController.handleRegistration);
router.post('/registered', registerController.isManagerRegistered);



module.exports = router;