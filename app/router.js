const express = require('express');
const signInController = require('./controllers/signIn');
const gamesController = require('./controllers/gamesController');

const router = express.Router();

router.post('/salt', signInController.getSalt);
router.post('/login', signInController.tryLogin);
router.post('/auth', signInController.doubleAuthLogin);
router.post('/manager', signInController.getUserInfos);
router.post('/cards', signInController.getCards);

router.post('/leagues', gamesController.getLeagues);


module.exports = router;